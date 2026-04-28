import { BillStatus } from "@prisma/client";

export function computeBillStatus(amountDue, amountPaid, dueDate) {
  if (amountPaid >= amountDue) return BillStatus.PAID;
  if (amountPaid > 0) return BillStatus.PARTIALLY_PAID;
  if (new Date(dueDate) < new Date()) return BillStatus.OVERDUE;
  return BillStatus.PENDING;
}
