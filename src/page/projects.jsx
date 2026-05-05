import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { apiClient } from '@/utils/apiClient';
import { Button } from '@/component/ui/button';

const types = {
  SOLAR: 'Solar Project',
  HYBRID: 'Hybrid Microgrid',
  GRID: 'Grid Integration',
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.get('/projects/public');
        setProjects(response.data || []);
      } catch (err) {
        setError(err.message || 'Unable to load projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="pt-24 pb-12">
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-3">Portfolio</p>
              <h1 className="font-heading text-4xl sm:text-5xl font-bold">Featured clean energy projects</h1>
              <p className="mt-4 text-muted-foreground">
                Explore real-world deployments that combine solar generation, storage, and smart-grid orchestration for resilient communities.
              </p>
            </div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {loading && (
              <div className="col-span-full rounded-3xl bg-card border border-border/50 p-12 text-center text-muted-foreground">
                Loading projects...
              </div>
            )}
            {error && (
              <div className="col-span-full rounded-3xl bg-destructive/10 border border-destructive/30 p-8 text-sm text-destructive">
                {error}
              </div>
            )}
            {!loading && !error && projects.length === 0 && (
              <div className="col-span-full rounded-3xl bg-card border border-border/50 p-12 text-center text-muted-foreground">
                No public projects are available at the moment.
              </div>
            )}
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">{types[project.type] || 'Energy Project'}</p>
                    <h2 className="mt-3 text-2xl font-heading font-bold">{project.name}</h2>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{project.location}</p>
                    <p>{new Date(project.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 text-sm">
                  <div className="rounded-2xl bg-secondary/50 p-4">
                    <p className="text-muted-foreground uppercase tracking-[0.2em] text-[11px] mb-2">Capacity</p>
                    <p className="font-semibold">{project.capacityKwh.toLocaleString()} kWh</p>
                  </div>
                  <div className="rounded-2xl bg-secondary/50 p-4">
                    <p className="text-muted-foreground uppercase tracking-[0.2em] text-[11px] mb-2">Unit cost</p>
                    <p className="font-semibold">${project.pricePerUnit.toFixed(2)} / kWh</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">
                    This installation demonstrates how modern renewable microgrids and hybrid systems reduce energy cost volatility and improve local resilience.
                  </p>
                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl w-full">
                    Request a custom quote
                  </Button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
