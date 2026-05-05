import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Zap } from 'lucide-react';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 py-12 px-4">
      <div className="text-center max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
            <Zap className="h-8 w-8 text-accent" />
          </div>
        </div>

        <h1 className="font-heading text-7xl font-bold text-accent mb-2">404</h1>
        <div className="h-0.5 w-16 bg-border mx-auto mb-6" />
        <h2 className="font-heading text-2xl font-semibold mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page <span className="font-medium text-foreground">"{pageName}"</span> doesn't exist in Amadla Energy.
        </p>

        {isAuthenticated && user?.role === 'ADMIN' && (
          <div className="mb-6 p-4 bg-accent/5 border border-accent/20 rounded-xl text-left text-sm text-muted-foreground">
            <span className="font-semibold text-accent">Admin:</span> This route is not registered in{' '}
            <code className="bg-secondary px-1 rounded text-xs">app.jsx</code>. Add it to the Routes to enable it.
          </div>
        )}

        <Link to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground font-semibold rounded-xl hover:bg-accent/90 transition-colors">
          Go Home
        </Link>

        <div className="mt-8 p-5 bg-card rounded-xl border border-border/50 text-left">
          <p className="text-sm font-semibold mb-3">Quick Links</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Home', to: '/' },
              { label: 'Dashboard', to: '/dashboard' },
              { label: 'About', to: '/about' },
              { label: 'Contact', to: '/contact' },
              { label: 'Energy Systems', to: '/energy-systems' },
              { label: 'Support', to: '/energy-support' },
            ].map(({ label, to }) => (
              <Link key={to} to={to} className="text-sm text-accent hover:underline">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
