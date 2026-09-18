import React, { useState, useEffect } from 'react';
import { Compass, Plus, Building2, MapPin, Calendar, ShoppingCart, Users, Image as ImageIcon, Settings as SettingsIcon, FileText } from 'lucide-react';
import { apiClient } from '../../api/client';

export const AdminTours: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold font-serif text-white">Tours & Departures Management</h1>
    <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 text-slate-400 text-sm">
      Manage escorted tour pricing, departure dates, seat capacity, and detailed itineraries.
    </div>
  </div>
);

export const AdminDestinations: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold font-serif text-white">Destinations Directory</h1>
    <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 text-slate-400 text-sm">
      Manage Spain coastal regions, hero imagery, practical info, and linked tours.
    </div>
  </div>
);

export const AdminHotels: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold font-serif text-white">Hotel Inventory & Flags</h1>
    <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 text-slate-400 text-sm">
      Set preferred hotel partners, star ratings, amenities, and cancellation terms.
    </div>
  </div>
);

export const AdminEvents: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold font-serif text-white">Tourism Events CMS</h1>
    <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 text-slate-400 text-sm">
      Publish festival guides, cultural events, and regattas.
    </div>
  </div>
);

export const AdminBookings: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold font-serif text-white">Bookings & Order Records</h1>
    <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 text-slate-400 text-sm">
      View verified webhook payments, order statuses, and customer payment methods.
    </div>
  </div>
);

export const AdminCustomers: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold font-serif text-white">Customer Profiles</h1>
    <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 text-slate-400 text-sm">
      Manage client contacts, passport numbers, and flight preferences.
    </div>
  </div>
);

export const AdminMedia: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold font-serif text-white">Cloudinary Media Library</h1>
    <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 text-slate-400 text-sm">
      Upload runtime CMS images, manage alt texts, and copy asset URLs.
    </div>
  </div>
);

export const AdminAuditLogs: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold font-serif text-white">System Audit Trail</h1>
    <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 text-slate-400 text-sm">
      Track admin actions, quote generation, and CMS publishing logs.
    </div>
  </div>
);

export const AdminSettings: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold font-serif text-white">Site Settings & Providers</h1>
    <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 text-slate-400 text-sm">
      Manage provider keys (Amadeus, Stripe, PayPal, Cloudinary) and agency contact info.
    </div>
  </div>
);
