import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, MapPin, Clock, ArrowRight } from 'lucide-react';
import { apiClient } from '../api/client';
import { Tour } from '../types';

export const Tours: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await apiClient.get('/tours');
        setTours(res.data);
      } catch (err) {
        console.error('Failed to fetch tours:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-3">
          <Compass className="w-8 h-8 text-amber-500" /> Spain & Mediterranean Escorted Tours
        </h1>
        <p className="text-slate-500 text-sm">
          Small group tours featuring 4-star hotels, private catamaran cruises, and expert historic guides.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tours.map((tour) => (
          <div key={tour.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group">
            <div className="relative h-56 overflow-hidden">
              <img src={tour.gallery[0] || 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80'} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {tour.duration_days} Days
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" /> {tour.destination}
                </span>
                <h3 className="text-xl font-bold font-serif text-slate-900 group-hover:text-amber-600 transition-colors">{tour.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{tour.summary}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block">From</span>
                  <span className="text-xl font-extrabold text-slate-900">€{tour.price_from}</span>
                </div>
                <Link
                  to={`/tours/${tour.slug}`}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
