import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { fail } from "../utils/apiResponse.js";

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return fail(res, "Authorization token missing", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, isActive: true, fullName: true },
    });

    if (!user || !user.isActive) return fail(res, "Unauthorized", 401);
    req.user = user;
    next();
  } catch {
    return fail(res, "Invalid or expired token", 401);
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return fail(res, "Unauthorized", 401);
    if (!roles.includes(req.user.role)) return fail(res, "Forbidden", 403);
    return next();
  };
}
