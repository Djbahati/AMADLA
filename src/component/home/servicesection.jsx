import { motion } from 'framer-motion';
import { Sun, Network, Cpu, Building } from 'lucide-react';

const services = [
  {
    icon: Sun,
    title: 'Solar Energy',
    description: 'Large-scale photovoltaic installations powering communities with clean, renewable energy across the continent.',
    color: 'bg-amber-500/10 text-amber-500',
  },
  {
    icon: Network,
    title: 'Smart Grid Systems',
    description: 'AI-driven grid management for optimal energy distribution, real-time monitoring, and predictive maintenance.',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    icon: Cpu,
    title: 'Smart Energy',
    description: 'IoT-enabled energy solutions with intelligent metering, demand forecasting, and automated load balancing.',
    color: 'bg-emerald-500/10 text-emerald-500',
  },
  {
    icon: Building,
    title: 'Infrastructure',
    description: 'End-to-end energy infrastructure development from generation plants to last-mile distribution networks.',
    color: 'bg-purple-500/10 text-purple-500',
  },
];

export default function ServicesSection() {
    return (
        <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-slate-900 to-slate-800">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-white mb-12 text-center">Our Services</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition"
                        >
                            <service.icon className={`w-12 h-12 mb-4 ${service.color}`} />
                            <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                            <p className="text-slate-400">{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}