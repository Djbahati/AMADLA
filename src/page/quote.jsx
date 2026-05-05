import { useState } from 'react';
import { motion } from 'framer-motion';
import { apiClient } from '@/utils/apiClient';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Textarea } from '@/component/ui/textarea';
import { Label } from '@/component/ui/label';

const formDefaults = {
  fullName: '',
  email: '',
  location: '',
  monthlyUsageKwh: '',
  budget: '',
  projectType: 'SOLAR',
  currentTariff: '',
};

export default function Quote() {
  const [form, setForm] = useState(formDefaults);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const setField = (name) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        ...form,
        monthlyUsageKwh: Number(form.monthlyUsageKwh),
        budget: Number(form.budget),
        currentTariff: Number(form.currentTariff) || 0.18,
      };

      const response = await apiClient.post('/quote/recommend', payload);
      setResult(response.data);
    } catch (err) {
      setError(err.message || 'Could not generate a recommendation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12">
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-3">Get a Quote</p>
              <h1 className="font-heading text-4xl sm:text-5xl font-bold">Smart energy system recommendations</h1>
              <p className="mt-4 text-muted-foreground">
                Submit your usage profile and budget to receive a tailored energy solution with ROI estimates, carbon impact, and financing guidance.
              </p>
            </div>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 bg-card rounded-3xl border border-border/50 p-8 shadow-sm"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={form.fullName} onChange={setField('fullName')} required className="mt-1.5 rounded-xl bg-secondary border-0" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={setField('email')} required className="mt-1.5 rounded-xl bg-secondary border-0" />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Project Location</Label>
                <Input id="location" value={form.location} onChange={setField('location')} required className="mt-1.5 rounded-xl bg-secondary border-0" />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="monthlyUsageKwh">Monthly Usage (kWh)</Label>
                  <Input id="monthlyUsageKwh" type="number" min="0" value={form.monthlyUsageKwh} onChange={setField('monthlyUsageKwh')} required className="mt-1.5 rounded-xl bg-secondary border-0" />
                </div>
                <div>
                  <Label htmlFor="budget">Target Budget ($)</Label>
                  <Input id="budget" type="number" min="0" value={form.budget} onChange={setField('budget')} required className="mt-1.5 rounded-xl bg-secondary border-0" />
                </div>
                <div>
                  <Label htmlFor="currentTariff">Current Tariff ($/kWh)</Label>
                  <Input id="currentTariff" type="number" step="0.01" value={form.currentTariff} onChange={setField('currentTariff')} placeholder="0.18" className="mt-1.5 rounded-xl bg-secondary border-0" />
                </div>
              </div>

              <div>
                <Label htmlFor="projectType">Preferred System</Label>
                <select
                  id="projectType"
                  value={form.projectType}
                  onChange={setField('projectType')}
                  className="mt-1.5 w-full rounded-xl bg-secondary border-0 px-4 py-3 text-sm"
                >
                  <option value="SOLAR">Solar PV + Storage</option>
                  <option value="HYBRID">Hybrid Microgrid</option>
                  <option value="GRID">Grid Integration</option>
                </select>
              </div>

              <div>
                <Label htmlFor="notes">Project Brief</Label>
                <Textarea id="notes" value={form.notes || ''} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} rows={5} className="mt-1.5 rounded-xl bg-secondary border-0 resize-none" placeholder="Add additional details about your site or energy goals." />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  Our recommendations are tailored to long-term savings, resilience, and carbon reduction.
                </div>
                <Button type="submit" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl px-8 w-full sm:w-auto" disabled={loading}>
                  {loading ? 'Calculating...' : 'Generate Recommendation'}
                </Button>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
            </motion.form>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="rounded-3xl bg-card border border-border/50 p-8 shadow-sm">
                <h2 className="font-heading text-2xl font-bold mb-4">Why Amadla?</h2>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li>• End-to-end project design with local operations and financing support.</li>
                  <li>• Intelligent energy systems calibrated for African climates and grid conditions.</li>
                  <li>• Transparent ROI modelling, carbon impact tracking, and lifecycle service plans.</li>
                </ul>
              </div>

              {result && (
                <div className="rounded-3xl bg-accent/10 border border-accent/20 p-8">
                  <h2 className="font-heading text-2xl font-bold mb-4">Recommendation</h2>
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <div>
                      <h3 className="font-semibold">Solution</h3>
                      <p>{result.solution}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Estimated system size</h3>
                      <p>{result.estimatedCapacity} kW</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Estimated project value</h3>
                      <p>${result.estimatedCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Annual savings</h3>
                      <p>${result.annualSavings.toLocaleString()} per year</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Expected payback</h3>
                      <p>{result.paybackYears} years</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Carbon reduction</h3>
                      <p>{result.carbonSavings.toFixed(1)} tonnes CO₂ / year</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
