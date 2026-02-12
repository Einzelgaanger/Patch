import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Youtube } from "lucide-react";
import impalaLogo from "@/assets/impala-logo.png";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={impalaLogo}
                alt="Nairobi School"
                className="h-14 w-14 object-contain"
              />
              <div>
                <h3 className="font-display text-xl font-bold">Nairobi School</h3>
                <p className="text-accent text-sm font-medium">To The Uttermost</p>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Founded in 1902, Nairobi School stands as one of Kenya's premier national 
              schools, producing leaders and gentlemen for over a century.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-accent">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/history", label: "Our History" },
                { href: "/houses", label: "School Houses" },
                { href: "/questionnaire", label: "Contribute to Book" },
                { href: "/book", label: "The Impala Book" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-accent">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <span>Waiyaki Way, Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Phone className="h-4 w-4 text-accent shrink-0" />
                <span>+254 741 946 507</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Mail className="h-4 w-4 text-accent shrink-0" />
                <span>alumni@nairobischool.ac.ke</span>
              </li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-accent">
              Stay Connected
            </h4>
            <p className="text-primary-foreground/70 text-sm mb-4">
              Follow us on social media for updates and alumni events.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/10 text-accent hover:bg-accent hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/10 text-accent hover:bg-accent hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/10 text-accent hover:bg-accent hover:text-primary transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-center md:text-left">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} Nairobi School Alumni Association. All rights reserved.
          </p>
          <p className="text-primary-foreground/50 text-sm">
            Formerly Prince of Wales School (1902-1966)
          </p>
        </div>
      </div>
    </footer>
  );
}
