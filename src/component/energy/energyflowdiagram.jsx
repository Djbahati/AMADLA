import { motion } from 'framer-motion';
import { Sun, Droplets, Flame, Zap, Building2, Home, Factory } from 'lucide-react';

function FlowNode({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="flex flex-col items-center"
    >
      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${color} mb-3 relative`}>
        <Icon className="h-9 w-9" />
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-energy-green animate-pulse" />
      </div>
      <span className="font-heading font-semibold text-sm">{label}</span>
      {value && <span className="text-xs text-muted-foreground mt-0.5">{value}</span>}
    </motion.div>
  );
}

function AnimatedConnector({ direction = 'right' }) {
  return (
    <div className="flex items-center px-2">
      <svg width="64" height="4" viewBox="0 0 64 4" className="overflow-visible">
        <path
          d="M0 2 L64 2"
          stroke="hsl(var(--accent))"
          strokeWidth="2"
          strokeDasharray="8 4"
          className="animate-flow-line"
          fill="none"
        />
      </svg>
      <Zap className="h-3 w-3 text-accent -ml-1" />
    </div>
  );
}

export default function EnergyFlowDiagram({ data }) {
  return (
    <div className="bg-card rounded-3xl border border-border/50 p-8 overflow-x-auto">
      <h3 className="font-heading text-xl font-bold mb-8 text-center">Real-Time Energy Flow Network</h3>
      
      {/* Desktop flow */}
      <div className="hidden md:flex items-center justify-center gap-2 min-w-[700px]">
        {/* Generation */}
        <div className="flex flex-col gap-4">
          <FlowNode icon={Sun} label="Solar" value={`${data.solarOutput} GW`} color="bg-amber-500/15 text-amber-500" delay={0} />
          <FlowNode icon={Droplets} label="Hydro" value={`${data.hydroOutput} GW`} color="bg-blue-500/15 text-blue-500" delay={0.1} />
          <FlowNode icon={Flame} label="Thermal" value={`${data.thermalOutput} GW`} color="bg-orange-500/15 text-orange-500" delay={0.2} />
        </div>

        <AnimatedConnector />

        {/* Substation */}
        <FlowNode icon={Zap} label="Substation" value={`${data.voltage}V`} color="bg-accent/15 text-accent" delay={0.3} />

        <AnimatedConnector />

        {/* Distribution */}
        <FlowNode icon={Building2} label="Distribution" value={`${data.gridLoad}% Load`} color="bg-emerald-500/15 text-emerald-500" delay={0.4} />

        <AnimatedConnector />

        {/* Consumers */}
        <div className="flex flex-col gap-4">
          <FlowNode icon={Home} label="Residential" value={`${(data.demand * 0.4).toFixed(1)} GW`} color="bg-teal-500/15 text-teal-500" delay={0.5} />
          <FlowNode icon={Factory} label="Industrial" value={`${(data.demand * 0.35).toFixed(1)} GW`} color="bg-indigo-500/15 text-indigo-500" delay={0.6} />
          <FlowNode icon={Building2} label="Commercial" value={`${(data.demand * 0.25).toFixed(1)} GW`} color="bg-purple-500/15 text-purple-500" delay={0.7} />
        </div>
      </div>

      {/* Mobile flow */}
      <div className="md:hidden space-y-6">
        <div className="text-center text-sm font-heading font-semibold text-muted-foreground mb-2">Generation</div>
        <div className="flex justify-center gap-4">
          <FlowNode icon={Sun} label="Solar" value={`${data.solarOutput} GW`} color="bg-amber-500/15 text-amber-500" delay={0} />
          <FlowNode icon={Droplets} label="Hydro" value={`${data.hydroOutput} GW`} color="bg-blue-500/15 text-blue-500" delay={0.1} />
          <FlowNode icon={Flame} label="Thermal" value={`${data.thermalOutput} GW`} color="bg-orange-500/15 text-orange-500" delay={0.2} />
        </div>
        <div className="flex justify-center">
          <svg width="4" height="32" viewBox="0 0 4 32" className="overflow-visible">
            <path
              d="M2 0 L2 32"
              stroke="hsl(var(--accent))"
              strokeWidth="2"
              strokeDasharray="8 4"
              className="animate-flow-line"
              fill="none"
            />
          </svg>
        </div>
        <div className="flex justify-center">
          <FlowNode icon={Zap} label="Substation" value={`${data.voltage}V`} color="bg-accent/15 text-accent" delay={0.3} />
        </div>
        <div className="flex justify-center">
          <svg width="4" height="32" viewBox="0 0 4 32" className="overflow-visible">
            <path
              d="M2 0 L2 32"
              stroke="hsl(var(--accent))"
              strokeWidth="2"
              strokeDasharray="8 4"
              className="animate-flow-line"
              fill="none"
            />
          </svg>
        </div>
        <div className="text-center text-sm font-heading font-semibold text-muted-foreground mb-2">Distribution</div>
        <div className="flex justify-center gap-4">
          <FlowNode icon={Home} label="Residential" value={`${(data.demand * 0.4).toFixed(1)} GW`} color="bg-teal-500/15 text-teal-500" delay={0.5} />
          <FlowNode icon={Factory} label="Industrial" value={`${(data.demand * 0.35).toFixed(1)} GW`} color="bg-indigo-500/15 text-indigo-500" delay={0.6} />
        </div>
      </div>
    </div>
  );
}