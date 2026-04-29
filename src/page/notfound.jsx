import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 py-12 px-4">
      <div className="text-center max-w-md">
        <h1 className="font-heading text-6xl font-bold text-accent mb-4">404</h1>
        <h2 className="font-heading text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block px-6 py-2 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent/90 transition-colors"
          >
            Go Home
          </Link>
          
          <div className="mt-8 p-6 bg-card rounded-lg border border-border">
            <h3 className="font-heading font-semibold mb-4">Quick Links:</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-accent hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-accent hover:underline">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-accent hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-accent hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
