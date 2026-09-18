import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plane, Compass, Building2, Phone } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const location = useLocation();

  const items = [
    { label: 'Flights', path: '/flights', icon: Plane },
    { label: 'Hotels', path: '/hotels', icon: Building2 },
    { label: 'Tours', path: '/tours', icon: Compass },
    { label: 'Contact', path: '/contact', icon: Phone },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-200 px-6 py-2 flex items-center justify-around shadow-2xl">
      {items.map((item) => {
        const active = location.pathname.startsWith(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
              active ? 'text-amber-600 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <item.icon className={`w-5 h-5 ${active ? 'text-amber-600' : 'text-slate-500'}`} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};
