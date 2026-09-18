import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Building2, Star, MapPin, Check, ShieldCheck } from 'lucide-react';
import { apiClient } from '../api/client';
import { HotelOffer } from '../types';

export const Hotels: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(searchParams.get('destination') || 'Benidorm');
  const [hotels, setHotels] = useState<HotelOffer[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post('/hotels/search', {
        destination,
        check_in: '2026-10-15',
        check_out: '2026-10-18',
        guests: 2,
        rooms: 1
      });
      setHotels(res.data);
    } catch (err) {
      console.error('Hotel search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleBookHotel = (hotel: HotelOffer) => {
    navigate('/checkout', {
      state: {
        item_type: 'HOTEL',
        item_id: hotel.hotel_id,
        title: `${hotel.name} (${hotel.room_type})`,
        unit_price: hotel.total_price,
        quantity: 1,
        details: { hotel }
      }
    });
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-3">
          <Building2 className="w-8 h-8 text-amber-500" /> Hotel Collection & Reserves
        </h1>
        <p className="text-slate-500 text-sm">
          Handpicked luxury resort stays, boutique hotels, and beachfront properties in Spain.
        </p>
      </div>

      {/* Search Header */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Destination City</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
          />
        </div>
        <button
          onClick={fetchHotels}
          className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-md"
        >
          {loading ? 'Searching...' : 'Search Hotels'}
        </button>
      </div>

      {/* Hotel Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-500">Searching hotels in {destination}...</div>
      ) : hotels.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-100 p-8 text-slate-500">
          No hotels found for <strong>{destination}</strong>. Try a different city or check your connection.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hotels.map((hotel) => (
            <div key={hotel.hotel_id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div className="relative h-64 overflow-hidden">
                <img src={hotel.image_url} alt={hotel.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {hotel.stars} Star • {hotel.rating}/10
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" /> {hotel.address}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 font-serif">{hotel.name}</h3>
                  <span className="inline-block text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg">
                    {hotel.room_type}
                  </span>
                  <p className="text-xs text-slate-500">{hotel.cancellation_policy}</p>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {hotel.amenities.map((a, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md">
                      {a}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-extrabold text-slate-900">€{hotel.price_per_night}</span>
                    <span className="text-xs text-slate-500"> / night</span>
                  </div>
                  <button
                    onClick={() => handleBookHotel(hotel)}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-sm"
                  >
                    Reserve Room
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
