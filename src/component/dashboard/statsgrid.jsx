import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, AlertTriangle, Server } from 'lucide-react';

function generateStats() {
  return [
    { icon: Zap, label: 'Total Generation', value: `${(Math.random() * 3 + 6).toFixed(1)} GW`, change: `+${(Math.random() * 5).toFixed(1)}%`, positive: true },
    { icon: TrendingUp, label: 'Grid Efficiency', value: `${(Math.random() * 5 + 93).toFixed(1)}%`, change: `+${(Math.random() * 2).toFixed(1)}%`, positive: true },
    { icon: AlertTriangle, label: 'Active Outages', value: `${Math.floor(Math.random() * 5)}`, change: `${Math.random() > 0.5 ? '-' : '+'}${Math.floor(Math.random() * 3)}`, positive: Math.random() > 0.5 },
    { icon: Server, label: 'Systems Online', value: `${Math.floor(Math.random() * 10 + 240)}`, change: '99.8% uptime', positive: true },
  ];
}

export default function StatsGrid() {
  const [stats, setStats] = useState(generateStats);

  useEffect(() => {
    const interval = setInterval(() => setStats(generateStats()), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card rounded-2xl border border-border/50 p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <stat.icon className="h-5 w-5 text-accent" />
            </div>
            <span className={`text-xs font-medium ${stat.positive ? 'text-energy-green' : 'text-energy-red'}`}>
              {stat.change}
            </span>
          </div>
          <div className="font-heading text-2xl font-bold">{stat.value}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
        </motion.div>
      ))}
    </div>
    );
}