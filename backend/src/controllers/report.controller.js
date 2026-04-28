import { stringify } from "csv-stringify/sync";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { prisma } from "../config/prisma.js";

export async function exportUsageCsv(req, res) {
  const usage = await prisma.energyUsage.findMany({
    include: {
      user: { select: { fullName: true, email: true } },
      project: { select: { name: true, location: true } },
    },
    orderBy: { usageDate: "desc" },
  });

  const csv = stringify(
    usage.map((row) => ({
      date: row.usageDate.toISOString(),
      user: row.user.fullName,
      email: row.user.email,
      project: row.project.name,
      location: row.project.location,
      consumedKwh: row.consumedKwh,
      producedKwh: row.producedKwh,
    })),
    { header: true },
  );

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=usage-report.csv");
  res.send(csv);
}

export async function exportRevenuePdf(req, res) {
  const payments = await prisma.payment.findMany({
    include: {
      user: { select: { fullName: true, email: true } },
      bill: { include: { project: { select: { name: true } } } },
    },
    orderBy: { paidAt: "desc" },
    take: 200,
  });

  const doc = new jsPDF();
  doc.text("Amadla Energy Revenue Report", 14, 15);
  autoTable(doc, {
    startY: 22,
    head: [["Date", "Customer", "Project", "Amount"]],
    body: payments.map((p) => [
      new Date(p.paidAt).toLocaleDateString(),
      p.user.fullName,
      p.bill.project.name,
      Number(p.amount).toFixed(2),
    ]),
  });

  const output = doc.output("arraybuffer");
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=revenue-report.pdf");
  res.send(Buffer.from(output));
}
