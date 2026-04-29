import { fail, ok } from "../utils/apiResponse.js";

// Simple in-memory token blacklist (use Redis in production)
const tokenBlacklist = new Set();

export function addTokenToBlacklist(token) {
  tokenBlacklist.add(token);
}

export function isTokenBlacklisted(token) {
  return tokenBlacklist.has(token);
}

export function logout(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      addTokenToBlacklist(token);
    }

    return ok(res, null, "Logged out successfully");
  } catch (error) {
    return fail(res, "Logout failed", 400);
  }
}
