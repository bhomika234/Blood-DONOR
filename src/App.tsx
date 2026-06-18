import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { RegisterDonor } from './pages/RegisterDonor';
import { SearchDonor } from './pages/SearchDonor';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { EmergencyRequests } from './pages/EmergencyRequests';
import { ContactUs } from './pages/ContactUs';
import { FAQPage } from './pages/FAQ';

// Icons
import { Heart, X, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ToastManager: React.FC = () => {
  const { toasts, removeToast } = useAuth();

  return (
    <div className="fixed bottom-5 right-5 z-55 max-w-sm w-full space-y-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let bgClass = 'bg-slate-900 text-white';
          let icon = <Info className="h-5 w-5 text-blue-400" />;

          if (toast.type === 'success') {
            bgClass = 'bg-white dark:bg-slate-900 border-l-4 border-emerald-500 text-gray-800 dark:text-gray-150 shadow-xl';
            icon = <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />;
          } else if (toast.type === 'error') {
            bgClass = 'bg-white dark:bg-slate-900 border-l-4 border-red-500 text-gray-800 dark:text-gray-150 shadow-xl';
            icon = <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />;
          } else if (toast.type === 'info') {
            bgClass = 'bg-white dark:bg-slate-900 border-l-4 border-blue-500 text-gray-800 dark:text-gray-150 shadow-xl';
            icon = <Info className="h-5 w-5 text-blue-500 shrink-0" />;
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              className={`p-4 rounded-xl border border-gray-150/80 dark:border-slate-800/85 flex items-start gap-3 pointer-events-auto shadow-md ${bgClass}`}
            >
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1 text-xs sm:text-sm font-semibold">{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-0.5"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

// Main App layout wrapper with dark mode state
const AppLayout: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Read starting preference
    const saved = localStorage.getItem('life_flow_dark_theme');
    return saved === 'true';
  });

  useEffect(() => {
    // Reflect on html element
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('life_flow_dark_theme', 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('life_flow_dark_theme', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 font-sans transition-colors duration-300">
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        
        {/* Main core content area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterDonor />} />
            <Route path="/search" element={<SearchDonor />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/requests" element={<EmergencyRequests />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactUs />} />
          </Routes>
        </main>
        
        <Footer />
        <ToastManager />
      </div>
    </Router>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}
