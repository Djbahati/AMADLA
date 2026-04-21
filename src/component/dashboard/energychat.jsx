import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

function generateChartData() {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    hours.push({
      time: `${i.toString().padStart(2, '0')}:00`,
      supply: Math.random() * 3 + 5,
      demand: Math.random() * 3 + 4.5,
    });
  }
  return hours;
}

function generateOutageData() {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
    day,
    outages: Math.floor(Math.random() * 5),
    resolved: Math.floor(Math.random() * 4),
  }));
}

export default function EnergyCharts() {
  const [chartData, setChartData] = useState(generateChartData);
  const [outageData, setOutageData] = useState(generateOutageData);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(generateChartData());
      setOutageData(generateOutageData());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-2xl border border-border/50 p-6">
        <h3 className="font-heading font-semibold text-lg mb-4">Supply vs Demand (24h)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip />
            <Area type="monotone" dataKey="supply" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" opacity={0.1} />
            <Area type="monotone" dataKey="demand" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" opacity={0.1} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}