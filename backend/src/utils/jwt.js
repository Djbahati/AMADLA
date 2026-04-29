import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh-secret-key-change-in-production";

export function generateTokens(user) {
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      type: "access",
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn || "15m",
      subject: user.id,
    }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
      type: "refresh",
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
      subject: user.id,
    }
  );

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch (err) {
    throw new Error(`Invalid access token: ${err.message}`);
  }
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new Error(`Invalid refresh token: ${err.message}`);
  }
}

export function decodeToken(token) {
  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  return decoded.exp * 1000 < Date.now();
}

export function getTokenExpiryIn(token) {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;
  return Math.floor((decoded.exp * 1000 - Date.now()) / 1000);
}
