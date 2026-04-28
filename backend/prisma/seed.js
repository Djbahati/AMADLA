import bcrypt from "bcryptjs";
import { PrismaClient, BillStatus, ProjectType, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.payment.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.energyUsage.deleteMany();
  await prisma.userProject.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Password123!", 10);

  const admin = await prisma.user.create({
    data: {
      fullName: "System Admin",
      email: "admin@amadla.energy",
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  const operator = await prisma.user.create({
    data: {
      fullName: "Site Operator",
      email: "operator@amadla.energy",
      passwordHash,
      role: UserRole.OPERATOR,
    },
  });

  const customer = await prisma.user.create({
    data: {
      fullName: "Customer One",
      email: "customer@amadla.energy",
      passwordHash,
      role: UserRole.USER,
    },
  });

  const project = await prisma.project.create({
    data: {
      name: "Lusaka Solar Site A",
      location: "Lusaka",
      capacityKwh: 1800,
      pricePerUnit: 0.45,
      lowProductionLimit: 60,
      overuseLimit: 140,
      type: ProjectType.SOLAR,
    },
  });

  await prisma.userProject.createMany({
    data: [
      { userId: customer.id, projectId: project.id },
      { userId: operator.id, projectId: project.id },
    ],
  });

  const usage = await prisma.energyUsage.create({
    data: {
      userId: customer.id,
      projectId: project.id,
      usageDate: new Date(),
      consumedKwh: 210,
      producedKwh: 170,
      recordedById: operator.id,
    },
  });

  const amountDue = Number(usage.consumedKwh) * Number(project.pricePerUnit);

  const bill = await prisma.bill.create({
    data: {
      userId: customer.id,
      projectId: project.id,
      periodStart: new Date(Date.now() - 30 * 24 * 3600 * 1000),
      periodEnd: new Date(),
      totalUsageKwh: usage.consumedKwh,
      unitPrice: project.pricePerUnit,
      amountDue,
      amountPaid: 25,
      outstandingBalance: amountDue - 25,
      dueDate: new Date(Date.now() + 10 * 24 * 3600 * 1000),
      status: BillStatus.PARTIALLY_PAID,
    },
  });

  await prisma.payment.create({
    data: {
      billId: bill.id,
      userId: customer.id,
      amount: 25,
      paymentMethod: "MOBILE_MONEY",
      transactionRef: `TXN-${Date.now()}`,
    },
  });

  await prisma.alert.createMany({
    data: [
      {
        projectId: project.id,
        type: "LOW_PRODUCTION",
        message: "Production is below threshold for Site A.",
      },
      {
        userId: customer.id,
        projectId: project.id,
        type: "PAYMENT_DUE",
        message: "Your bill is due in 10 days.",
      },
    ],
  });

  console.log("Seed complete.");
  console.log({
    admin: "admin@amadla.energy / Password123!",
    operator: "operator@amadla.energy / Password123!",
    user: "customer@amadla.energy / Password123!",
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
