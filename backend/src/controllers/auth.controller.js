import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { fail, ok } from "../utils/apiResponse.js";

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function signToken(user) {
  return jwt.sign({ role: user.role, email: user.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
    subject: user.id,
  });
}

export async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, "Validation failed", 422, parsed.error.flatten());

  const { fullName, password } = parsed.data;
  const email = parsed.data.email.toLowerCase().trim();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return fail(res, "Email already in use", 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { fullName, email, passwordHash, role: "USER" },
    select: { id: true, fullName: true, email: true, role: true },
  });

  const token = signToken(user);
  return ok(res, { token, user }, "User registered", 201);
}

export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, "Validation failed", 422, parsed.error.flatten());

  const { password } = parsed.data;
  const email = parsed.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return fail(res, "Invalid credentials", 401);
  if (!user.isActive) return fail(res, "Account is inactive", 403);

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return fail(res, "Invalid credentials", 401);

  const token = signToken(user);
  return ok(
    res,
    {
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    },
    "Login successful",
  );
}

export async function me(req, res) {
  return ok(res, req.user, "Current user");
}
