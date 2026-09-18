import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Compass, Calendar, Clock, MapPin, CheckCircle, XCircle, ShieldCheck, ArrowRight, User } from 'lucide-react';
import { apiClient } from '../api/client';
import { Tour, TourDeparture } from '../types';

export const TourDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDeparture, setSelectedDeparture] = useState<TourDeparture | null>(null);
  const [paymentType, setPaymentType] = useState<'FULL' | 'DEPOSIT'>('FULL');
  const [passengers, setPassengers] = useState(1);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await apiClient.get(`/tours/${slug}`);
        setTour(res.data);
        if (res.data.departures?.length > 0) {
          setSelectedDeparture(res.data.departures[0]);
        }
      } catch (err) {
        console.error('Failed to load tour details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [slug]);

  if (loading || !tour) {
    return <div className="pt-32 text-center text-slate-500">Loading tour itinerary...</div>;
  }

  const unitPrice = paymentType === 'DEPOSIT' ? tour.deposit_amount : (selectedDeparture?.price || tour.price_from);
  const totalPrice = unitPrice * passengers;

  const handleCheckout = () => {
    if (!selectedDeparture) return;
    navigate('/checkout', {
      state: {
        item_type: 'TOUR',
        item_id: tour.id,
        title: `${tour.title} (${selectedDeparture.start_date} to ${selectedDeparture.end_date})`,
        unit_price: unitPrice,
        quantity: passengers,
        details: {
          tour_id: tour.id,
          departure_id: selectedDeparture.id,
          payment_type: paymentType,
          start_date: selectedDeparture.start_date
        }
      }
    });
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl h-96">
        <img src={tour.gallery[0]} alt={tour.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-8 space-y-3">
          <span className="inline-block px-3.5 py-1 bg-amber-500 text-slate-950 font-bold text-xs rounded-full">
            {tour.destination}
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-white">{tour.title}</h1>
          <div className="flex items-center gap-6 text-slate-300 text-xs font-semibold">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-400" /> {tour.duration_days} Days / {tour.duration_days - 1} Nights</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-amber-400" /> Guaranteed Departure</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Summary, Inclusions, Itinerary */}
        <div className="lg:col-span-2 space-y-10">
          
          <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-4">
            <h2 className="text-2xl font-bold font-serif text-slate-900">Tour Overview</h2>
            <p className="text-slate-600 leading-relaxed text-sm">{tour.description}</p>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-8 rounded-3xl border border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" /> Included in Package
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {tour.inclusions.map((inc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    {inc}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-400" /> Excluded
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {tour.exclusions.map((exc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    {exc}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Day-by-Day Itinerary */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-6">
            <h2 className="text-2xl font-bold font-serif text-slate-900">Day-by-Day Itinerary</h2>
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {tour.itinerary.map((day) => (
                <div key={day.day} className="relative pl-10 space-y-1">
                  <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center border-2 border-white shadow-sm">
                    {day.day}
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{day.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{day.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Departure Selector & Checkout Card */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 space-y-6 sticky top-28 shadow-xl">
            
            <div>
              <span className="text-xs uppercase text-amber-400 font-bold tracking-wider block">Reserve Your Spot</span>
              <div className="text-3xl font-extrabold text-white mt-1">€{totalPrice}</div>
              <span className="text-xs text-slate-400">Total for {passengers} traveller(s)</span>
            </div>

            {/* Departure selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select Departure Date</label>
              <div className="space-y-2">
                {tour.departures.map((dep) => (
                  <button
                    key={dep.id}
                    onClick={() => setSelectedDeparture(dep)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all ${
                      selectedDeparture?.id === dep.id
                        ? 'border-amber-500 bg-amber-500/10 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{dep.start_date} → {dep.end_date}</span>
                      <span className="text-amber-400 font-bold">€{dep.price}</span>
                    </div>
                    <span className="block text-[10px] text-slate-500 mt-1">{dep.available_seats} seats remaining</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Passengers & Payment Option */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Travellers</label>
                <input
                  type="number"
                  min={1}
                  max={selectedDeparture?.available_seats || 10}
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Payment</label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as 'FULL' | 'DEPOSIT')}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white"
                >
                  <option value="FULL">Full Payment</option>
                  <option value="DEPOSIT">Deposit Only (€{tour.deposit_amount})</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={!selectedDeparture || selectedDeparture.available_seats <= 0}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              Proceed to Booking <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-slate-400 text-center">
              Server authority price calculation. Verified booking confirmation.
            </p>

          </div>
        </div>

      </div>

    </div>
  );
};
