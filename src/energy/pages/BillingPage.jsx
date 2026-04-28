import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function BillingPage() {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);
  const [payingBillId, setPayingBillId] = useState("");
  const [amount, setAmount] = useState("");

  async function load() {
    const [billData, paymentData] = await Promise.all([api.bills(), api.payments()]);
    setBills(billData);
    setPayments(paymentData);
  }

  useEffect(() => {
    load();
  }, []);

  async function pay(event) {
    event.preventDefault();
    await api.payBill({
      billId: payingBillId,
      amount: Number(amount),
      paymentMethod: "MOBILE_MONEY",
    });
    setAmount("");
    await load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-amber-400">Billing & Payments</h1>
      <section className="space-y-2">
        {bills.map((bill) => (
          <div key={bill.id} className="rounded bg-slate-900 p-3">
            <p className="font-medium">{bill.project.name} | {bill.status}</p>
            <p className="text-sm">Due: ${Number(bill.amountDue).toFixed(2)} | Paid: ${Number(bill.amountPaid).toFixed(2)} | Outstanding: ${Number(bill.outstandingBalance).toFixed(2)}</p>
            {user.role === "USER" && Number(bill.outstandingBalance) > 0 && (
              <button className="mt-2 rounded bg-amber-500 px-3 py-1 text-slate-900" onClick={() => setPayingBillId(bill.id)}>
                Pay This Bill
              </button>
            )}
          </div>
        ))}
      </section>
      {payingBillId && (
        <form className="flex gap-2 rounded bg-slate-900 p-4" onSubmit={pay}>
          <input className="rounded bg-slate-800 p-2" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <button className="rounded bg-green-600 px-3 py-2">Submit Payment</button>
        </form>
      )}
      <section>
        <h2 className="mb-2 text-lg">Payment History</h2>
        <div className="space-y-2">
          {payments.map((payment) => (
            <div key={payment.id} className="rounded bg-slate-900 p-3">
              <p className="text-sm">Amount: ${Number(payment.amount).toFixed(2)} | Date: {new Date(payment.paidAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
