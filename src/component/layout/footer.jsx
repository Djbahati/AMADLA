import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-6 w-6 text-accent" />
              <span className="font-heading font-bold text-lg">Amadla Energy</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Powering Africa's future through sustainable innovation, smart grid technology, and transformative energy solutions.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              {['About', 'Energy Systems', 'Dashboard', 'Partners', 'Contact'].map((link) => (
                <Link
                  key={link}
                  to={`/${link.toLowerCase().replace(' ', '-')}`}
                  className="block text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <a href="mailto:amandlaa520@gmail.com" className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                <Mail className="h-4 w-4 shrink-0" />
                amandlaa520@gmail.com
              </a>
              <a href="tel:+250799306970" className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                <Phone className="h-4 w-4 shrink-0" />
                +250 799 306 970
              </a>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <MapPin className="h-4 w-4 shrink-0" />
                Kigali, Rwanda
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Legal</h4>
            <div className="space-y-2">
              {['Privacy Policy', 'Terms of Service'].map((item) => (
                <p key={item} className="text-sm text-primary-foreground/70">{item}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} Amadla Energy Group. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
