import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, Building2, Compass, ArrowRight, ShieldCheck, Star, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../api/client';
import { Tour, Destination, BlogPost } from '../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'tours'>('flights');
  
  // Flight search form state
  const [flightOrigin, setFlightOrigin] = useState('MAD');
  const [flightDest, setFlightDest] = useState('BCN');
  const [flightDate, setFlightDate] = useState('2026-10-15');
  const [flightPassengers, setFlightPassengers] = useState(1);
  const [flightCabin, setFlightCabin] = useState('ECONOMY');

  // Hotel search form state
  const [hotelDest, setHotelDest] = useState('Benidorm');

  // Data states
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [featuredDests, setFeaturedDests] = useState<Destination[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toursRes, destsRes, blogRes] = await Promise.all([
          apiClient.get('/tours?featured_only=true'),
          apiClient.get('/destinations?featured_only=true'),
          apiClient.get('/blog')
        ]);
        setFeaturedTours(toursRes.data);
        setFeaturedDests(destsRes.data);
        setBlogPosts(blogRes.data);
      } catch (err) {
        console.error('Failed to load home page content:', err);
      }
    };
    fetchData();
  }, []);

  const handleFlightSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/flights?origin=${flightOrigin}&destination=${flightDest}&date=${flightDate}&passengers=${flightPassengers}&cabin=${flightCabin}`);
  };

  const handleHotelSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/hotels?destination=${hotelDest}`);
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* HERO SECTION WITH SEARCH SWITCHER */}
      <section className="relative min-h-[85vh] flex items-center pt-24 pb-16 bg-slate-950 text-white overflow-hidden">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=2000&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
          
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> Spain & Mediterranean Travel Specialists
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold font-serif leading-tight text-white tracking-tight">
              Experience Spain in Luxury, Comfort & Style
            </h1>
            <p className="text-lg text-slate-300 font-normal leading-relaxed">
              Bespoke flight recommendations, curated 4-star & 5-star Mediterranean hotels, and handcrafted coastal tour experiences.
            </p>
          </div>

          {/* SEARCH BOX SWITCHER CARD */}
          <div className="glass-panel text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/40 max-w-4xl">
            
            {/* Tabs Header */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-6">
              <button
                onClick={() => setActiveTab('flights')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'flights' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Plane className="w-4 h-4" /> Flights
              </button>
              <button
                onClick={() => setActiveTab('hotels')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'hotels' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-4 h-4" /> Hotels
              </button>
              <button
                onClick={() => setActiveTab('tours')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'tours' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Compass className="w-4 h-4" /> Tours & Packages
              </button>
            </div>

            {/* Flights Search Form */}
            {activeTab === 'flights' && (
              <form onSubmit={handleFlightSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Origin (Airport)</label>
                  <input
                    type="text"
                    value={flightOrigin}
                    onChange={(e) => setFlightOrigin(e.target.value)}
                    placeholder="e.g. MAD, LHR"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Destination</label>
                  <input
                    type="text"
                    value={flightDest}
                    onChange={(e) => setFlightDest(e.target.value)}
                    placeholder="e.g. BCN, ALC"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Departure Date</label>
                  <input
                    type="date"
                    value={flightDate}
                    onChange={(e) => setFlightDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Cabin Class</label>
                  <select
                    value={flightCabin}
                    onChange={(e) => setFlightCabin(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="ECONOMY">Economy</option>
                    <option value="BUSINESS">Business</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Plane className="w-4 h-4" /> Search Flights
                </button>
              </form>
            )}

            {/* Hotels Search Form */}
            {activeTab === 'hotels' && (
              <form onSubmit={handleHotelSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Destination City or Resort</label>
                  <input
                    type="text"
                    value={hotelDest}
                    onChange={(e) => setHotelDest(e.target.value)}
                    placeholder="e.g. Benidorm, Barcelona, Alicante"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <Building2 className="w-4 h-4" /> Find Hotels
                </button>
              </form>
            )}

            {/* Tours Tab Content */}
            {activeTab === 'tours' && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-base font-serif">Explore Handcrafted Spain & Mediterranean Tours</h4>
                  <p className="text-xs text-slate-500">Includes 4-star hotel stays, catamaran cruises, and local guided walking tours.</p>
                </div>
                <Link
                  to="/tours"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-md flex items-center gap-2"
                >
                  Browse Tours Catalog <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

          </div>

        </div>
      </section>


      {/* FEATURED DESTINATIONS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-amber-600 font-bold text-xs uppercase tracking-widest block mb-1">Curated Regions</span>
            <h2 className="text-3xl font-bold font-serif text-slate-900">Featured Spain Destinations</h2>
          </div>
          <Link to="/destinations" className="text-amber-600 font-semibold text-sm hover:underline flex items-center gap-1">
            View All Destinations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredDests.map((dest) => (
            <Link
              key={dest.id}
              to={`/destinations/${dest.slug}`}
              className="group relative rounded-3xl overflow-hidden shadow-lg h-96 block transition-all hover:shadow-2xl"
            >
              <img
                src={dest.hero_image || 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80'}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-8 space-y-2">
                <span className="inline-block px-3 py-1 bg-amber-500 text-slate-950 font-bold text-xs rounded-full">
                  {dest.country} — {dest.region}
                </span>
                <h3 className="text-2xl font-bold text-white font-serif group-hover:text-amber-400 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-sm text-slate-300 line-clamp-2">{dest.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* POPULAR TOURS SECTION */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-widest block">Handpicked Itineraries</span>
            <h2 className="text-3xl font-bold font-serif text-white">Popular Escorted Packages</h2>
            <p className="text-sm text-slate-400">All packages feature verified hotel stays, airport transfers, and expert local guides.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTours.map((tour) => (
              <div key={tour.id} className="bg-slate-800 rounded-3xl overflow-hidden border border-slate-700/60 flex flex-col justify-between group hover:border-amber-500/50 transition-all">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={tour.gallery[0] || 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80'}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-400">
                    {tour.duration_days} Days / {tour.duration_days - 1} Nights
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" /> {tour.destination}
                    </span>
                    <h3 className="text-xl font-bold font-serif text-white group-hover:text-amber-400 transition-colors">
                      {tour.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2">{tour.summary}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Starting from</span>
                      <span className="text-xl font-extrabold text-amber-400">€{tour.price_from}</span>
                      <span className="text-xs text-slate-400"> / person</span>
                    </div>

                    <Link
                      to={`/tours/${tour.slug}`}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1"
                    >
                      View Package <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* TRAVEL JOURNAL / BLOG PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-amber-600 font-bold text-xs uppercase tracking-widest block mb-1">Travel Insights</span>
            <h2 className="text-3xl font-bold font-serif text-slate-900">MIR Travel Journal</h2>
          </div>
          <Link to="/blog" className="text-amber-600 font-semibold text-sm hover:underline flex items-center gap-1">
            Read Journal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="group flex flex-col sm:flex-row bg-white rounded-3xl overflow-hidden shadow-md border border-slate-100 hover:shadow-xl transition-all">
              <div className="sm:w-2/5 relative h-48 sm:h-auto">
                <img
                  src={post.cover_image || 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=600&q=80'}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="sm:w-3/5 p-6 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-bold font-serif text-slate-900 group-hover:text-amber-600 transition-colors mt-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{post.excerpt}</p>
                </div>
                <div className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
};
