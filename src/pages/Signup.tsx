import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Mail, Lock, User, UserPlus, ChevronRight, Chrome } from 'lucide-react';

export const Signup: React.FC = () => {
  const { signup, loginWithGoogle, currentUser, addToast } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Auto redirect if logged in
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
    
    if (!name.trim()) {
      addToast('Please enter your full name.', 'error');
      return;
    }
    if (!email.trim()) {
      addToast('Please enter your email address.', 'error');
      return;
    }
    if (password.length < 6) {
      addToast('Password must be at least 6 characters long.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    setIsSigningUp(true);
    try {
      await signup(email, name);
    } catch {
      // Errors handled
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
    } catch {
      // Errors handled
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
          <h1 className="text-3xl font-black text-gray-900 dark:text-white font-sans tracking-tight">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Join us as a donor or a volunteer to support patients in crisis.</p>
        </div>

        {/* Card Form */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="signup-name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="signup-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-gray-900 dark:text-white"
                  placeholder="e.g. Ali Khan"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="signup-email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="signup-email"
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
              <label htmlFor="signup-password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="signup-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-gray-900 dark:text-white"
                  placeholder="At least 6 characters"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="signup-confirm" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="signup-confirm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-gray-900 dark:text-white"
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl shadow-md shadow-red-600/10 hover:shadow-lg transition-all"
              id="submit-signup-btn"
            >
              {isSigningUp ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" /> Sign Up Page
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-5 flex items-center justify-between">
            <span className="border-b border-gray-100 dark:border-slate-800 w-1/4"></span>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Or Continue With</span>
            <span className="border-b border-gray-100 dark:border-slate-800 w-1/4"></span>
          </div>

          {/* Google Sign-in */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-2xl font-bold text-gray-700 dark:text-gray-300 text-sm transition-all"
          >
            <Chrome className="h-5 w-5 text-red-500" /> Google Authentication
          </button>
        </div>

        {/* Switch back to login */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6 md:mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-red-600 dark:text-red-400 font-bold hover:underline" id="signup-to-login">
            Sign In Here <ChevronRight className="inline h-4 w-4" />
          </Link>
        </p>

      </div>
    </div>
  );
};
