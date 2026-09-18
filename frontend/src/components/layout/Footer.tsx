import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-xl">
              M
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-serif">
              MIR <span className="text-amber-500 font-sans font-normal">Travel</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Your trusted Spanish travel agency specializing in luxury Mediterranean tours, bespoke flight itineraries, handpicked hotel stays, and authentic cultural experiences.
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-800/40 w-fit">
            <ShieldCheck className="w-4 h-4" /> Official Registered Travel Provider
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-base mb-4 font-serif">Quick Navigation</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/flights" className="hover:text-amber-400 transition-colors">Flight Search & Offers</Link></li>
            <li><Link to="/hotels" className="hover:text-amber-400 transition-colors">Luxury Hotel Collection</Link></li>
            <li><Link to="/tours" className="hover:text-amber-400 transition-colors">Spain & Mediterranean Tours</Link></li>
            <li><Link to="/destinations" className="hover:text-amber-400 transition-colors">Destinations Guide</Link></li>
            <li><Link to="/blog" className="hover:text-amber-400 transition-colors">Travel Journal & Insights</Link></li>
            <li><Link to="/events" className="hover:text-amber-400 transition-colors">Local Events & Festivals</Link></li>
          </ul>
        </div>

        {/* Popular Destinations */}
        <div>
          <h4 className="text-white font-semibold text-base mb-4 font-serif">Featured Regions</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/destinations/benidorm-costa-blanca-demo" className="hover:text-amber-400 transition-colors">Benidorm & Costa Blanca</Link></li>
            <li><Link to="/destinations/barcelona-costa-brava-demo" className="hover:text-amber-400 transition-colors">Barcelona & Costa Brava</Link></li>
            <li><span className="text-slate-500">Alicante & Tabarca Island</span></li>
            <li><span className="text-slate-500">Balearic Islands (Ibiza & Mallorca)</span></li>
            <li><span className="text-slate-500">Andalusia & Costa del Sol</span></li>
          </ul>
        </div>

        {/* Contact info & Newsletter */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-base mb-4 font-serif">Contact Travel Desk</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <span>Paseo Marítimo 45, 03502 Benidorm, Alicante, Spain</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-amber-500 shrink-0" />
              <span>+34 965 800 123</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-amber-500 shrink-0" />
              <span>info@mirtravel.es</span>
            </li>
          </ul>

          <div className="pt-2">
            <p className="text-xs text-slate-400 mb-2">Subscribe for exclusive travel offers:</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
              />
              <button className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors">
                Join <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 MIR Travel & Tourism. All rights reserved. Demo records clearly labeled.</p>
        <div className="flex items-center gap-6">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Legal Notice</span>
          <Link to="/admin/login" className="text-amber-500 hover:underline font-semibold">Staff Login</Link>
        </div>
      </div>
    </footer>
  );
};
