import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plane, Compass, ShoppingCart, Users, Ticket, BookOpen, TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react';
import { apiClient } from '../../api/client';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    activeQuotes: 12,
    totalBookings: 8,
    activeTours: 4,
    preferredAirlines: 2,
  });

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold font-serif text-white">Travel Desk Operational Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Manage flight recommendations, tour packages, bookings, and CMS publishing.</p>
        </div>
        <Link
          to="/admin/flight-desk"
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2"
        >
          <Plane className="w-4 h-4" /> Open Flight Desk Engine
        </Link>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase text-slate-400 font-bold">Active Flight Quotes</span>
            <Plane className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.activeQuotes}</div>
          <span className="text-[11px] text-amber-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> Explainable ranking active
          </span>
        </div>

        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase text-slate-400 font-bold">Total Package Bookings</span>
            <ShoppingCart className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalBookings}</div>
          <span className="text-[11px] text-emerald-400 font-semibold">Verified webhook status</span>
        </div>

        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase text-slate-400 font-bold">Published Tours</span>
            <Compass className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.activeTours}</div>
          <span className="text-[11px] text-slate-400 font-semibold">Capacity & departure limits</span>
        </div>

        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase text-slate-400 font-bold">Preferred Airlines</span>
            <Ticket className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.preferredAirlines}</div>
          <span className="text-[11px] text-amber-400 font-semibold">Iberia & Vueling bonus</span>
        </div>

      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 space-y-6">
        <h3 className="text-xl font-bold font-serif text-white">Operational Shortcuts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/flight-desk" className="p-6 bg-slate-900 hover:bg-slate-800/80 rounded-2xl border border-slate-800 space-y-2 transition-all block group">
            <h4 className="font-bold text-amber-400 text-base flex items-center justify-between">
              Flight Desk Client Request <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-slate-400">Input client criteria, search live offers, rank explainable scores, and create quote snapshots.</p>
          </Link>

          <Link to="/admin/blog" className="p-6 bg-slate-900 hover:bg-slate-800/80 rounded-2xl border border-slate-800 space-y-2 transition-all block group">
            <h4 className="font-bold text-amber-400 text-base flex items-center justify-between">
              Rich Blog Block Editor <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-slate-400">Compose articles with 13 block types, multi-image galleries, and scheduled publication.</p>
          </Link>

          <Link to="/admin/airlines" className="p-6 bg-slate-900 hover:bg-slate-800/80 rounded-2xl border border-slate-800 space-y-2 transition-all block group">
            <h4 className="font-bold text-amber-400 text-base flex items-center justify-between">
              Airline Focus Controls <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-slate-400">Toggle preferred or featured airline flags without redeploying backend code.</p>
          </Link>
        </div>
      </div>

    </div>
  );
};
