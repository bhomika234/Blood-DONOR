import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Mail, Lock, LogIn, ChevronRight, Chrome, ShieldAlert, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const Login: React.FC = () => {
  const { login, loginWithGoogle, currentUser, addToast } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Auto redirect if already logged in
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      addToast('Please enter an email address.', 'error');
      return;
    }

    setIsLoggingIn(true);
    try {
      await login(email);
      // Success modal is shown from context, redirect handled in effect
    } catch {
      // Errors handled inside context
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
    } catch {
      // Errors handled inside context
    }
  };

  // Helper tester presets
  const handleQuickLogin = async (presetEmail: string) => {
    setIsLoggingIn(true);
    try {
      await login(presetEmail);
    } catch {
      // Errors handled
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-16 flex flex-col justify-center transition-colors duration-300">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6">
        
        {/* Logo and Greeting */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="p-2 bg-red-100 dark:bg-red-950/40 rounded-xl group-hover:scale-110 transition-transform">
              <Heart className="h-6 w-6 text-red-600 fill-current" />
            </div>
          </Link>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white font-sans tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Log into your account to manage donor registration status.</p>
        </div>

        {/* Card Form */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Address */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-gray-900 dark:text-white"
                  placeholder="e.g. ali@gmail.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="login-password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <span className="text-xs text-red-500 font-bold hover:underline cursor-pointer">Forgot Password?</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-gray-900 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl shadow-md shadow-red-600/10 hover:shadow-lg transition-all"
              id="submit-login-btn"
            >
              {isLoggingIn ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
              ) : (
                <>
                  <LogIn className="h-5 w-5" /> Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 flex items-center justify-between">
            <span className="border-b border-gray-100 dark:border-slate-800 w-1/4"></span>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Or Continue With</span>
            <span className="border-b border-gray-100 dark:border-slate-800 w-1/4"></span>
          </div>

          {/* OAuth Buttons */}
          <div className="mt-6 grid grid-cols-1 gap-3">
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-2xl font-bold text-gray-700 dark:text-gray-300 text-sm transition-all"
              id="google-signin-btn"
            >
              <Chrome className="h-5 w-5 text-red-500" /> Google Authentication
            </button>
          </div>

          {/* Quick Sandbox Logins Section */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800/80">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3.5 flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-amber-500" /> Tester Fast Presets (Click to Load)
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleQuickLogin('ali@gmail.com')}
                type="button"
                className="py-2.5 px-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl font-bold flex items-center justify-center gap-1 border border-red-100/40"
              >
                O+ Donor Account
              </button>
              <button
                onClick={() => handleQuickLogin('admin@blooddonor.org')}
                type="button"
                className="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-xl font-bold flex items-center justify-center gap-1 border border-amber-100/40"
                id="preset-admin-btn"
              >
                Admin Control
              </button>
            </div>
          </div>
        </div>

        {/* Bottom sign up switch */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6 md:mt-8">
          Don't have an account?{' '}
          <Link to="/signup" className="text-red-600 dark:text-red-400 font-bold hover:underline" id="login-to-signup">
            Create an Account <ChevronRight className="inline h-4 w-4" />
          </Link>
        </p>

      </div>
    </div>
  );
};
