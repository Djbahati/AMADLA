import { motion } from 'framer-motion';

const events = [
  { year: '2015', title: 'Founded', desc: 'Amadla Energy Group established in Kigali, Rwanda with a mission to transform African energy.' },
  { year: '2017', title: 'First Solar Farm', desc: 'Completed our first 50MW solar installation, powering over 200,000 homes.' },
  { year: '2019', title: 'Smart Grid Launch', desc: 'Deployed AI-powered smart grid management across 3 countries.' },
  { year: '2021', title: 'Continental Expansion', desc: 'Expanded operations to 10+ African nations, total capacity exceeding 5GW.' },
  { year: '2023', title: 'Digital Platform', desc: 'Launched real-time energy monitoring platform and IoT infrastructure.' },
  { year: '2025', title: '12GW Milestone', desc: 'Achieved 12GW installed capacity across 15 countries with 99.8% uptime.' },
];

export default function Timeline() {
  return (
    <div className="relative">
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />
      <div className="space-y-12">
        {events.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`relative flex flex-col md:flex-row items-center gap-6 ${
              i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
              <div className="bg-card border border-border/50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-heading font-semibold rounded-full mb-3">
                  {event.year}
                </span>
                <h3 className="font-heading font-semibold text-lg mb-2">{event.title}</h3>
                <p className="text-sm text-muted-foreground">{event.desc}</p>
              </div>
            </div>
            <div className="relative z-10 w-4 h-4 bg-accent rounded-full border-4 border-background shadow-lg hidden md:block" />
            <div className="flex-1 hidden md:block" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}