import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Plane, Compass, MapPin, Building2, Ticket,
  BookOpen, Calendar, ShoppingCart, Users, Image as ImageIcon,
  FileText, Settings, LogOut, ExternalLink, ShieldAlert
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Flight Desk', path: '/admin/flight-desk', icon: Plane, highlight: true },
    { name: 'Tours Management', path: '/admin/tours', icon: Compass },
    { name: 'Destinations', path: '/admin/destinations', icon: MapPin },
    { name: 'Airlines Flags', path: '/admin/airlines', icon: Ticket },
    { name: 'Hotels Directory', path: '/admin/hotels', icon: Building2 },
    { name: 'Rich Blog CMS', path: '/admin/blog', icon: BookOpen },
    { name: 'Events CMS', path: '/admin/events', icon: Calendar },
    { name: 'Bookings & Orders', path: '/admin/bookings', icon: ShoppingCart },
    { name: 'Customer Profiles', path: '/admin/customers', icon: Users },
    { name: 'Media Library', path: '/admin/media', icon: ImageIcon },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname !== '/admin') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-lg">
              M
            </div>
            <div>
              <span className="font-bold text-white text-base font-serif block leading-tight">MIR Travel Desk</span>
              <span className="text-[10px] text-amber-500 font-mono tracking-widest uppercase">Admin Portal</span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : item.highlight
                    ? 'text-amber-400 bg-amber-950/30 hover:bg-amber-950/60 border border-amber-800/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <item.icon className={`w-4 h-4 ${active ? 'text-slate-950' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="truncate">
              <span className="block text-xs font-semibold text-white truncate">{user?.full_name || 'Staff User'}</span>
              <span className="block text-[10px] text-amber-400 font-mono">{user?.role || 'STAFF'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400 hover:text-white py-2 bg-slate-900/60 hover:bg-slate-800 rounded-xl border border-slate-800/60 transition-colors"
          >
            View Customer Website <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
          </Link>
        </div>

      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
};
