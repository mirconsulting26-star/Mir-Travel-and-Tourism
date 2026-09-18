import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, ShieldCheck, CreditCard, Lock, CheckCircle } from 'lucide-react';
import { apiClient } from '../api/client';

export const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const itemState = location.state || {
    item_type: 'TOUR',
    item_id: 'tour_demo_1',
    title: 'Costa Blanca Coastal Sun & Heritage Tour [DEMO]',
    unit_price: 890.0,
    quantity: 1,
  };

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'STRIPE' | 'PAYPAL'>('STRIPE');
  const [loading, setLoading] = useState(false);

  const totalAmount = itemState.unit_price * itemState.quantity;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post('/checkout/create-session', {
        items: [
          {
            item_type: itemState.item_type,
            item_id: itemState.item_id,
            title: itemState.title,
            quantity: itemState.quantity,
            unit_price: itemState.unit_price,
            details: itemState.details || {}
          }
        ],
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        payment_method: paymentMethod
      });

      const { order_id, payment_session_id } = res.data;
      // Simulate successful payment redirect
      navigate(`/checkout/confirmation?order_id=${order_id}&session_id=${payment_session_id}`);
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-amber-500" /> Secure Package Checkout
        </h1>
        <p className="text-slate-500 text-sm">Server-side price authority and SSL encrypted checkout.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="md:col-span-1 bg-slate-900 text-white p-6 rounded-3xl space-y-4 h-fit border border-slate-800 shadow-xl">
          <h3 className="font-bold text-amber-400 font-serif text-lg">Order Summary</h3>
          <div className="border-t border-slate-800 pt-3 space-y-2">
            <h4 className="font-bold text-sm text-white">{itemState.title}</h4>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Quantity ({itemState.quantity}x)</span>
              <span>€{itemState.unit_price}</span>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-4 flex justify-between text-base font-extrabold text-white">
            <span>Total Payable</span>
            <span className="text-amber-400">€{totalAmount}</span>
          </div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-2">
            <Lock className="w-3.5 h-3.5 text-amber-400" /> Encrypted Webhook Verification
          </div>
        </div>

        {/* Customer Info & Payment Form */}
        <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            <h3 className="font-bold text-slate-900 text-lg font-serif">Traveller Details</h3>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Maria Garcia"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="maria@example.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+34 600 000 000"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                  required
                />
              </div>
            </div>

            <h3 className="font-bold text-slate-900 text-lg font-serif pt-4">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('STRIPE')}
                className={`p-4 rounded-2xl border text-left font-bold text-xs flex items-center justify-between ${
                  paymentMethod === 'STRIPE' ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <span>Stripe Hosted Checkout</span>
                <CreditCard className="w-4 h-4 text-amber-500" />
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('PAYPAL')}
                className={`p-4 rounded-2xl border text-left font-bold text-xs flex items-center justify-between ${
                  paymentMethod === 'PAYPAL' ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <span>PayPal Checkout</span>
                <CreditCard className="w-4 h-4 text-amber-500" />
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-base rounded-2xl shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? 'Processing Order...' : `Pay €${totalAmount} Now`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const BookingConfirmation: React.FC = () => {
  const query = new URLSearchParams(window.location.search);
  const orderId = query.get('order_id') || 'MIR-ORD-DEMO123';

  return (
    <div className="pt-32 pb-20 max-w-2xl mx-auto px-4 text-center space-y-6">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
        <CheckCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-serif text-slate-900">Booking Order Confirmed!</h1>
        <p className="text-slate-500 text-sm">Thank you for booking with MIR Travel & Tourism.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
        <span className="text-xs uppercase text-slate-400 font-bold">Booking Reference</span>
        <div className="text-2xl font-mono font-bold text-amber-600">{orderId}</div>
        <p className="text-xs text-slate-500">A confirmation receipt and itinerary details have been dispatched to your email address.</p>
      </div>
    </div>
  );
};
