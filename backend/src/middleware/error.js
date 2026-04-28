import { fail } from "../utils/apiResponse.js";

export function notFound(req, res) {
  return fail(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
}

export function errorHandler(error, req, res, next) {
  console.error(error);
  if (res.headersSent) return next(error);
  if (error.code === "P2002") {
    return fail(res, "Duplicate record conflict", 409, error.meta);
  }
  if (error.code === "P2025") {
    return fail(res, "Requested record not found", 404);
  }
  return fail(res, error.message || "Internal server error", 500);
}
