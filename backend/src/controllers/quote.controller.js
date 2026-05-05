import { z } from "zod";
import { ok, fail } from "../utils/apiResponse.js";

const quoteSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  location: z.string().min(2),
  monthlyUsageKwh: z.number().positive(),
  budget: z.number().positive(),
  projectType: z.enum(["SOLAR", "HYBRID", "GRID"]),
  currentTariff: z.number().positive().optional(),
  notes: z.string().optional(),
});

const costPerKw = {
  SOLAR: 900,
  HYBRID: 1200,
  GRID: 650,
};

const solutionLabels = {
  SOLAR: "Solar photovoltaic array with integrated storage",
  HYBRID: "Hybrid solar-grid microgrid with battery backup",
  GRID: "Grid optimization and demand response integration",
};

export async function recommendQuote(req, res) {
  const parsed = quoteSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, "Validation failed", 422, parsed.error.flatten());
  }

  const { monthlyUsageKwh, budget, projectType, currentTariff = 0.18 } = parsed.data;
  const dailyUsage = monthlyUsageKwh / 30;
  const estimatedCapacity = Math.max(5, Number((dailyUsage / 4).toFixed(1)));
  const estimatedCost = Math.round(estimatedCapacity * costPerKw[projectType]);
  const annualEnergyCost = monthlyUsageKwh * currentTariff * 12;
  const annualSavings = Math.max(0, Number((annualEnergyCost * 0.45).toFixed(0)));
  const paybackYears = Number(Math.max(2, Math.round((estimatedCost / Math.max(annualSavings, 1)) * 10) / 10).toFixed(1));
  const carbonSavings = Number((monthlyUsageKwh * 0.7 * 12 / 1000).toFixed(1));

  const recommendation = {
    solution: solutionLabels[projectType],
    estimatedCapacity,
    estimatedCost,
    annualSavings,
    paybackYears,
    carbonSavings,
    budgetFit: estimatedCost <= budget,
    currentTariff,
    projectType,
  };

  return ok(res, recommendation, "Quote recommendation generated");
}
