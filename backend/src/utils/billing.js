import { BillStatus } from "@prisma/client";

function roundToMoney(value) {
  return Math.round(Number(value) * 100) / 100;
}

export function computeBillStatus(amountDue, amountPaid, dueDate) {
  const due = roundToMoney(amountDue);
  const paid = roundToMoney(amountPaid);
  if (paid >= due) return BillStatus.PAID;
  if (new Date(dueDate) < new Date()) return BillStatus.OVERDUE;
  if (paid > 0) return BillStatus.PARTIALLY_PAID;
  return BillStatus.PENDING;
}

export function calculateMoney(input) {
  return roundToMoney(input);
}
