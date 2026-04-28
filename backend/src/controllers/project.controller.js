import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { fail, ok } from "../utils/apiResponse.js";

const projectSchema = z.object({
  name: z.string().min(2),
  location: z.string().min(2),
  capacityKwh: z.number().positive(),
  pricePerUnit: z.number().positive(),
  lowProductionLimit: z.number().positive().optional(),
  overuseLimit: z.number().positive().optional(),
  type: z.enum(["SOLAR", "GRID", "HYBRID"]),
});

export async function createProject(req, res) {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, "Validation failed", 422, parsed.error.flatten());
  const payload = { ...parsed.data, name: parsed.data.name.trim(), location: parsed.data.location.trim() };
  const project = await prisma.project.create({ data: payload });
  return ok(res, project, "Project created", 201);
}

export async function listProjects(req, res) {
  const projects = await prisma.project.findMany({
    include: { userLinks: { include: { user: { select: { id: true, fullName: true, email: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  return ok(res, projects, "Projects retrieved");
}

export async function assignUserToProject(req, res) {
  const { projectId } = req.params;
  const payload = z.object({ userId: z.string().min(1) }).safeParse(req.body);
  if (!payload.success) return fail(res, "Validation failed", 422, payload.error.flatten());
  const [project, user] = await Promise.all([
    prisma.project.findUnique({ where: { id: projectId }, select: { id: true, isActive: true } }),
    prisma.user.findUnique({ where: { id: payload.data.userId }, select: { id: true, isActive: true } }),
  ]);
  if (!project || !project.isActive) return fail(res, "Project not found or inactive", 404);
  if (!user || !user.isActive) return fail(res, "User not found or inactive", 404);

  const link = await prisma.userProject.upsert({
    where: { userId_projectId: { userId: payload.data.userId, projectId } },
    update: {},
    create: { userId: payload.data.userId, projectId },
  });

  return ok(res, link, "User assigned");
}
