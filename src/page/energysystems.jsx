import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Droplets,
  Flame,
  Zap,
  Home,
  TrendingUp,
  TrendingDown,
  Activity,
} from 'lucide-react';
import EnergyFlowDiagram from '../component/energy/EnergyFlowDiagram';
import DataIndicatorCard from '../component/energy/DataIndicatorCard';

function generateData() {
  return {
    solarOutput: (Math.random() * 3 + 2).toFixed(1),
    hydroOutput: (Math.random() * 2.5 + 1.5).toFixed(1),
    thermalOutput: (Math.random() * 1.5 + 0.5).toFixed(1),
    voltage: (Math.random() * 10 + 225).toFixed(0),
    supply: (Math.random() * 2 + 6).toFixed(1),
    demand: (Math.random() * 2 + 5.5).toFixed(1),
    gridLoad: (Math.random() * 20 + 60).toFixed(0),
    efficiency: (Math.random() * 5 + 93).toFixed(1),
  };
}

export default function EnergySystems() {
  const [data, setData] = useState(generateData);

  useEffect(() => {
    const interval = setInterval(() => setData(generateData()), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-24">
      <section className="py-12 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-8"
          >
            <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
              Energy Systems <span className="text-accent">Visualization</span>
            </h1>
            <p className="text-muted-foreground">
              Interactive real-time view of our energy generation, transmission,
              and distribution network
            </p>
          </motion.div>

          {/* Data indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <DataIndicatorCard
              icon={Zap}
              label="Grid Voltage"
              value={`${data.voltage}V`}
              status="normal"
            />
            <DataIndicatorCard
              icon={TrendingUp}
              label="Total Supply"
              value={`${data.supply} GW`}
              status="good"
            />
            <DataIndicatorCard
              icon={TrendingDown}
              label="Total Demand"
              value={`${data.demand} GW`}
              status={
                parseFloat(data.demand) > parseFloat(data.supply)
                  ? 'warning'
                  : 'normal'
              }
            />
            <DataIndicatorCard
              icon={Activity}
              label="Grid Load"
              value={`${data.gridLoad}%`}
              status={parseInt(data.gridLoad) > 75 ? 'warning' : 'good'}
            />
          </div>
        </div>
      </section>

      {/* Flow diagram */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EnergyFlowDiagram data={data} />
        </div>
      </section>

      {/* Generation breakdown */}
      <section className="py-12 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold mb-8 text-center">
            Generation Sources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Sun,
                label: 'Solar',
                value: `${data.solarOutput} GW`,
                pct: (
                  (parseFloat(data.solarOutput) /
                    (parseFloat(data.solarOutput) +
                      parseFloat(data.hydroOutput) +
                      parseFloat(data.thermalOutput))) *
                  100
                ).toFixed(0),
                color: 'bg-amber-500',
                bg: 'bg-amber-500/10 text-amber-500',
              },
              {
                icon: Droplets,
                label: 'Hydroelectric',
                value: `${data.hydroOutput} GW`,
                pct: (
                  (parseFloat(data.hydroOutput) /
                    (parseFloat(data.solarOutput) +
                      parseFloat(data.hydroOutput) +
                      parseFloat(data.thermalOutput))) *
                  100
                ).toFixed(0),
                color: 'bg-blue-500',
                bg: 'bg-blue-500/10 text-blue-500',
              },
              {
                icon: Flame,
                label: 'Thermal',
                value: `${data.thermalOutput} GW`,
                pct: (
                  (parseFloat(data.thermalOutput) /
                    (parseFloat(data.solarOutput) +
                      parseFloat(data.hydroOutput) +
                      parseFloat(data.thermalOutput))) *
                  100
                ).toFixed(0),
                color: 'bg-orange-500',
                bg: 'bg-orange-500/10 text-orange-500',
              },
            ].map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${src.bg}`}
                    >
                      <src.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold">
                        {src.label}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {src.pct}% of total
                      </p>
                    </div>
                  </div>
                  <span className="font-heading text-2xl font-bold">
                    {src.value}
                  </span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${src.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${src.pct}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

