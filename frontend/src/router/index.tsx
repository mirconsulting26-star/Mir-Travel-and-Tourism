import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { MobileNav } from '../components/layout/MobileNav';
import { AdminLayout } from '../components/layout/AdminLayout';
import { useAuth } from '../context/AuthContext';

// Public Pages
import { Home } from '../pages/Home';
import { Flights } from '../pages/Flights';
import { Hotels } from '../pages/Hotels';
import { Tours } from '../pages/Tours';
import { TourDetail } from '../pages/TourDetail';
import { Destinations, DestinationDetail } from '../pages/Destinations';
import { Blog, BlogDetail } from '../pages/Blog';
import { Contact, Events } from '../pages/Contact';
import { Checkout, BookingConfirmation } from '../pages/Checkout';

// Admin Pages
import { AdminLogin } from '../pages/admin/AdminLogin';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminFlightDesk } from '../pages/admin/AdminFlightDesk';
import { AdminBlog } from '../pages/admin/AdminBlog';
import { AdminAirlines } from '../pages/admin/AdminAirlines';
import {
  AdminTours, AdminDestinations, AdminHotels, AdminEvents,
  AdminBookings, AdminCustomers, AdminMedia, AdminAuditLogs, AdminSettings
} from '../pages/admin/AdminMiscPages';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col justify-between bg-slate-50">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
    <MobileNav />
  </div>
);

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Authenticating...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/flights" element={<PublicLayout><Flights /></PublicLayout>} />
      <Route path="/hotels" element={<PublicLayout><Hotels /></PublicLayout>} />
      <Route path="/tours" element={<PublicLayout><Tours /></PublicLayout>} />
      <Route path="/tours/:slug" element={<PublicLayout><TourDetail /></PublicLayout>} />
      <Route path="/destinations" element={<PublicLayout><Destinations /></PublicLayout>} />
      <Route path="/destinations/:slug" element={<PublicLayout><DestinationDetail /></PublicLayout>} />
      <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
      <Route path="/blog/:slug" element={<PublicLayout><BlogDetail /></PublicLayout>} />
      <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
      <Route path="/checkout/confirmation" element={<PublicLayout><BookingConfirmation /></PublicLayout>} />

      {/* Admin Auth Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Portal */}
      <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="flight-desk" element={<AdminFlightDesk />} />
        <Route path="tours" element={<AdminTours />} />
        <Route path="destinations" element={<AdminDestinations />} />
        <Route path="airlines" element={<AdminAirlines />} />
        <Route path="hotels" element={<AdminHotels />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="media" element={<AdminMedia />} />
        <Route path="audit-logs" element={<AdminAuditLogs />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
