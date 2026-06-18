import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  Search, 
  PlusCircle, 
  Award, 
  HelpCircle, 
  Mail, 
  Flame,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleDarkMode }) => {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      setShowProfileDropdown(false);
      setIsOpen(false);
      navigate('/');
    } catch (err) {
      console.error("Failed to log out", err);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const linkClass = (path: string) => {
    return `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
      isActive(path)
        ? 'text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 font-semibold'
        : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-slate-800'
    }`;
  };

  const mobileLinkClass = (path: string) => {
    return `block px-3 py-2.5 rounded-md text-base font-medium ${
      isActive(path)
        ? 'text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 font-bold'
        : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-slate-800'
    }`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group" id="nav-brand">
              <div className="p-2 bg-red-100 dark:bg-red-950 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <Heart className="h-6 w-6 text-red-600 dark:text-red-500 fill-current" />
              </div>
              <span className="font-sans text-xl font-bold bg-gradient-to-r from-red-600 to-red-500 dark:from-red-500 dark:to-red-400 bg-clip-text text-transparent">
                LifeFlow
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className={linkClass('/')}>Home</Link>
            <Link to="/search" className={linkClass('/search')}>
              <Search className="h-4 w-4" /> Find Donor
            </Link>
            <Link to="/register" className={linkClass('/register')}>
              <PlusCircle className="h-4 w-4" /> Become Donor
            </Link>
            <Link to="/requests" className={linkClass('/requests')}>
              <Flame className="h-4 w-4 text-orange-500" /> Emergency requests
            </Link>
            <Link to="/faq" className={linkClass('/faq')}>
              <HelpCircle className="h-4 w-4" /> FAQ
            </Link>
            <Link to="/contact" className={linkClass('/contact')}>
              <Mail className="h-4 w-4" /> Contact
            </Link>
          </div>

          {/* Right navbar elements */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Dark Mode toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              title="Toggle Dark Mode"
              id="desktop-darkmode-btn"
            >
              {isDarkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Profile Menu / Authentication */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 p-1.5 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all focus:outline-none"
                  id="profile-dropdown-btn"
                >
                  <img
                    src={currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.displayName}`}
                    alt="avatar"
                    className="h-8 w-8 rounded-full border border-red-100 dark:border-red-900 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left leading-none max-w-[120px] hidden lg:block">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{currentUser.displayName}</p>
                    <p className="text-[10px] text-gray-400 capitalize">{currentUser.role}</p>
                  </div>
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl shadow-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 py-1.5 text-sm ring-1 ring-black/5 animate-in fade-in slide-in-from-top-3 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700">
                      <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{currentUser.displayName}</p>
                      <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setShowProfileDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                    >
                      <LayoutDashboard className="h-4 w-4 text-red-500" /> Donor Dashboard
                    </Link>

                    {currentUser.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                      >
                        <Award className="h-4 w-4 text-amber-500" /> Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  id="nav-login-btn"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600 rounded-lg shadow-sm hover:shadow transition-all"
                  id="nav-signup-btn"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button & theme trigger */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              id="mobile-darkmode-btn"
            >
              {isDarkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-slate-800 focus:outline-none"
              id="mobile-menu-btn"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 px-2 pt-2 pb-4 space-y-1">
          <Link to="/" onClick={() => setIsOpen(false)} className={mobileLinkClass('/')}>Home</Link>
          <Link to="/search" onClick={() => setIsOpen(false)} className={mobileLinkClass('/search')}>Search Donors</Link>
          <Link to="/register" onClick={() => setIsOpen(false)} className={mobileLinkClass('/register')}>Become a Donor</Link>
          <Link to="/requests" onClick={() => setIsOpen(false)} className={mobileLinkClass('/requests')}>Emergency Requests</Link>
          <Link to="/faq" onClick={() => setIsOpen(false)} className={mobileLinkClass('/faq')}>FAQ</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className={mobileLinkClass('/contact')}>Contact Us</Link>

          <div className="pt-4 pb-2 border-t border-gray-100 dark:border-slate-800">
            {currentUser ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2">
                  <img
                    src={currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.displayName}`}
                    alt="avatar"
                    className="h-9 w-9 rounded-full border border-red-100 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{currentUser.displayName}</p>
                    <p className="text-xs text-gray-400">{currentUser.email}</p>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  <LayoutDashboard className="h-5 w-5 text-red-500" /> Donor Dashboard
                </Link>

                {currentUser.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    <Award className="h-5 w-5 text-amber-500" /> Admin Control
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-left text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut className="h-5 w-5" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="text-center py-2 rounded-lg text-sm font-medium bg-red-600 text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
