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

  const bill = await prisma.bill.findUnique({ where: { id: parsed.data.billId } });
  if (!bill) return fail(res, "Bill not found", 404);
  if (req.user.role === "USER" && bill.userId !== req.user.id) return fail(res, "Forbidden", 403);
  if (Number(bill.outstandingBalance) <= 0) return fail(res, "Bill is already fully paid", 400);
  if (parsed.data.amount > Number(bill.outstandingBalance)) {
    return fail(res, "Payment amount cannot exceed outstanding balance", 422);
  }

  const newAmountPaid = calculateMoney(Number(bill.amountPaid) + parsed.data.amount);
  const outstanding = calculateMoney(Math.max(0, Number(bill.amountDue) - newAmountPaid));
  const status = computeBillStatus(Number(bill.amountDue), newAmountPaid, bill.dueDate);

  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        billId: bill.id,
        userId: bill.userId,
        amount: parsed.data.amount,
        paymentMethod: parsed.data.paymentMethod,
        transactionRef: `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      },
    });

    const updatedBill = await tx.bill.update({
      where: { id: bill.id },
      data: {
        amountPaid: newAmountPaid,
        outstandingBalance: outstanding,
        status,
      },
    });

    return { payment, updatedBill };
  });

  return ok(res, result, "Payment recorded");
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
