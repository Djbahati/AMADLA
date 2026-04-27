import { motion } from 'framer-motion';
import { Target, Eye, Sparkles } from 'lucide-react';
import LeadershipCard from '../component/about/LeadershipCard';
import Timeline from '../component/about/Timeline';

const leaders = [
  { name: 'ENG. BAHATI Pierre', role: 'CEO & Founder', image: 'https://media.base44.com/images/public/69d61490c27eb799c26fa5f3/03e0cacde_PETER.jpg' },
];

export default function About() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-6">
              About <span className="text-accent">Amadla Energy</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We are on a mission to electrify Africa with sustainable, intelligent energy systems
              that create lasting impact for communities and economies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission, Vision, Impact */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Our Mission', text: 'To provide reliable, affordable, and sustainable energy solutions that power economic growth and improve quality of life across Africa.' },
              { icon: Eye, title: 'Our Vision', text: 'A fully electrified Africa where every community has access to clean, intelligent energy systems driving prosperity and innovation.' },
              { icon: Sparkles, title: 'Our Impact', text: 'Over 50 million lives improved through clean energy access, with 8M tonnes of CO₂ offset annually across our operational regions.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-card border border-border/50 rounded-2xl p-8 hover:shadow-lg hover:border-accent/20 transition-all"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-5">
                  <item.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-heading text-3xl sm:text-4xl font-bold text-center mb-16">
            Our <span className="text-accent">Leadership</span>
          </motion.h2>
          <div className="flex justify-center">
            {leaders.map((leader, i) => (
              <LeadershipCard key={i} {...leader} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-heading text-3xl sm:text-4xl font-bold text-center mb-16">
            Our <span className="text-accent">Journey</span>
          </motion.h2>
          <Timeline />
        </div>
      </section>
    </div>
  );
}
