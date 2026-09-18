import React, { useState, useEffect } from 'react';
import { Ticket, Plus, CheckCircle, Star, ShieldCheck } from 'lucide-react';
import { apiClient } from '../../api/client';
import { Airline } from '../../types';

export const AdminAirlines: React.FC = () => {
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(true);

  // New Airline Form
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [isPreferred, setIsPreferred] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  const fetchAirlines = async () => {
    try {
      const res = await apiClient.get('/admin/airlines');
      setAirlines(res.data);
    } catch (err) {
      console.error('Failed to load airlines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirlines();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/admin/airlines', {
        code,
        name,
        is_active: true,
        is_preferred: isPreferred,
        is_featured: isFeatured,
      });
      setCode('');
      setName('');
      setIsPreferred(false);
      setIsFeatured(false);
      fetchAirlines();
    } catch (err) {
      console.error('Failed to create airline:', err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold font-serif text-white flex items-center gap-3">
            <Ticket className="w-8 h-8 text-amber-500" /> Airline Focus & Preference Controls
          </h1>
          <p className="text-slate-400 text-sm mt-1">Configure active carriers, preferred flags, and recommendation ranking bonuses.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Airline Form */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 h-fit">
          <h3 className="font-bold text-white text-base font-serif">Add Carrier Code</h3>
          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 uppercase font-bold mb-1">IATA / ICAO Code</label>
              <input
                type="text"
                placeholder="e.g. IB, VY, UX"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold uppercase"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 uppercase font-bold mb-1">Airline Name</label>
              <input
                type="text"
                placeholder="e.g. Iberia"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-semibold"
                required
              />
            </div>
            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 text-slate-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPreferred}
                  onChange={(e) => setIsPreferred(e.target.checked)}
                  className="rounded accent-amber-500 w-4 h-4"
                />
                Preferred Carrier (+10 pts in Flight Desk)
              </label>
              <label className="flex items-center gap-2 text-slate-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded accent-amber-500 w-4 h-4"
                />
                Featured on Customer Search
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" /> Save Airline Flag
            </button>
          </form>
        </div>

        {/* Airline List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-white text-base font-serif">Active Carrier List</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {airlines.map((air) => (
              <div key={air.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-bold text-sm flex items-center justify-center border border-slate-800">
                    {air.code}
                  </span>
                  {air.is_preferred && (
                    <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold uppercase rounded-full">
                      Preferred (+10 pts)
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-white text-base">{air.name}</h4>
                <p className="text-xs text-slate-400">{air.notes || 'Standard Mediterranean route coverage'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
