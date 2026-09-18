import React, { useState } from 'react';
import { Plane, Award, CheckCircle, Save, Sparkles, Filter, ChevronRight, ShieldCheck, Info } from 'lucide-react';
import { apiClient } from '../../api/client';
import { FlightOffer, FlightDeskRequest, Quote } from '../../types';

export const AdminFlightDesk: React.FC = () => {
  const [clientName, setClientName] = useState('Carlos Rodriguez');
  const [clientEmail, setClientEmail] = useState('carlos@example.com');
  const [origin, setOrigin] = useState('MAD');
  const [destination, setDestination] = useState('BCN');
  const [departureDate, setDepartureDate] = useState('2026-10-15');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(2);
  const [cabinClass, setCabinClass] = useState('ECONOMY');
  const [budgetMax, setBudgetMax] = useState<number | ''>(500);
  const [preferredAirlines, setPreferredAirlines] = useState('IB, VY');
  const [excludedAirlines, setExcludedAirlines] = useState('');
  const [maxStops, setMaxStops] = useState<number | ''>(1);
  const [baggageRequired, setBaggageRequired] = useState(true);

  const [offers, setOffers] = useState<FlightOffer[]>([]);
  const [evaluating, setEvaluating] = useState(false);
  const [savedQuote, setSavedQuote] = useState<Quote | null>(null);

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEvaluating(true);
    setSavedQuote(null);
    try {
      const prefArr = preferredAirlines.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
      const exclArr = excludedAirlines.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);

      const requestPayload: FlightDeskRequest = {
        client_name: clientName,
        client_email: clientEmail,
        origin,
        destination,
        departure_date: departureDate,
        return_date: returnDate || undefined,
        passengers,
        cabin_class: cabinClass,
        flexibility_days: 0,
        budget_max: budgetMax ? Number(budgetMax) : undefined,
        preferred_airlines: prefArr,
        excluded_airlines: exclArr,
        max_stops: maxStops !== '' ? Number(maxStops) : undefined,
        baggage_required: baggageRequired,
      };

      const res = await apiClient.post('/admin/flight-desk/evaluate', requestPayload);
      setOffers(res.data);
    } catch (err) {
      console.error('Flight desk evaluation error:', err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleSaveQuoteSnapshot = async () => {
    if (offers.length === 0) return;
    try {
      const res = await apiClient.post('/admin/quotes', {
        client_name: clientName,
        client_email: clientEmail,
        flight_offers: offers.slice(0, 3), // Top shortlisted offers
        notes: `Flight Desk Quote generated for ${clientName}`
      });
      setSavedQuote(res.data);
    } catch (err) {
      console.error('Failed to create quote snapshot:', err);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold font-serif text-white flex items-center gap-3">
            <Plane className="w-8 h-8 text-amber-500" /> Flight Desk Recommendation Engine
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Staff tool: Input client requirements, run explainable multi-factor scoring, and create official quote snapshots.
          </p>
        </div>
      </div>

      {savedQuote && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-2xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>Quote Snapshot Saved! Reference: <strong className="font-mono text-white">{savedQuote.quote_reference}</strong> (Valid until {savedQuote.valid_until.split('T')[0]})</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Structured Request Form */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6 h-fit">
          <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2 font-serif">
            <Filter className="w-4 h-4 text-amber-500" /> Client Criteria Form
          </h3>

          <form onSubmit={handleEvaluate} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 uppercase font-bold mb-1">Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 uppercase font-bold mb-1">Client Email</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1">Origin (Airport)</label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1">Destination</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold uppercase"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1">Departure Date</label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1">Passengers</label>
                <input
                  type="number"
                  min={1}
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1">Cabin Class</label>
                <select
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-semibold"
                >
                  <option value="ECONOMY">Economy</option>
                  <option value="BUSINESS">Business</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1">Max Budget (€)</label>
                <input
                  type="number"
                  placeholder="No limit"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 uppercase font-bold mb-1">Preferred Airlines (IATA codes)</label>
              <input
                type="text"
                placeholder="e.g. IB, VY"
                value={preferredAirlines}
                onChange={(e) => setPreferredAirlines(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-semibold"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="baggageReq"
                checked={baggageRequired}
                onChange={(e) => setBaggageRequired(e.target.checked)}
                className="rounded accent-amber-500 w-4 h-4"
              />
              <label htmlFor="baggageReq" className="text-slate-300 font-semibold cursor-pointer">Require Checked Baggage</label>
            </div>

            <button
              type="submit"
              disabled={evaluating}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors mt-4"
            >
              <Sparkles className="w-4 h-4" /> {evaluating ? 'Evaluating Scores...' : 'Run Ranking Algorithm'}
            </button>
          </form>
        </div>

        {/* Right Column: Ranked Results & Explainable Reasons */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">
              Found <strong className="text-amber-400 font-bold">{offers.length}</strong> normalized flight offer(s)
            </span>
            {offers.length > 0 && (
              <button
                onClick={handleSaveQuoteSnapshot}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <Save className="w-4 h-4" /> Save Quote Snapshot
              </button>
            )}
          </div>

          <div className="space-y-4">
            {offers.map((offer, idx) => (
              <div
                key={offer.offer_id}
                className={`p-6 rounded-3xl border transition-all space-y-4 ${
                  offer.is_shortlisted
                    ? 'bg-slate-950 border-amber-500/60 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-base flex items-center gap-2">
                        {offer.outbound_segments[0].airline_name}
                        {offer.is_shortlisted && (
                          <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-extrabold text-[10px] rounded-full uppercase">
                            Top Recommendation
                          </span>
                        )}
                      </h4>
                      <span className="text-xs text-slate-400">{offer.fare_class} • {offer.stops === 0 ? 'Direct' : `${offer.stops} Stop`}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-amber-400">€{offer.price}</span>
                    <span className="block text-[10px] text-emerald-400 font-bold font-mono">Score: {offer.score} / 100 pts</span>
                  </div>
                </div>

                {/* Explainable Reasons Breakdown */}
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80 space-y-1.5">
                  <span className="text-[11px] uppercase font-bold text-amber-400 block mb-1">Explainable Recommendation Factors:</span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {offer.explainable_reasons?.map((reason, rIdx) => (
                      <li key={rIdx} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
