import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Zap, Building2, Home } from 'lucide-react';

const stages = [
  { icon: Sun, label: 'Generation', desc: 'Solar, Hydro & Thermal', color: 'text-energy-amber' },
  { icon: Zap, label: 'Transmission', desc: 'High-Voltage Grid', color: 'text-energy-blue' },
  { icon: Building2, label: 'Distribution', desc: 'Smart Substations', color: 'text-energy-green' },
  { icon: Home, label: 'Consumption', desc: 'Cities & Communities', color: 'text-energy-teal' },
];

function FlowLine({ delay }) {
  return (
    <div className="hidden md:flex items-center flex-1 mx-2">
      <div className="relative w-full h-0.5 bg-border overflow-hidden rounded-full">
        <motion.div
          className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
          animate={{ x: ['-100%', '400%'] }}
          transition={{ duration: 2, repeat: Infinity, delay, ease: 'linear' }}
        />
      </div>
    </div>
  );
}

export default function EnergyFlowSection() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {stages.map((stage, index) => (
            <div key={index}>
              <motion.div
                className={`p-4 rounded-lg cursor-pointer ${
                  activeStage === index ? 'bg-accent' : 'bg-muted'
                }`}
                onClick={() => setActiveStage(index)}
              >
                <stage.icon className={`w-8 h-8 ${stage.color}`} />
                <h3 className="font-semibold">{stage.label}</h3>
                <p className="text-sm text-muted-foreground">{stage.desc}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
