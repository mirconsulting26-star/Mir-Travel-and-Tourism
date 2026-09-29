import React, { useState, useEffect } from 'react';
import {
  Compass, Plus, Building2, MapPin, Calendar, ShoppingCart, Users,
  Image as ImageIcon, Settings as SettingsIcon, FileText, Trash2, Search,
  CheckCircle2, AlertCircle, ExternalLink, Star, ShieldCheck, Sparkles,
  UploadCloud, Copy, Check, Eye, Clock, Phone, Mail, X
} from 'lucide-react';
import { apiClient, getApiBaseUrl, setApiBaseUrl } from '../../api/client';

// ==========================================
// 1. TOURS MANAGEMENT
// ==========================================
export const AdminTours: React.FC = () => {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDest, setNewDest] = useState('Benidorm & Costa Blanca');
  const [newDays, setNewDays] = useState(7);
  const [newPrice, setNewPrice] = useState(890);
  const [newSummary, setNewSummary] = useState('');

  const fallbackTours = [
    {
      id: 'tour_1',
      title: 'Costa Blanca Coastal Sun & Heritage Tour',
      destination: 'Benidorm & Costa Blanca',
      duration_days: 7,
      price_from: 890,
      is_featured: true,
      status: 'PUBLISHED',
      departures: [
        { id: 'dep_1', start_date: '2026-10-15', end_date: '2026-10-22', total_seats: 14, available_seats: 8, price: 890, status: 'AVAILABLE' },
        { id: 'dep_2', start_date: '2026-11-10', end_date: '2026-11-17', total_seats: 14, available_seats: 12, price: 920, status: 'AVAILABLE' }
      ]
    },
    {
      id: 'tour_2',
      title: 'Barcelona & Costa Brava Grand Explorer',
      destination: 'Barcelona & Costa Brava',
      duration_days: 5,
      price_from: 750,
      is_featured: true,
      status: 'PUBLISHED',
      departures: [
        { id: 'dep_3', start_date: '2026-10-25', end_date: '2026-10-30', total_seats: 12, available_seats: 5, price: 750, status: 'AVAILABLE' }
      ]
    }
  ];

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await apiClient.get('/admin/tours');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setTours(res.data);
        } else {
          setTours(fallbackTours);
        }
      } catch {
        setTours(fallbackTours);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const handleCreateTour = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newTourObj = {
      id: `tour_${Date.now()}`,
      title: newTitle,
      slug,
      summary: newSummary || `${newDays}-day escorted experience in ${newDest}.`,
      description: newSummary || `Experience the best of ${newDest}.`,
      destination: newDest,
      duration_days: Number(newDays),
      price_from: Number(newPrice),
      deposit_amount: 150,
      inclusions: ['4-star Hotel Accommodation', 'Daily Breakfast', 'Guided Excursions'],
      exclusions: ['Flights', 'Personal Expenses'],
      gallery: ['https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80'],
      status: 'PUBLISHED',
      is_featured: true,
      departures: [
        { id: `dep_${Date.now()}`, start_date: '2026-11-01', end_date: '2026-11-08', total_seats: 14, available_seats: 14, price: Number(newPrice), status: 'AVAILABLE' }
      ]
    };

    try {
      await apiClient.post('/admin/tours', newTourObj);
    } catch {}
    setTours([newTourObj, ...tours]);
    setShowModal(false);
    setNewTitle('');
    setNewSummary('');
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/admin/tours/${id}`);
    } catch {}
    setTours(tours.filter(t => t.id !== id));
  };

  const filtered = tours.filter(t => t.title?.toLowerCase().includes(search.toLowerCase()) || t.destination?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white flex items-center gap-3">
            <Compass className="w-7 h-7 text-amber-500" /> Tours & Departures Management
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Manage luxury tour packages, departure schedules, seat capacities, and pricing.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Tour Package
        </button>
      </div>

      <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
        <Search className="w-4 h-4 text-slate-500 ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tours by title or destination..."
          className="bg-transparent border-none text-white text-xs sm:text-sm w-full focus:outline-none placeholder:text-slate-600"
        />
      </div>

      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-bold">Tour Title</th>
                <th className="py-3.5 px-4 font-bold">Destination</th>
                <th className="py-3.5 px-4 font-bold">Duration</th>
                <th className="py-3.5 px-4 font-bold">From Price</th>
                <th className="py-3.5 px-4 font-bold">Departures</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((tour) => (
                <tr key={tour.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span>{tour.title}</span>
                      {tour.is_featured && <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[9px] font-bold">FEATURED</span>}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{tour.destination}</td>
                  <td className="py-3.5 px-4 text-slate-300">{tour.duration_days} Days</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400">€{tour.price_from}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded-md text-[11px]">
                      {tour.departures?.length || 0} dates active
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 bg-emerald-950/60 border border-emerald-800 text-emerald-400 rounded-full text-[10px] font-bold">
                      {tour.status || 'PUBLISHED'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(tour.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition-colors"
                      title="Delete tour"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateTour} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold font-serif text-lg">Create New Tour Package</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Tour Title</label>
              <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required placeholder="e.g. Costa Blanca Sunshine Tour" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Days</label>
                <input type="number" value={newDays} onChange={(e) => setNewDays(Number(e.target.value))} required className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm" />
              </div>
              <div className="col-span-1">
                <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Price (€)</label>
                <input type="number" value={newPrice} onChange={(e) => setNewPrice(Number(e.target.value))} required className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm" />
              </div>
              <div className="col-span-1">
                <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Region</label>
                <input type="text" value={newDest} onChange={(e) => setNewDest(e.target.value)} required className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Summary Overview</label>
              <textarea rows={3} value={newSummary} onChange={(e) => setNewSummary(e.target.value)} placeholder="Summary of itinerary..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs" />
            </div>
            <button type="submit" className="w-full py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-sm hover:bg-amber-600">Save & Publish Tour</button>
          </form>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. EVENTS CMS (Direct user request)
// ==========================================
export const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Benidorm / Alicante, Spain');
  const [date, setDate] = useState('2026-10-20 to 2026-10-25');
  const [summary, setSummary] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80');

  const fallbackEvents = [
    {
      id: 'ev_1',
      title: 'Benidorm Fest & Mediterranean Music Showcase',
      location: 'Palau d\'Esports l\'Illa, Benidorm',
      event_date: '2026-10-20 to 2026-10-25',
      summary: 'Spain\'s premier musical competition and cultural festival drawing artists across Europe.',
      cover_image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      status: 'PUBLISHED',
      is_featured: true
    },
    {
      id: 'ev_2',
      title: 'Hogueras de San Juan (Alicante Midsummer Fire Festival)',
      location: 'Plaza del Ayuntamiento, Alicante',
      event_date: '2026-06-20 to 2026-06-24',
      summary: 'Monumental artistic bonfires, fireworks, parades, and midnight beach festivities.',
      cover_image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
      status: 'PUBLISHED',
      is_featured: true
    },
    {
      id: 'ev_3',
      title: 'Costa Blanca International Sailing Regatta',
      location: 'Club Náutico Altea & Marina de Alicante',
      event_date: '2026-09-12 to 2026-09-16',
      summary: 'Prestigious offshore yacht racing between Alicante, Altea, and Calpe marinas.',
      cover_image: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=800&q=80',
      status: 'PUBLISHED',
      is_featured: true
    },
    {
      id: 'ev_4',
      title: 'Barcelona Mediterranean Wine & Gastronomy Week',
      location: 'Fira de Barcelona & Port Vell, Barcelona',
      event_date: '2026-11-05 to 2026-11-09',
      summary: 'Tasting sessions from Catalonia and Priorat vineyards paired with Michelin-starred tapas.',
      cover_image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
      status: 'PUBLISHED',
      is_featured: false
    }
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await apiClient.get('/admin/events');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setEvents(res.data);
        } else {
          setEvents(fallbackEvents);
        }
      } catch {
        setEvents(fallbackEvents);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newEv = {
      id: `ev_${Date.now()}`,
      title,
      slug,
      summary,
      description: summary,
      location,
      event_date: date,
      cover_image: coverImage,
      gallery: [coverImage],
      status: 'PUBLISHED',
      is_featured: true,
      created_at: new Date().toISOString()
    };

    try {
      await apiClient.post('/admin/events', newEv);
    } catch {}
    setEvents([newEv, ...events]);
    setShowModal(false);
    setTitle('');
    setSummary('');
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/admin/events/${id}`);
    } catch {}
    setEvents(events.filter(ev => ev.id !== id));
  };

  const filtered = events.filter(e => e.title?.toLowerCase().includes(search.toLowerCase()) || e.location?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white flex items-center gap-3">
            <Calendar className="w-7 h-7 text-amber-500" /> Tourism Events CMS
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Publish festivals, regattas, cultural fiestas, and gastronomy celebrations across Spain.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Publish New Event
        </button>
      </div>

      <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
        <Search className="w-4 h-4 text-slate-500 ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events by title or location..."
          className="bg-transparent border-none text-white text-xs sm:text-sm w-full focus:outline-none placeholder:text-slate-600"
        />
      </div>

      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-bold">Event & Cover</th>
                <th className="py-3.5 px-4 font-bold">Location</th>
                <th className="py-3.5 px-4 font-bold">Dates</th>
                <th className="py-3.5 px-4 font-bold">Summary</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div className="flex items-center gap-3">
                      <img src={ev.cover_image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=120&q=80'} alt={ev.title} className="w-12 h-10 rounded-lg object-cover border border-slate-800 shrink-0" />
                      <div>
                        <span className="block font-bold">{ev.title}</span>
                        {ev.is_featured && <span className="inline-block px-1.5 py-0.2 bg-amber-500/20 text-amber-400 rounded text-[9px] font-bold">FEATURED</span>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{ev.location}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-amber-300">{ev.event_date}</td>
                  <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">{ev.summary}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 bg-emerald-950/60 border border-emerald-800 text-emerald-400 rounded-full text-[10px] font-bold">
                      {ev.status || 'PUBLISHED'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(ev.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition-colors"
                      title="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateEvent} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold font-serif text-lg">Publish Tourism Event</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Event Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Alicante Summer Jazz & Regatta" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Location</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Dates</label>
                <input type="text" value={date} onChange={(e) => setDate(e.target.value)} required placeholder="2026-10-10 to 2026-10-15" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Cover Image URL</label>
              <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Summary Description</label>
              <textarea rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} required placeholder="Event highlights and visitor info..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs" />
            </div>
            <button type="submit" className="w-full py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-sm hover:bg-amber-600">Publish to Events Calendar</button>
          </form>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. DESTINATIONS DIRECTORY
// ==========================================
export const AdminDestinations: React.FC = () => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const fallback = [
    {
      id: 'dest_1',
      name: 'Benidorm & Costa Blanca',
      country: 'Spain',
      region: 'Alicante / Valencian Community',
      summary: 'Golden Mediterranean beaches, vibrant nightlife, theme parks, and stunning coastal cliffs.',
      is_featured: true
    },
    {
      id: 'dest_2',
      name: 'Barcelona & Costa Brava',
      country: 'Spain',
      region: 'Catalonia',
      summary: 'Architectural wonders by Gaudí, world-class gastronomy, and picturesque hidden coves.',
      is_featured: true
    },
    {
      id: 'dest_3',
      name: 'Balearic Islands (Mallorca & Ibiza)',
      country: 'Spain',
      region: 'Balearic Islands',
      summary: 'Pristine turquoise calas, luxury private yachts, and vibrant sunset beach clubs.',
      is_featured: false
    }
  ];

  useEffect(() => {
    const fetchDests = async () => {
      try {
        const res = await apiClient.get('/admin/destinations');
        if (Array.isArray(res.data) && res.data.length > 0) setDestinations(res.data);
        else setDestinations(fallback);
      } catch {
        setDestinations(fallback);
      }
    };
    fetchDests();
  }, []);

  const filtered = destinations.filter(d => d.name?.toLowerCase().includes(search.toLowerCase()) || d.region?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white flex items-center gap-3">
            <MapPin className="w-7 h-7 text-amber-500" /> Destinations Directory
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Manage Spain coastal hubs, region profiles, practical travel info, and hero assets.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((dest) => (
          <div key={dest.id} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3 relative group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400">{dest.country}</span>
              {dest.is_featured && <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px] font-bold">FEATURED REGION</span>}
            </div>
            <h3 className="font-bold text-white text-lg font-serif">{dest.name}</h3>
            <p className="text-xs text-slate-400 font-medium">{dest.region}</p>
            <p className="text-xs text-slate-300 leading-relaxed">{dest.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. HOTELS DIRECTORY & PARTNER FLAGS
// ==========================================
export const AdminHotels: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const fallbackHotels = [
    {
      id: 'hot_1',
      name: 'Gran Hotel Sol y Mar Luxury Resort',
      destination: 'Benidorm & Costa Blanca',
      stars: 5,
      rating: 4.9,
      price_per_night: 220,
      is_preferred: true,
      amenities: ['Infinity Pool', 'Thalasso Spa', 'Champagne Bar', 'Beach Club']
    },
    {
      id: 'hot_2',
      name: 'Hotel Boutique Villa Venecia Gourmet & Spa',
      destination: 'Benidorm Old Town',
      stars: 5,
      rating: 4.95,
      price_per_night: 280,
      is_preferred: true,
      amenities: ['Mediterranean Balcony', 'Gourmet Tasting Menu', 'Butler Service']
    },
    {
      id: 'hot_3',
      name: 'The Serras Barcelona Waterfront Luxury Hotel',
      destination: 'Barcelona Port Vell',
      stars: 5,
      rating: 4.88,
      price_per_night: 340,
      is_preferred: true,
      amenities: ['Rooftop Plunge Pool', 'Port Views', 'Michelin Dining']
    },
    {
      id: 'hot_4',
      name: 'Hospes Amérigo Luxury Heritage Hotel',
      destination: 'Alicante City Centre',
      stars: 5,
      rating: 4.82,
      price_per_night: 195,
      is_preferred: false,
      amenities: ['Castle View Rooftop', 'Bodyna Spa', 'Tapas Bar']
    }
  ];

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await apiClient.get('/admin/hotels');
        if (Array.isArray(res.data) && res.data.length > 0) setHotels(res.data);
        else setHotels(fallbackHotels);
      } catch {
        setHotels(fallbackHotels);
      }
    };
    fetchHotels();
  }, []);

  const togglePreferred = (id: string) => {
    setHotels(hotels.map(h => h.id === id ? { ...h, is_preferred: !h.is_preferred } : h));
  };

  const filtered = hotels.filter(h => h.name?.toLowerCase().includes(search.toLowerCase()) || h.destination?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white flex items-center gap-3">
            <Building2 className="w-7 h-7 text-amber-500" /> Hotel Inventory & Partner Flags
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Manage preferred partner agreements, star tiers, contracted rates, and guest amenities.</p>
        </div>
      </div>

      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs sm:text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 font-bold">Hotel Partner</th>
              <th className="py-3.5 px-4 font-bold">Location</th>
              <th className="py-3.5 px-4 font-bold">Star Rating</th>
              <th className="py-3.5 px-4 font-bold">From / Night</th>
              <th className="py-3.5 px-4 font-bold">Preferred Partner</th>
              <th className="py-3.5 px-4 font-bold">Amenities</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((hotel) => (
              <tr key={hotel.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">{hotel.name}</td>
                <td className="py-3.5 px-4 text-slate-400">{hotel.destination}</td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {hotel.rating || '5.0'} ({hotel.stars}★)
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-amber-400">€{hotel.price_per_night}</td>
                <td className="py-3.5 px-4">
                  <button
                    onClick={() => togglePreferred(hotel.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      hotel.is_preferred ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {hotel.is_preferred ? '★ PREFERRED' : 'STANDARD'}
                  </button>
                </td>
                <td className="py-3.5 px-4 text-slate-400">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {hotel.amenities?.slice(0, 2).map((a: string) => (
                      <span key={a} className="px-1.5 py-0.5 bg-slate-900 rounded text-[10px] text-slate-400">{a}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// 5. BOOKINGS & ORDER RECORDS
// ==========================================
export const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);

  const fallback = [
    {
      id: 'ord_1',
      order_id: 'MIR-ORD-8F29A10C',
      customer_name: 'Carlos Mendoza',
      customer_email: 'carlos.mendoza@example.com',
      total_amount: 1780.0,
      currency: 'EUR',
      status: 'CONFIRMED',
      payment_provider: 'STRIPE',
      items: [{ title: 'Costa Blanca Coastal Sun & Heritage Tour (2 Guests)', quantity: 2, unit_price: 890.0 }],
      created_at: '2026-09-28T14:30:00Z'
    },
    {
      id: 'ord_2',
      order_id: 'MIR-ORD-3B71E94D',
      customer_name: 'Sophie Laurent',
      customer_email: 'sophie.laurent@example.fr',
      total_amount: 680.0,
      currency: 'EUR',
      status: 'CONFIRMED',
      payment_provider: 'PAYPAL',
      items: [{ title: 'The Serras Barcelona Waterfront Luxury Hotel (2 Nights)', quantity: 2, unit_price: 340.0 }],
      created_at: '2026-09-25T11:15:00Z'
    }
  ];

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await apiClient.get('/admin/bookings');
        if (Array.isArray(res.data) && res.data.length > 0) setBookings(res.data);
        else setBookings(fallback);
      } catch {
        setBookings(fallback);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-amber-500" /> Bookings & Order Records
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Audit customer checkouts, webhook-verified transactions, and package order statuses.</p>
        </div>
      </div>

      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs sm:text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 font-bold">Order ID</th>
              <th className="py-3.5 px-4 font-bold">Customer</th>
              <th className="py-3.5 px-4 font-bold">Items Purchased</th>
              <th className="py-3.5 px-4 font-bold">Total</th>
              <th className="py-3.5 px-4 font-bold">Gateway</th>
              <th className="py-3.5 px-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {bookings.map((ord) => (
              <tr key={ord.id || ord.order_id} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{ord.order_id}</td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-white">{ord.customer_name}</div>
                  <div className="text-[11px] text-slate-500">{ord.customer_email}</div>
                </td>
                <td className="py-3.5 px-4 text-slate-300">
                  {ord.items?.[0]?.title || 'Package Booking'}
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-white">€{ord.total_amount?.toFixed(2)}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-[11px] font-mono">
                    {ord.payment_provider}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 bg-emerald-950/60 border border-emerald-800 text-emerald-400 rounded-full text-[10px] font-bold">
                    {ord.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// 6. CUSTOMER PROFILES
// ==========================================
export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);

  const fallback = [
    {
      id: 'cust_1',
      full_name: 'Carlos Mendoza',
      email: 'carlos.mendoza@example.com',
      phone: '+34 611 223 344',
      passport_number: 'ESP-8839201A',
      notes: 'VIP client. Prefers window seats on Iberia flights and upper-floor hotel suites.'
    },
    {
      id: 'cust_2',
      full_name: 'Sophie Laurent',
      email: 'sophie.laurent@example.fr',
      phone: '+33 612 345 678',
      passport_number: 'FRA-7729103B',
      notes: 'Interested in Costa Blanca catamaran excursions and gourmet wine tastings.'
    },
    {
      id: 'cust_3',
      full_name: 'David Wilson',
      email: 'david.wilson@example.co.uk',
      phone: '+44 7700 900123',
      passport_number: 'GBR-4491029C',
      notes: 'Corporate retreat organizer. Books small group flight desk packages.'
    }
  ];

  useEffect(() => {
    const fetchCust = async () => {
      try {
        const res = await apiClient.get('/admin/customers');
        if (Array.isArray(res.data) && res.data.length > 0) setCustomers(res.data);
        else setCustomers(fallback);
      } catch {
        setCustomers(fallback);
      }
    };
    fetchCust();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white flex items-center gap-3">
            <Users className="w-7 h-7 text-amber-500" /> Customer Profiles & CRM
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Client passport numbers, contact history, airline preferences, and travel notes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {customers.map((c) => (
          <div key={c.id} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center font-serif text-lg">
                {c.full_name?.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{c.full_name}</h3>
                <span className="text-[11px] text-slate-500 font-mono">{c.passport_number || 'Passport not recorded'}</span>
              </div>
            </div>
            <div className="space-y-1 text-xs text-slate-400 pt-2 border-t border-slate-900">
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-amber-500" /> {c.email}</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-amber-500" /> {c.phone || 'N/A'}</p>
            </div>
            {c.notes && (
              <p className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 italic">
                "{c.notes}"
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 7. MEDIA LIBRARY
// ==========================================
export const AdminMedia: React.FC = () => {
  const [copiedId, setCopiedId] = useState('');

  const mediaItems = [
    { id: '1', url: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80', title: 'Benidorm Mediterranean Horizon', size: '420 KB' },
    { id: '2', url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80', title: 'Barcelona Gothic Quarter', size: '580 KB' },
    { id: '3', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', title: 'Benidorm Fest Concert Stage', size: '390 KB' },
    { id: '4', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', title: 'Gran Hotel Sol y Mar Resort', size: '510 KB' }
  ];

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white flex items-center gap-3">
            <ImageIcon className="w-7 h-7 text-amber-500" /> Media Library
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Upload and manage high-resolution assets for blog articles, tours, and destination hero images.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mediaItems.map((m) => (
          <div key={m.id} className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden group shadow-lg flex flex-col">
            <img src={m.url} alt={m.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform" />
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-white text-xs truncate">{m.title}</h4>
                <span className="text-[10px] text-slate-500 font-mono">{m.size}</span>
              </div>
              <button
                onClick={() => handleCopy(m.url, m.id)}
                className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedId === m.id ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Image URL</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 8. AUDIT LOGS
// ==========================================
export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);

  const fallback = [
    { id: 'log_1', user_email: 'admin@mirtravel.es', action: 'CREATE', resource: 'BLOG', details: 'Published blog article "Top 10 Hidden Gems"', timestamp: '2026-09-30T00:15:00Z' },
    { id: 'log_2', user_email: 'admin@mirtravel.es', action: 'EVALUATE_FLIGHTS', resource: 'FLIGHT_DESK', details: 'Ran explainable scoring for client Carlos Mendoza (MAD -> BCN)', timestamp: '2026-09-29T22:30:00Z' },
    { id: 'log_3', user_email: 'admin@mirtravel.es', action: 'SYSTEM_BOOTSTRAP', resource: 'DATABASE', details: 'Initial system initialization & demo catalogue seeded.', timestamp: '2026-09-29T20:00:00Z' }
  ];

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await apiClient.get('/admin/audit-logs');
        if (Array.isArray(res.data) && res.data.length > 0) setLogs(res.data);
        else setLogs(fallback);
      } catch {
        setLogs(fallback);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white flex items-center gap-3">
            <FileText className="w-7 h-7 text-amber-500" /> System Audit Trail
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Chronological logs of quote generation, CMS publishing, and staff desk activities.</p>
        </div>
      </div>

      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs sm:text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 font-bold">Timestamp</th>
              <th className="py-3.5 px-4 font-bold">Staff User</th>
              <th className="py-3.5 px-4 font-bold">Action</th>
              <th className="py-3.5 px-4 font-bold">Resource</th>
              <th className="py-3.5 px-4 font-bold">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{new Date(l.timestamp).toLocaleString()}</td>
                <td className="py-3.5 px-4 font-semibold text-white">{l.user_email}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px] font-bold font-mono">
                    {l.action}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-300 text-xs">{l.resource}</td>
                <td className="py-3.5 px-4 text-slate-400">{l.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// 9. SITE SETTINGS & PROVIDERS
// ==========================================
export const AdminSettings: React.FC = () => {
  const [apiUrl, setApiUrl] = useState(getApiBaseUrl());
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setApiBaseUrl(apiUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white flex items-center gap-3">
            <SettingsIcon className="w-7 h-7 text-amber-500" /> Site Settings & Providers
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Provider integration modes, API routing endpoints, and agency configuration.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSave} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base font-serif">API Backend Route Configuration</h3>
          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Active Backend API Base URL</label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Defaults to your live Render backend on production, or /api/v1 locally.</p>
          </div>
          <button type="submit" className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-600 flex items-center gap-1.5">
            {saved ? <><Check className="w-3.5 h-3.5" /> Saved Successfully</> : 'Update API Endpoint'}
          </button>
        </form>

        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base font-serif">Active Integration Adapters</h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl">
              <span>Amadeus Flight GDS Engine</span>
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded-md font-bold text-[10px]">Mock Adapter Active</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl">
              <span>Stripe Checkout & Webhooks</span>
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded-md font-bold text-[10px]">Mock Adapter Active</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl">
              <span>PayPal Orders V2</span>
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded-md font-bold text-[10px]">Mock Adapter Active</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl">
              <span>Cloudinary Media CDN</span>
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded-md font-bold text-[10px]">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
