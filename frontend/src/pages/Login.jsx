import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Key, Mail, Shield, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      showToast(`Welcome back, ${res.user.first_name || 'User'}!`, 'success');
      if (res.user.role === 'ADMIN' || res.user.role === 'SUPERADMIN') {
        navigate('/admin');
      } else {
        navigate('/client');
      }
    } else {
      showToast(res.error, 'error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-navy-dark px-4 font-sans">
      <div className="max-w-md w-full bg-white dark:bg-navy-accent border border-slate-200 dark:border-slate-800 rounded-lg p-8 shadow-2xl space-y-6">
        
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-gold/10 text-gold rounded-full">
            <Shield size={32} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-navy dark:text-white">Secure Portal Sign In</h2>
          <p className="text-sm text-slate-500">Enter credentials to access your IPR files and strategy trackers</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@sr4ipr.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-navy dark:text-white border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-gold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-gold-dark to-gold hover:from-gold hover:to-gold-light text-navy-dark font-bold rounded shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Credentials hints */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 text-center text-xs text-slate-500 space-y-1">
          <p>
            <strong>Default SuperAdmin:</strong> admin@sr4ipr.com / adminpassword123
          </p>
          <p>
            <strong>Default Client Portal:</strong> client@example.com / clientpassword123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
