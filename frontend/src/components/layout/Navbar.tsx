import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plane, Compass, Building2, MapPin, BookOpen, Calendar, Phone, ShieldCheck, Menu, X, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Flights', path: '/flights', icon: Plane },
    { name: 'Hotels', path: '/hotels', icon: Building2 },
    { name: 'Tours', path: '/tours', icon: Compass },
    { name: 'Destinations', path: '/destinations', icon: MapPin },
    { name: 'Travel Journal', path: '/blog', icon: BookOpen },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-panel shadow-md py-3' : 'bg-slate-900/80 backdrop-blur-md text-white py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center group">
          <img
            src="/logo.png"
            alt="MIR Travel & Tourism"
            className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'text-amber-600 bg-amber-50 font-semibold'
                    : scrolled
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* CTA Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/admin/login"
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
              scrolled ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <User className="w-4 h-4 text-amber-500" />
            Travel Desk
          </Link>
          <Link
            to="/tours"
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold text-sm rounded-xl shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
          >
            Book Package
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 rounded-lg ${scrolled ? 'text-slate-900' : 'text-white'}`}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-slate-200 px-4 py-6 space-y-3 animate-fade-in shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-800 font-medium hover:bg-amber-50 hover:text-amber-600 transition-colors"
            >
              {link.icon && <link.icon className="w-5 h-5 text-amber-500" />}
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl"
            >
              Travel Desk Staff Portal
            </Link>
            <Link
              to="/tours"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 text-sm font-bold text-slate-950 bg-amber-500 rounded-xl"
            >
              Explore Tours & Packages
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
