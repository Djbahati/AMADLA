import { motion } from 'framer-motion';
import { ExternalLink, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Partner = {
  name: string;
  description: string;
  focus: string;
  color: string;
};

const partners: Partner [] = [
  {
    name: 'Sand Tech',
    description:
      'Pioneering AI and machine learning solutions for smart energy grid optimization and predictive analytics across African infrastructure.',
    focus: 'AI & Machine Learning',
    color: 'from-amber-500/20 to-orange-500/20',
  },
  {
    name: 'REG — Rwanda Energy Group',
    description:
      "Rwanda's national utility company driving electrification and sustainable energy access throughout the country.",
    focus: 'National Utility',
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    name: 'Global Energy Group',
    description:
      'International energy services provider specializing in offshore and onshore energy infrastructure development.',
    focus: 'Energy Infrastructure',
    color: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    name: 'China Energy',
    description:
      "One of the world's largest power companies, partnering on large-scale generation projects and technology transfer initiatives.",
    focus: 'Power Generation',
    color: 'from-red-500/20 to-rose-500/20',
  },
];

export default function Partners() {
  return (
    <div className="pt-24">
      {/* Header */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Handshake className="h-8 w-8 text-accent" aria-label="Handshake icon" />
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
              Strategic <span className="text-accent">Partners</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Collaborating with industry leaders to accelerate Africa's energy transformation
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partner cards */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partners.map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <div className={`h-2 bg-gradient-to-r ${partner.color}`} />
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-heading text-xl font-bold mb-1">{partner.name}</h3>
                      <span className="text-xs text-accent font-medium uppercase tracking-wider">
                        {partner.focus}
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-xl font-heading font-bold text-muted-foreground">
                      {partner.name.charAt(0)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {partner.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl font-bold mb-4">Become a Partner</h2>
            <p className="text-muted-foreground mb-8">
              Join our growing ecosystem of energy innovators shaping Africa's sustainable future.
            </p>
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading rounded-xl px-8"
            >
              Get in Touch
              <ExternalLink className="ml-2 h-4 w-4" aria-label="External link icon" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
