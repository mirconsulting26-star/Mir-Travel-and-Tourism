import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plane, Filter, ArrowRight, Luggage, Clock, Check, Info, ShieldCheck } from 'lucide-react';
import { apiClient } from '../api/client';
import { FlightOffer, Segment } from '../types';

export const Flights: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [origin, setOrigin] = useState(searchParams.get('origin') || 'MAD');
  const [destination, setDestination] = useState(searchParams.get('destination') || 'BCN');
  const [departureDate, setDepartureDate] = useState(searchParams.get('date') || '2026-10-15');
  const [passengers, setPassengers] = useState(Number(searchParams.get('passengers')) || 1);
  const [cabinClass, setCabinClass] = useState(searchParams.get('cabin') || 'ECONOMY');
  const [directOnly, setDirectOnly] = useState(false);

  const [offers, setOffers] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<FlightOffer | null>(null);

  // Filter States
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(1000);
  const [stopsFilter, setStopsFilter] = useState<string>('ALL');

  const executeSearch = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post('/flights/search', {
        origin,
        destination,
        departure_date: departureDate,
        passengers,
        cabin_class: cabinClass,
        direct_only: directOnly,
      });
      setOffers(res.data);
    } catch (err) {
      console.error('Flight search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch();
  }, []);

  const filteredOffers = offers.filter((o) => {
    if (o.price > maxPriceFilter) return false;
    if (stopsFilter === 'DIRECT' && o.stops !== 0) return false;
    if (stopsFilter === 'ONE_STOP' && o.stops > 1) return false;
    return true;
  });

  const handleBookFlight = (offer: FlightOffer) => {
    navigate('/checkout', {
      state: {
        item_type: 'FLIGHT_QUOTE',
        item_id: offer.offer_id,
        title: `Flight ${origin.toUpperCase()} to ${destination.toUpperCase()} (${offer.outbound_segments[0].airline_name})`,
        unit_price: offer.price,
        quantity: passengers,
        details: { offer }
      }
    });
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-3">
          <Plane className="w-8 h-8 text-amber-500" /> Flight Search & Recommendations
        </h1>
        <p className="text-slate-500 text-sm">
          Live normalized airline offers across Spain and international hubs.
        </p>
      </div>

      {/* SEARCH BAR PANEL */}
      <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
        <form onSubmit={(e) => { e.preventDefault(); executeSearch(); }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">From (Origin)</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 uppercase"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">To (Destination)</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 uppercase"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Departure Date</label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Passengers</label>
            <input
              type="number"
              min={1}
              max={9}
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cabin</label>
            <select
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            >
              <option value="ECONOMY">Economy</option>
              <option value="BUSINESS">Business</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2"
          >
            {loading ? 'Searching...' : 'Search Flights'}
          </button>
        </form>
      </div>

      {/* RESULTS WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* FILTERS SIDEBAR */}
        <div className="space-y-6 bg-white p-6 rounded-3xl border border-slate-100 h-fit">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b pb-3">
            <Filter className="w-4 h-4 text-amber-500" /> Filter Flight Results
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Max Price (€{maxPriceFilter})</label>
            <input
              type="range"
              min={50}
              max={1500}
              step={25}
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Stops</label>
            <select
              value={stopsFilter}
              onChange={(e) => setStopsFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value="ALL">All Stops</option>
              <option value="DIRECT">Direct Only</option>
              <option value="ONE_STOP">Max 1 Stop</option>
            </select>
          </div>

          <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
            Server authority prices guaranteed
          </div>
        </div>

        {/* FLIGHT OFFERS LIST */}
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-slate-500">Searching flight offers across carriers...</div>
          ) : filteredOffers.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-3xl p-8 border text-slate-500">
              No flights found matching your filter criteria. Try expanding search parameters.
            </div>
          ) : (
            filteredOffers.map((offer) => (
              <div key={offer.offer_id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-4">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm">
                      {offer.outbound_segments[0].airline_code}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{offer.outbound_segments[0].airline_name}</h4>
                      <span className="text-xs text-slate-500">{offer.fare_class} • Flight {offer.outbound_segments[0].flight_number}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-2xl font-extrabold text-slate-900">€{offer.price}</span>
                    <span className="block text-[10px] text-slate-400">Total for {passengers} traveller(s)</span>
                  </div>
                </div>

                {/* Segment timeline */}
                <div className="flex items-center justify-between py-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">
                      {offer.outbound_segments[0].departure_time.split('T')[1].substring(0, 5)}
                    </span>
                    <span className="text-slate-500">{offer.outbound_segments[0].departure_airport}</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {Math.floor(offer.total_duration_minutes / 60)}h {offer.total_duration_minutes % 60}m
                    </span>
                    <div className="w-24 h-0.5 bg-slate-200 relative flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600">
                      {offer.stops === 0 ? 'Direct Flight' : `${offer.stops} Stop`}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-slate-900 text-sm block">
                      {offer.outbound_segments[offer.outbound_segments.length - 1].arrival_time.split('T')[1].substring(0, 5)}
                    </span>
                    <span className="text-slate-500">{offer.outbound_segments[offer.outbound_segments.length - 1].arrival_airport}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Luggage className="w-4 h-4 text-amber-500" />
                      {offer.baggage_included ? 'Hand baggage included' : 'Baggage fee applies'}
                    </span>
                    <span className="text-slate-400">• {offer.provider}</span>
                  </div>

                  <button
                    onClick={() => handleBookFlight(offer)}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all"
                  >
                    Select Flight
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
