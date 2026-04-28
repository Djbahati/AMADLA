import { prisma } from "../config/prisma.js";
import { ok } from "../utils/apiResponse.js";

export async function listAlerts(req, res) {
  const alerts = await prisma.alert.findMany({
    where: req.user.role === "USER" ? { userId: req.user.id } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return ok(res, alerts, "Alerts retrieved");
}

export async function resolveAlert(req, res) {
  const alert = await prisma.alert.update({
    where: { id: req.params.id },
    data: { isResolved: true },
  });
  return ok(res, alert, "Alert resolved");
}
