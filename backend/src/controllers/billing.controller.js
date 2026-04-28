import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { fail, ok } from "../utils/apiResponse.js";
import { calculateMoney, computeBillStatus } from "../utils/billing.js";
import { createAlert } from "../services/alertService.js";

const billSchema = z.object({
  userId: z.string().min(1),
  projectId: z.string().min(1),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  dueDate: z.string().datetime(),
});

const paymentSchema = z.object({
  billId: z.string().min(1),
  amount: z.number().positive(),
  paymentMethod: z.string().min(2),
});

export async function generateBill(req, res) {
  const parsed = billSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, "Validation failed", 422, parsed.error.flatten());

  const periodStart = new Date(parsed.data.periodStart);
  const periodEnd = new Date(parsed.data.periodEnd);
  const dueDate = new Date(parsed.data.dueDate);
  if (periodStart >= periodEnd) return fail(res, "periodStart must be before periodEnd", 422);
  if (dueDate < periodEnd) return fail(res, "dueDate must be on or after periodEnd", 422);

  const [project, assignment, existingBill] = await Promise.all([
    prisma.project.findUnique({ where: { id: parsed.data.projectId } }),
    prisma.userProject.findUnique({
      where: {
        userId_projectId: { userId: parsed.data.userId, projectId: parsed.data.projectId },
      },
    }),
    prisma.bill.findFirst({
      where: {
        userId: parsed.data.userId,
        projectId: parsed.data.projectId,
        periodStart,
        periodEnd,
      },
    }),
  ]);
  if (!project) return fail(res, "Project not found", 404);
  if (!assignment) return fail(res, "User is not assigned to this project", 400);
  if (existingBill) return fail(res, "Bill for this project/user/period already exists", 409);

  const usageRows = await prisma.energyUsage.findMany({
    where: {
      userId: parsed.data.userId,
      projectId: parsed.data.projectId,
      usageDate: {
        gte: periodStart,
        lte: periodEnd,
      },
    },
  });

  const totalUsageKwh = calculateMoney(usageRows.reduce((sum, row) => sum + Number(row.consumedKwh), 0));
  const unitPrice = calculateMoney(project.pricePerUnit);
  const amountDue = calculateMoney(totalUsageKwh * unitPrice);

  const bill = await prisma.bill.create({
    data: {
      userId: parsed.data.userId,
      projectId: parsed.data.projectId,
      periodStart,
      periodEnd,
      dueDate,
      totalUsageKwh,
      unitPrice,
      amountDue,
      amountPaid: 0,
      outstandingBalance: amountDue,
      status: computeBillStatus(amountDue, 0, parsed.data.dueDate),
    },
  });

  await createAlert({
    userId: parsed.data.userId,
    projectId: parsed.data.projectId,
    type: "PAYMENT_DUE",
    message: `New bill generated. Amount due: ${amountDue.toFixed(2)}`,
  });

  return ok(res, bill, "Bill generated", 201);
}

export async function listBills(req, res) {
  const bills = await prisma.bill.findMany({
    where: req.user.role === "USER" ? { userId: req.user.id } : undefined,
    include: {
      project: { select: { id: true, name: true } },
      user: { select: { id: true, fullName: true, email: true } },
      payments: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return ok(res, bills, "Bills retrieved");
}

export async function payBill(req, res) {
  const parsed = paymentSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, "Validation failed", 422, parsed.error.flatten());

  try {
    const result = await prisma.$transaction(async (tx) => {
      const bill = await tx.bill.findUnique({ where: { id: parsed.data.billId } });
      if (!bill) {
        const error = new Error("Bill not found");
        error.statusCode = 404;
        throw error;
      }
      if (req.user.role === "USER" && bill.userId !== req.user.id) {
        const error = new Error("Forbidden");
        error.statusCode = 403;
        throw error;
      }
      if (Number(bill.outstandingBalance) <= 0) {
        const error = new Error("Bill is already fully paid");
        error.statusCode = 400;
        throw error;
      }
      if (parsed.data.amount > Number(bill.outstandingBalance)) {
        const error = new Error("Payment amount cannot exceed outstanding balance");
        error.statusCode = 422;
        throw error;
      }

      const newAmountPaid = calculateMoney(Number(bill.amountPaid) + parsed.data.amount);
      const outstanding = calculateMoney(Math.max(0, Number(bill.amountDue) - newAmountPaid));
      const status = computeBillStatus(Number(bill.amountDue), newAmountPaid, bill.dueDate);

      // Optimistic concurrency guard: only update if snapshot is unchanged.
      const updated = await tx.bill.updateMany({
        where: {
          id: bill.id,
          amountPaid: bill.amountPaid,
          outstandingBalance: bill.outstandingBalance,
        },
        data: {
          amountPaid: newAmountPaid,
          outstandingBalance: outstanding,
          status,
        },
      });

      if (updated.count !== 1) {
        const error = new Error("Bill was updated by another payment. Please retry.");
        error.statusCode = 409;
        throw error;
      }

      const payment = await tx.payment.create({
        data: {
          billId: bill.id,
          userId: bill.userId,
          amount: parsed.data.amount,
          paymentMethod: parsed.data.paymentMethod,
          transactionRef: `PAY-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
        },
      });

      const updatedBill = await tx.bill.findUnique({ where: { id: bill.id } });
      return { payment, updatedBill };
    });

    return ok(res, result, "Payment recorded");
  } catch (error) {
    if (error.statusCode) return fail(res, error.message, error.statusCode);
    throw error;
  }
}

export async function paymentHistory(req, res) {
  const payments = await prisma.payment.findMany({
    where: req.user.role === "USER" ? { userId: req.user.id } : undefined,
    include: {
      bill: {
        select: {
          id: true,
          amountDue: true,
          outstandingBalance: true,
          project: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { paidAt: "desc" },
  });

  return ok(res, payments, "Payment history retrieved");
}