import React from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-bold font-serif text-slate-900">Contact MIR Travel Desk</h1>
        <p className="text-slate-500 text-sm">Have questions regarding bespoke flight quotes, tours, or corporate travel? Our staff are here to assist.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-3 text-center">
          <MapPin className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="font-bold text-slate-900 font-serif">Main Office</h3>
          <p className="text-xs text-slate-500">Paseo Marítimo 45, 03502 Benidorm, Alicante, Spain</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-3 text-center">
          <Phone className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="font-bold text-slate-900 font-serif">Telephone</h3>
          <p className="text-xs text-slate-500">+34 965 800 123</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-3 text-center">
          <Mail className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="font-bold text-slate-900 font-serif">Email Enquiries</h3>
          <p className="text-xs text-slate-500">info@mirtravel.es</p>
        </div>
      </div>
    </div>
  );
};

export const Events: React.FC = () => {
  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-serif text-slate-900">Spain Tourism Events & Festivals</h1>
        <p className="text-slate-500 text-sm">Discover upcoming cultural celebrations, wine tasting festivals, and sailing regattas.</p>
      </div>
      <div className="bg-white p-8 rounded-3xl border text-center text-slate-500">
        Demo events schedule loaded. Contact travel desk for custom event registration.
      </div>
    </div>
  );
};
