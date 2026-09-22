import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatApiError } from '../../api/client';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@mirtravel.es');
  const [password, setPassword] = useState('AdminPass123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (err: unknown) {
      setError(formatApiError(err, 'Invalid login credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full space-y-6 shadow-2xl text-white">
        
        <div className="text-center space-y-3">
          <div className="bg-white/95 p-3 rounded-2xl max-w-[240px] mx-auto shadow-lg">
            <img
              src="/logo.png"
              alt="MIR Travel & Tourism"
              className="h-14 w-auto object-contain mx-auto"
            />
          </div>
          <p className="text-xs text-slate-400 font-medium">Authorized Staff & Admin Portal Authentication</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-semibold rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Staff Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? 'Authenticating...' : 'Sign Into Travel Desk'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] text-slate-500">
          Argon2 password hashing & role-based JWT authorization active.
        </div>

      </div>
    </div>
  );
};
