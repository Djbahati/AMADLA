import { AlertType } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export async function createAlert({ userId = null, projectId = null, type, message }) {
  return prisma.alert.create({
    data: { userId, projectId, type, message },
  });
}

export async function generateUsageAlerts({ project, userId, producedKwh, consumedKwh }) {
  const actions = [];

  if (Number(producedKwh) < Number(project.lowProductionLimit)) {
    actions.push(
      createAlert({
        projectId: project.id,
        type: AlertType.LOW_PRODUCTION,
        message: `Low production at ${project.name}. Produced ${producedKwh} kWh.`,
      }),
    );
  }

  if (Number(consumedKwh) > Number(project.overuseLimit)) {
    actions.push(
      createAlert({
        userId,
        projectId: project.id,
        type: AlertType.OVERUSE,
        message: `Usage exceeded threshold (${consumedKwh} kWh) for ${project.name}.`,
      }),
    );
  }

  await Promise.all(actions);
}
