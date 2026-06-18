import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/db';
import { BloodGroupCard } from '../components/BloodGroupCard';
import { 
  Heart, 
  Search, 
  PlusCircle, 
  Users, 
  MapPin, 
  ShieldAlert, 
  ChevronRight, 
  Award, 
  Activity, 
  Clock, 
  Flame, 
  ArrowUpRight,
  CheckCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [totalDonors, setTotalDonors] = useState(0);
  const [activeDonors, setActiveDonors] = useState(0);
  const [totalUrgent, setTotalUrgent] = useState(0);
  const [cityCount, setCityCount] = useState(0);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);

  // Statistics per blood group
  const bloodCompatibility = {
    'O+': 'Can give to O+, A+, B+, AB+',
    'O-': 'Universal Donor (Give to All)',
    'A+': 'Can give to A+, AB+',
    'A-': 'Can give to A-, A+, AB-, AB+',
    'B+': 'Can give to B+, AB+',
    'B-': 'Can give to B-, B+, AB-, AB+',
    'AB+': 'Universal Recipient (All)',
    'AB-': 'Can give to AB-, AB+'
  };

  const [groupCounts, setGroupCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadStats = () => {
      const donors = db.getDonors();
      const requests = db.getRequests();
      
      setTotalDonors(donors.length);
      setActiveDonors(donors.filter(d => d.available).length);
      setTotalUrgent(requests.filter(r => r.status === 'Urgent').length);
      setRecentRequests(requests.slice(0, 3));

      // Unique cities
      const cities = new Set(donors.map(d => d.city.toLowerCase().trim()));
      setCityCount(cities.size || 1);

      // Group counts
      const counts: Record<string, number> = {};
      Object.keys(bloodCompatibility).forEach(g => {
        counts[g] = donors.filter(d => d.bloodGroup === g).length;
      });
      setGroupCounts(counts);
    };

    loadStats();
    
    // Add real-time event listeners
    window.addEventListener('donors-updated', loadStats);
    window.addEventListener('requests-updated', loadStats);
    
    return () => {
      window.removeEventListener('donors-updated', loadStats);
      window.removeEventListener('requests-updated', loadStats);
    };
  }, []);

  const handleGroupSelect = (group: string) => {
    navigate(`/search?group=${encodeURIComponent(group)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-50 via-white to-gray-50 dark:from-red-950/20 dark:via-slate-900 dark:to-slate-950 py-20 lg:py-28">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-red-400/10 dark:bg-red-500/5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-[10%] right-[15%] w-96 h-96 bg-red-300/10 dark:bg-red-500/5 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-red-900/30 text-xs font-semibold text-red-600 dark:text-red-400 mb-6"
          >
            <Activity className="h-3.5 w-3.5 animate-pulse" /> Urgent Emergency Help Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-gray-900 dark:text-white leading-tight max-w-4xl mx-auto"
          >
            Need Blood Urgently? <br />
            <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              Find Blood Donors Near You
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-sans font-medium"
          >
            LifeFlow connects generous volunteer donors with families dealing with medical emergencies. Join us to save lives, or quickly find match in seconds.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/search"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-600/15 hover:shadow-xl hover:scale-102 transition-all text-base"
              id="hero-find-donor-btn"
            >
              <Search className="h-5 w-5" /> Find Donor
            </Link>
            
            <Link
              to={currentUser ? "/dashboard" : "/register"}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-900 dark:text-white font-bold rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:scale-102 transition-all text-base"
              id="hero-become-donor-btn"
            >
              <PlusCircle className="h-5 w-5 text-red-600" /> Become a Donor
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Overlapping Statistics Ticker */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-red-600 dark:text-red-500">{totalDonors}</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center gap-1">
              <Users className="h-4 w-4" /> Total Registered Donors
            </p>
          </div>
          <div className="border-l border-gray-100 dark:border-slate-800">
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-500">{activeDonors}</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center gap-1">
              <Activity className="h-4 w-4" /> Available Live Donors
            </p>
          </div>
          <div className="border-l border-gray-100 dark:border-slate-800">
            <p className="text-3xl sm:text-4xl font-extrabold text-amber-600 dark:text-amber-500">{totalUrgent}</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center gap-1">
              <Flame className="h-4 w-4 text-orange-500" /> Open Emergency Requests
            </p>
          </div>
          <div className="border-l border-gray-100 dark:border-slate-800">
            <p className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-500">{cityCount}</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center gap-1">
              <MapPin className="h-4 w-4" /> Covered Cities
            </p>
          </div>
        </div>
      </section>

      {/* 3. Open Emergency Requests Feed */}
      {recentRequests.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <Flame className="h-6 w-6 text-red-600 animate-pulse fill-red-500" /> Active Emergency Requests
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Help needed instantly in hospitals nearby.</p>
            </div>
            <Link to="/requests" className="text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-1 hover:underline">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentRequests.map((req) => (
              <div 
                key={req.id} 
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-red-100 dark:border-red-950/20 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-extrabold text-xl text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-3 py-1 rounded-xl">
                      {req.bloodGroup}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {req.unitsNeeded} Units Required
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 dark:text-white truncate">Patient: {req.patientName}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Requested by {req.requestedBy}</p>

                  <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="truncate font-semibold">{req.hospitalName}, {req.city}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                      <span>Required before: <span className="font-semibold text-red-600 dark:text-red-400">{req.requiredBefore}</span></span>
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href={`tel:${req.phone}`}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-colors"
                  >
                    Contact Attendant
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Blood Group Bento Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white font-sans tracking-tight">
            Registered Donors by Blood Group
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Select a blood group to find corresponding healthy, available donors in your area immediately.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Object.entries(bloodCompatibility).map(([group, compatibility]) => (
            <BloodGroupCard
              key={group}
              group={group}
              count={groupCounts[group] || 0}
              compatibility={compatibility}
              onClick={() => handleGroupSelect(group)}
            />
          ))}
        </div>
      </section>

      {/* 5. About / Educational Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100 dark:border-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest flex items-center gap-1.5">
              <Award className="h-4 w-4" /> Why Donate Blood?
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
              One Single Donation Can Save Up To Three Lives.
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
              Blood is the most precious gift that anyone can give to another person—the gift of life. A decision to donate your blood can save a life, or even several if your blood is separated into its components—red cells, platelets and plasma.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
                <p className="text-red-600 dark:text-red-500 font-extrabold text-lg flex items-center gap-1.5 mb-1">
                  <Activity className="h-5 w-5" /> Regulate Iron
                </p>
                <p className="text-xs text-gray-500 leading-normal">Reduce stored iron levels, which keeps blood vessels highly compliant and healthy.</p>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
                <p className="text-red-600 dark:text-red-500 font-extrabold text-lg flex items-center gap-1.5 mb-1">
                  <Heart className="h-5 w-5" /> Heart Health
                </p>
                <p className="text-xs text-gray-500 leading-normal">Reduces risk of cardiovascular blockages and controls pressure parameters safely.</p>
              </div>
            </div>
          </div>

          {/* Graphical Promo Card detailing donation status */}
          <div className="relative p-8 bg-red-600 dark:bg-red-850 rounded-3xl text-white overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full filter blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-700/30 rounded-full filter blur-2xl"></div>

            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl font-bold">Eligibility Check list</h3>
              <p className="text-red-100 text-sm">Verify these simple check points before arriving at a donation facility near you:</p>

              <ul className="space-y-3.5 text-sm">
                <li className="flex items-center gap-3">
                  <div className="p-1 bg-red-700 dark:bg-red-900 rounded-lg">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span>Age should be between 17 and 65 years.</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-1 bg-red-700 dark:bg-red-900 rounded-lg">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span>Weight must be at least 50 kg (110 lbs).</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-1 bg-red-700 dark:bg-red-900 rounded-lg">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span>Hemoglobin should be at least 12.5 g/dL.</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-1 bg-red-700 dark:bg-red-900 rounded-lg">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span>Haven't donated whole blood in the last 56 days.</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 font-bold rounded-xl text-sm transition-all hover:shadow hover:scale-102"
                >
                  Become a Donor Now <ArrowUpRight className="h-4 w-4 text-red-600" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
