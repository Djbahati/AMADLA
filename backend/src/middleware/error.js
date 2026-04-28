import { fail } from "../utils/apiResponse.js";

export function notFound(req, res) {
  return fail(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
}

export function errorHandler(error, req, res, next) {
  console.error(error);
  if (res.headersSent) return next(error);
  return fail(res, error.message || "Internal server error", 500);
}
