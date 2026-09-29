import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatApiError, getApiBaseUrl, setApiBaseUrl } from '../../api/client';
import { Lock, Mail, ArrowRight, Server, Check } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@mirtravel.es');
  const [password, setPassword] = useState('AdminPass123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [customApiUrl, setCustomApiUrl] = useState(getApiBaseUrl());
  const [savedUrlSuccess, setSavedUrlSuccess] = useState(false);

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

  const handleSaveApiUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setApiBaseUrl(customApiUrl);
    setSavedUrlSuccess(true);
    setError('');
    setTimeout(() => setSavedUrlSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full space-y-6 shadow-2xl text-white">
        
        <div className="text-center space-y-3">
          <div className="max-w-[240px] mx-auto">
            <img
              src="/logo.png"
              alt="MIR Travel & Tourism"
              className="h-14 w-auto object-contain mx-auto"
            />
          </div>
          <p className="text-xs text-slate-400 font-medium">Authorized Staff & Admin Portal Authentication</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-semibold rounded-xl text-center space-y-1">
            <p>{error}</p>
            {error.includes('backend API was not found') && (
              <button
                type="button"
                onClick={() => setShowServerConfig(true)}
                className="text-amber-400 hover:underline text-[11px] font-bold block mx-auto mt-1"
              >
                Click here to configure backend API URL →
              </button>
            )}
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

        {/* Server Endpoint Settings Accordion */}
        <div className="border-t border-slate-800/80 pt-3">
          <button
            type="button"
            onClick={() => setShowServerConfig(!showServerConfig)}
            className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center justify-center gap-1.5 w-full transition-colors"
          >
            <Server className="w-3.5 h-3.5" />
            <span>API Server Endpoint: <code className="text-amber-400/80">{getApiBaseUrl()}</code></span>
          </button>

          {showServerConfig && (
            <form onSubmit={handleSaveApiUrl} className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
              <label className="block font-bold text-slate-400">Backend API Base URL</label>
              <input
                type="text"
                value={customApiUrl}
                onChange={(e) => setCustomApiUrl(e.target.value)}
                placeholder="https://mir-travel-backend.onrender.com/api/v1"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
              />
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500">e.g. Render backend URL + /api/v1</span>
                <button
                  type="submit"
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-xs font-semibold flex items-center gap-1"
                >
                  {savedUrlSuccess ? <><Check className="w-3 h-3 text-emerald-400" /> Saved</> : 'Update Endpoint'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
