import { z } from "zod";
import { ok, fail } from "../utils/apiResponse.js";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(10),
});

export async function submitContactForm(req, res) {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, "Validation failed", 422, parsed.error.flatten());
  }

  const payload = parsed.data;
  console.log("Contact request received:", payload);

  // In a production system, persist contact submissions and integrate with CRM / email.
  return ok(res, { received: true }, "Contact request submitted");
}
