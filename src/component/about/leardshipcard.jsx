import { motion } from 'framer-motion';

export default function LeadershipCard({ name, role, image, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="group text-center"
    >
      <div className="relative w-40 h-40 mx-auto mb-5 rounded-2xl overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <h3 className="font-heading font-semibold text-lg">{name}</h3>
      <p className="text-sm text-muted-foreground">{role}</p>
    </motion.div>
  );
}