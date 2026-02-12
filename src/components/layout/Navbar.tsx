import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import impalaLogo from "@/assets/impala-logo.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/history", label: "Our History" },
  { href: "/houses", label: "Houses" },
  { href: "/questionnaire", label: "Contribute" },
  { href: "/book", label: "The Book" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-accent/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={impalaLogo}
              alt="Nairobi School Impala"
              className="h-12 w-12 object-contain impala-emblem transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <h1 className="font-display text-lg font-bold text-primary-foreground leading-tight">
                Nairobi School
              </h1>
              <p className="text-xs text-accent font-medium tracking-wider">
                ALUMNI ASSOCIATION
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.href === "/book" ? (
                <Link key={link.href} to={link.href} className="ml-2">
                  <Button variant="heroOutline" size="sm">
                    {link.label}
                  </Button>
                </Link>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.href
                      ? "text-accent bg-accent/10"
                      : "text-primary-foreground/80 hover:text-accent hover:bg-accent/5"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-primary-foreground hover:text-accent transition-colors rounded-lg"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-accent/20">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) =>
                link.href === "/book" ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="mt-2"
                  >
                    <Button variant="heroOutline" size="sm" className="w-full">
                      {link.label}
                    </Button>
                  </Link>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === link.href
                        ? "text-accent bg-accent/10"
                        : "text-primary-foreground/80 hover:text-accent hover:bg-accent/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
