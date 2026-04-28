import { fail } from "../utils/apiResponse.js";

export function validate(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return fail(res, "Validation failed", 422, parsed.error.flatten());
    }
    req.body = parsed.data;
    return next();
  };
}
