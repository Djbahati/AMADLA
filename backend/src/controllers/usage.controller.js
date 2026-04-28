import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { fail, ok } from "../utils/apiResponse.js";
import { generateUsageAlerts } from "../services/alertService.js";

const usageSchema = z.object({
  userId: z.string().min(1),
  projectId: z.string().min(1),
  usageDate: z.string().datetime(),
  consumedKwh: z.number().nonnegative(),
  producedKwh: z.number().nonnegative(),
});

export async function recordUsage(req, res) {
  const parsed = usageSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, "Validation failed", 422, parsed.error.flatten());

  const [project, assignment] = await Promise.all([
    prisma.project.findUnique({ where: { id: parsed.data.projectId } }),
    prisma.userProject.findUnique({
      where: {
        userId_projectId: { userId: parsed.data.userId, projectId: parsed.data.projectId },
      },
    }),
  ]);
  if (!project) return fail(res, "Project not found", 404);
  if (!assignment) return fail(res, "User must be assigned to this project before usage recording", 400);

  const usage = await prisma.energyUsage.create({
    data: {
      ...parsed.data,
      usageDate: new Date(parsed.data.usageDate),
      recordedById: req.user.id,
    },
  });

  await generateUsageAlerts({
    project,
    userId: parsed.data.userId,
    producedKwh: parsed.data.producedKwh,
    consumedKwh: parsed.data.consumedKwh,
  });

  return ok(res, usage, "Usage recorded", 201);
}

export async function listUsage(req, res) {
  const usage = await prisma.energyUsage.findMany({
    where: req.user.role === "USER" ? { userId: req.user.id } : undefined,
    include: {
      user: { select: { id: true, fullName: true, email: true } },
      project: { select: { id: true, name: true, location: true } },
    },
    orderBy: { usageDate: "desc" },
  });
  return ok(res, usage, "Energy usage retrieved");
}
