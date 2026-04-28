import { prisma } from "../config/prisma.js";
import { ok } from "../utils/apiResponse.js";

export async function getAdminSummary(req, res) {
  const [projects, alerts, activeUsers, usageAgg, revenueAgg] = await Promise.all([
    prisma.project.findMany({ include: { _count: { select: { userLinks: true } } } }),
    prisma.alert.findMany({ where: { isResolved: false }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.user.count({ where: { isActive: true } }),
    prisma.energyUsage.aggregate({ _sum: { producedKwh: true, consumedKwh: true } }),
    prisma.payment.aggregate({ _sum: { amount: true } }),
  ]);

  return ok(res, {
    projects,
    kpis: {
      totalEnergyGenerated: Number(usageAgg._sum.producedKwh || 0),
      totalEnergyConsumed: Number(usageAgg._sum.consumedKwh || 0),
      totalRevenue: Number(revenueAgg._sum.amount || 0),
      activeUsers,
    },
    alerts,
  });
}
