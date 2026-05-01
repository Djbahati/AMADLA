import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, AlertTriangle, Users, DollarSign, Activity } from 'lucide-react';
import { apiClient } from '@/utils/apiClient';
import { useAuth } from '@/context/AuthContext';

const MOCK = [
  { icon: Zap, label: 'Total Generated', value: '8.4 GW', change: '+3.2%', positive: true, color: 'text-energy-amber bg-energy-amber/10' },
  { icon: TrendingUp, label: 'Grid Efficiency', value: '96.1%', change: '+1.4%', positive: true, color: 'text-energy-green bg-energy-green/10' },
  { icon: AlertTriangle, label: 'Active Alerts', value: '2', change: '-1', positive: true, color: 'text-energy-red bg-energy-red/10' },
  { icon: Users, label: 'Active Users', value: '—', change: 'loading', positive: true, color: 'text-energy-blue bg-energy-blue/10' },
];

function formatKwh(kwh) {
  if (kwh >= 1_000_000) return `${(kwh / 1_000_000).toFixed(1)} GWh`;
  if (kwh >= 1_000) return `${(kwh / 1_000).toFixed(1)} MWh`;
  return `${kwh.toFixed(1)} kWh`;
}

function formatCurrency(amount) {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
  return `$${amount.toFixed(0)}`;
}

export default function StatsGrid() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'ADMIN') { setLoading(false); return; }
    apiClient.get('/dashboard/summary')
      .then((res) => {
        const { kpis, alerts } = res.data;
        setStats([
          { icon: Zap, label: 'Total Generated', value: formatKwh(kpis.totalEnergyGenerated), change: 'all time', positive: true, color: 'text-energy-amber bg-energy-amber/10' },
          { icon: Activity, label: 'Total Consumed', value: formatKwh(kpis.totalEnergyConsumed), change: 'all time', positive: true, color: 'text-energy-green bg-energy-green/10' },
          { icon: DollarSign, label: 'Total Revenue', value: formatCurrency(kpis.totalRevenue), change: 'all time', positive: true, color: 'text-energy-blue bg-energy-blue/10' },
          { icon: Users, label: 'Active Users', value: String(kpis.activeUsers), change: `${alerts.length} alerts`, positive: alerts.length === 0, color: 'text-energy-red bg-energy-red/10' },
        ]);
      })
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [user]);

  const display = stats || MOCK;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {display.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="bg-card rounded-2xl border border-border/50 p-5 hover:border-accent/30 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              stat.positive ? 'text-energy-green bg-energy-green/10' : 'text-energy-red bg-energy-red/10'
            }`}>
              {stat.change}
            </span>
          </div>
          <div className="font-heading text-2xl font-bold">
            {loading ? <div className="h-7 w-20 bg-secondary rounded animate-pulse" /> : stat.value}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
