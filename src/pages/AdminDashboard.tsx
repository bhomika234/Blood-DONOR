import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/db';
import { Donor, EmergencyRequest } from '../types';
import { 
  Award, 
  Users, 
  MapPin, 
  Activity, 
  Heart, 
  Trash2, 
  Search, 
  Info, 
  PlusCircle, 
  ShieldAlert, 
  Check, 
  X,
  FileSpreadsheet
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { currentUser, addToast } = useAuth();
  
  // States
  const [donorsList, setDonorsList] = useState<Donor[]>([]);
  const [requestsList, setRequestsList] = useState<EmergencyRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Statistics
  const [totalCount, setTotalCount] = useState(0);
  const [availableCount, setAvailableCount] = useState(0);
  const [cityStats, setCityStats] = useState<Record<string, number>>({});
  const [groupStats, setGroupStats] = useState<Record<string, number>>({});

  const loadData = () => {
    const d = db.getDonors();
    const r = db.getRequests();
    
    setDonorsList(d);
    setRequestsList(r);
    
    setTotalCount(d.length);
    setAvailableCount(d.filter(donor => donor.available).length);

    // Group by cities
    const cities: Record<string, number> = {};
    d.forEach(donor => {
      const city = donor.city.trim();
      cities[city] = (cities[city] || 0) + 1;
    });
    setCityStats(cities);

    // Group by blood group
    const groups: Record<string, number> = {};
    d.forEach(donor => {
      groups[donor.bloodGroup] = (groups[donor.bloodGroup] || 0) + 1;
    });
    setGroupStats(groups);
  };

  useEffect(() => {
    loadData();
    // Real-time local events
    window.addEventListener('donors-updated', loadData);
    window.addEventListener('requests-updated', loadData);
    return () => {
      window.removeEventListener('donors-updated', loadData);
      window.removeEventListener('requests-updated', loadData);
    };
  }, []);

  // Filter donor list for the table
  const tableFilteredDonors = donorsList.filter(donor => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      donor.name.toLowerCase().includes(q) ||
      donor.city.toLowerCase().includes(q) ||
      donor.bloodGroup.toLowerCase().includes(q) ||
      donor.phone.includes(q)
    );
  });

  const handleDeleteDonorByAdmin = (id: string) => {
    if (confirm("Are you sure you want to delete this donor registration? This action is irreversible.")) {
      try {
        db.deleteDonor(id);
        addToast("Donor profile removed successfully by Administrator.", "info");
        loadData();
      } catch (err) {
        addToast("Failed to delete", "error");
      }
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col justify-center items-center p-6 text-center">
        <ShieldAlert className="h-12 w-12 text-red-500 mb-4 animate-pulse" />
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Admin Privileges Required</h2>
        <p className="text-gray-500 mt-2 max-w-sm">
          Please log in as an administrator to explore statistics and manage registrations. <br />
          <span className="font-bold text-red-600 dark:text-red-400">Hint: Use admin@blooddonor.org fast preset!</span>
        </p>
      </div>
    );
  }

  // Find max counts to calculate proportional graph bars
  const maxCityCount = Math.max(...(Object.values(cityStats) as number[]), 1);
  const maxGroupCount = Math.max(...(Object.values(groupStats) as number[]), 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="h-8 w-8 text-red-600" /> Admin Dashboard Panel
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
              System health logs, core database metrics, and donor register index operations.
            </p>
          </div>

          <div className="px-4 py-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4" /> Root Control Node
          </div>
        </div>

        {/* 1. Core Summary Metrics Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-2xl">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{totalCount}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Registers</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{availableCount}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Available Lives</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-2xl">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{Object.keys(cityStats).length}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cities Active</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-2xl">
              <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{requestsList.length}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Emergency Requests</p>
            </div>
          </div>
        </div>

        {/* 2. Visual Statistics Split grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* Blood group density chart */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-600 fill-red-500" /> Blood Group distribution
            </h3>

            <div className="space-y-4">
              {(Object.entries(groupStats) as [string, number][]).sort((a,b) => b[1] - a[1]).map(([group, count]) => {
                const percentage = Math.round((count / maxGroupCount) * 100);
                return (
                  <div key={group} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                      <span>{group}</span>
                      <span>{count} {count === 1 ? 'Donor' : 'Donors'}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-red-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              {Object.keys(groupStats).length === 0 && (
                <p className="text-xs text-gray-400">No donor statistics yet</p>
              )}
            </div>
          </div>

          {/* City wise Density statistics */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-600" /> City distribution density
            </h3>

            <div className="space-y-4">
              {(Object.entries(cityStats) as [string, number][]).sort((a,b) => b[1] - a[1]).map(([city, count]) => {
                const percentage = Math.round((count / maxCityCount) * 100);
                return (
                  <div key={city} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                      <span className="capitalize">{city}</span>
                      <span>{count} {count === 1 ? 'Donor' : 'Donors'}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              {Object.keys(cityStats).length === 0 && (
                <p className="text-xs text-gray-400">No city statistics yet</p>
              )}
            </div>
          </div>
        </div>

        {/* 3. Donor Index Table management */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden">
          
          {/* Table Toolbar controls */}
          <div className="p-6 md:p-8 bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-emerald-600" /> Recent donor Registrations Index
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage, search, explore, or remove volunteer database listings.</p>
            </div>

            {/* Inline search bar */}
            <div className="w-full md:w-72">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white"
                  placeholder="Search registers..."
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto text-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-wider">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Group</th>
                  <th className="py-4 px-6">City</th>
                  <th className="py-4 px-6">Contact Info</th>
                  <th className="py-4 px-6">Availability</th>
                  <th className="py-4 px-6">Date Registered</th>
                  <th className="py-4 px-6 text-right">Delete Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 dark:divide-slate-800 text-gray-700 dark:text-gray-200">
                {tableFilteredDonors.map((donor) => {
                  return (
                    <tr key={donor.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6 font-bold truncate max-w-[150px]">{donor.name}</td>
                      <td className="py-4 px-6">
                        <span className="font-extrabold text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-lg border border-red-100 dark:border-red-900/20">
                          {donor.bloodGroup}
                        </span>
                      </td>
                      <td className="py-4 px-6 capitalize font-semibold">{donor.city}</td>
                      <td className="py-4 px-6 text-xs font-mono">
                        <p>{donor.phone}</p>
                        <p className="text-[10px] text-gray-400 truncate max-w-[140px] mt-0.5">{donor.email}</p>
                      </td>
                      <td className="py-4 px-6">
                        {donor.available ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                            <Check className="h-3 w-3" /> Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-50 dark:text-gray-400 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                            <X className="h-3 w-3" /> busy
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-xs text-gray-400">
                        {new Date(donor.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDeleteDonorByAdmin(donor.id)}
                          className="p-1.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 rounded-lg transition-colors inline-block"
                          title="Remove Registration"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {tableFilteredDonors.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400 text-xs font-medium">
                      No matching registered donors found in list.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
