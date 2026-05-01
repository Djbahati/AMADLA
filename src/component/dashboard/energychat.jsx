import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { apiClient } from '@/utils/apiClient';

function generateChartData() {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    supply: +(Math.random() * 3 + 5).toFixed(2),
    demand: +(Math.random() * 3 + 4.5).toFixed(2),
  }));
}

function generateWeekData() {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
    day,
    produced: +(Math.random() * 4 + 5).toFixed(1),
    consumed: +(Math.random() * 3 + 4).toFixed(1),
  }));
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border/50 rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-medium mb-1 text-muted-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value} GW
        </p>
      ))}
    </div>
  );
};

export default function EnergyCharts() {
  const [hourly, setHourly] = useState(generateChartData);
  const [weekly, setWeekly] = useState(generateWeekData);

  useEffect(() => {
    // Try to load real usage data, fall back to mock
    apiClient.get('/usage')
      .then((res) => {
        if (res.data?.length > 0) {
          // Aggregate by day of week from real data
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const agg = {};
          days.forEach(d => { agg[d] = { produced: 0, consumed: 0, count: 0 }; });
          res.data.forEach((u) => {
            const d = days[new Date(u.usageDate).getDay()];
            agg[d].produced += Number(u.producedKwh);
            agg[d].consumed += Number(u.consumedKwh);
            agg[d].count++;
          });
          const realWeekly = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => ({
            day: d,
            produced: agg[d].count ? +(agg[d].produced / agg[d].count / 1000).toFixed(2) : +(Math.random() * 4 + 5).toFixed(1),
            consumed: agg[d].count ? +(agg[d].consumed / agg[d].count / 1000).toFixed(2) : +(Math.random() * 3 + 4).toFixed(1),
          }));
          setWeekly(realWeekly);
        }
      })
      .catch(() => {});

    const interval = setInterval(() => setHourly(generateChartData()), 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-2xl border border-border/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold">Supply vs Demand</h3>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-lg">24h live</span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={hourly} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="supplyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--energy-blue))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--energy-blue))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--energy-amber))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--energy-amber))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" interval={3} />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="supply" name="Supply" stroke="hsl(var(--energy-blue))" fill="url(#supplyGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="demand" name="Demand" stroke="hsl(var(--energy-amber))" fill="url(#demandGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold">Weekly Production</h3>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-lg">GW avg</span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={weekly} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="produced" name="Produced" fill="hsl(var(--energy-green))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="consumed" name="Consumed" fill="hsl(var(--energy-amber))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
