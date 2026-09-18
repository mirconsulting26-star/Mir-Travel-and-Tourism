import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { apiClient } from '../api/client';
import { Destination } from '../types';

export const Destinations: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    apiClient.get('/destinations').then((res) => setDestinations(res.data));
  }, []);

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-3">
          <MapPin className="w-8 h-8 text-amber-500" /> Spain Destination Guides
        </h1>
        <p className="text-slate-500 text-sm">
          Explore iconic coastal cities, pristine beaches, and historic regions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {destinations.map((dest) => (
          <Link key={dest.id} to={`/destinations/${dest.slug}`} className="group relative rounded-3xl overflow-hidden shadow-lg h-96 block">
            <img src={dest.hero_image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-8 space-y-2">
              <span className="inline-block px-3 py-1 bg-amber-500 text-slate-950 font-bold text-xs rounded-full">{dest.country}</span>
              <h3 className="text-2xl font-bold text-white font-serif group-hover:text-amber-400 transition-colors">{dest.name}</h3>
              <p className="text-sm text-slate-300 line-clamp-2">{dest.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const DestinationDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [dest, setDest] = useState<Destination | null>(null);

  useEffect(() => {
    apiClient.get(`/destinations/${slug}`).then((res) => setDest(res.data));
  }, [slug]);

  if (!dest) return <div className="pt-32 text-center text-slate-500">Loading destination guide...</div>;

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="relative rounded-3xl overflow-hidden shadow-xl h-96">
        <img src={dest.hero_image} alt={dest.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-8 space-y-2">
          <span className="px-3 py-1 bg-amber-500 text-slate-950 font-bold text-xs rounded-full">{dest.country} — {dest.region}</span>
          <h1 className="text-4xl font-bold font-serif text-white">{dest.name}</h1>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border space-y-6">
        <h2 className="text-2xl font-bold font-serif text-slate-900">About {dest.name}</h2>
        <p className="text-slate-600 leading-relaxed">{dest.description}</p>
        <div>
          <h3 className="font-bold text-slate-900 mb-3">Highlights</h3>
          <div className="flex flex-wrap gap-2">
            {dest.highlights.map((h, i) => (
              <span key={i} className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-semibold rounded-lg">{h}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
