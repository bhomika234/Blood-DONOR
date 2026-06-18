import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../lib/db';
import { Donor } from '../types';
import { DonorCard } from '../components/DonorCard';
import { Search, MapPin, Filter, X, ArrowLeft, ArrowRight, UserCheck, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export const SearchDonor: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialGroup = searchParams.get('group') || '';
  const initialCity = searchParams.get('city') || '';

  // Options
  const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const POPULAR_CITIES = ['Karachi', 'New York', 'London', 'Delhi', 'Miami', 'Toronto', 'Tokyo', 'Sydney'];

  // Search states
  const [selectedGroup, setSelectedGroup] = useState(initialGroup);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Pagination states
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sync params from URL
  useEffect(() => {
    const group = searchParams.get('group');
    const city = searchParams.get('city');
    if (group !== null) {
      setSelectedGroup(group);
    }
    if (city !== null) {
      setSelectedCity(city);
    }
  }, [searchParams]);

  // Load and filter donors
  useEffect(() => {
    const list = db.getDonors();
    
    const result = list.filter(donor => {
      // Filter by Blood Group
      if (selectedGroup && donor.bloodGroup !== selectedGroup) return false;
      
      // Filter by City
      if (selectedCity && donor.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
      
      // Filter by Availability
      if (onlyAvailable && !donor.available) return false;

      // Filter by Text Search (Name)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = donor.name.toLowerCase().includes(query);
        const matchesPhone = donor.phone.includes(query);
        const matchesEmail = donor.email.toLowerCase().includes(query);
        if (!matchesName && !matchesPhone && !matchesEmail) return false;
      }

      return true;
    });

    setFilteredDonors(result);
    setCurrentPage(1); // Reset page on filter change
  }, [selectedGroup, selectedCity, searchTerm, onlyAvailable]);

  // Handle resets
  const handleResetFilters = () => {
    setSelectedGroup('');
    setSelectedCity('');
    setSearchTerm('');
    setOnlyAvailable(false);
    setSearchParams({});
  };

  // Pagination index computations
  const totalItems = filteredDonors.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDonors = filteredDonors.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page title */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center justify-center gap-1.5">
            <Search className="h-7 w-7 text-red-600" /> Find Available Blood Donors
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Search real-time registered volunteers by blood group and city. Call them immediately to acquire life-saving assistance.
          </p>
        </div>

        {/* Filter Toolbar Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl p-6 sm:p-8 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            
            {/* 1. Name query */}
            <div className="md:col-span-1">
              <label htmlFor="search-donor" className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Search Donor Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search-donor"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-sm text-gray-900 dark:text-white"
                  placeholder="e.g. Ali, John, Sarah..."
                />
              </div>
            </div>

            {/* 2. Blood Group select */}
            <div>
              <label htmlFor="search-blood-group" className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Select Blood Group
              </label>
              <select
                id="search-blood-group"
                value={selectedGroup}
                onChange={(e) => {
                  setSelectedGroup(e.target.value);
                  setSearchParams({ group: e.target.value, city: selectedCity });
                }}
                className="w-full px-3 py-2.5 rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-sm text-gray-900 dark:text-white"
              >
                <option value="">All Groups</option>
                {BLOOD_GROUPS.map(gb => (
                  <option key={gb} value={gb}>{gb}</option>
                ))}
              </select>
            </div>

            {/* 3. City select */}
            <div>
              <label htmlFor="search-city" className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Select City
              </label>
              <select
                id="search-city"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSearchParams({ group: selectedGroup, city: e.target.value });
                }}
                className="w-full px-3 py-2.5 rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-sm text-gray-900 dark:text-white"
              >
                <option value="">All Cities</option>
                {POPULAR_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* 4. Filter Button or reset */}
            <div className="flex gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-3 px-4 font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                title="Clear Filters"
              >
                <X className="h-4 w-4" /> Reset Filters
              </button>
            </div>
          </div>

          {/* Secondary Sub-filters (Available toggle, quick blood metrics) */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800/60 flex flex-wrap gap-4 items-center justify-between">
            {/* Availability Checkbox toggle */}
            <label className="relative inline-flex items-center cursor-pointer p-1 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:bg-gray-100/50 max-w-max">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:left-[6px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
              <span className="ml-2.5 text-xs font-bold text-gray-800 dark:text-gray-200">
                Show Only Available Donors
              </span>
            </label>

            {/* Quick group filter pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mr-1">Quick Group:</span>
              {BLOOD_GROUPS.map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setSelectedGroup(g === selectedGroup ? '' : g);
                    setSearchParams(g === selectedGroup ? { city: selectedCity } : { group: g, city: selectedCity });
                  }}
                  className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${
                    selectedGroup === g
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search status header */}
        <div className="mb-6 flex justify-between items-center text-sm font-medium text-gray-500 dark:text-gray-400">
          <p>
            Showing{' '}
            <span className="font-extrabold text-gray-800 dark:text-gray-200">
              {totalItems === 0 ? 0 : startIndex + 1} - {Math.min(endIndex, totalItems)}
            </span>{' '}
            of <span className="font-extrabold text-gray-800 dark:text-gray-200">{totalItems}</span> volunteer donors found
          </p>

          <div className="hidden sm:flex gap-1">
            {selectedGroup && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded-full border border-red-100 dark:border-red-950/40">
                <Heart className="h-3 w-3 fill-red-500" /> {selectedGroup} Group
              </span>
            )}
            {selectedCity && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-950/40">
                <MapPin className="h-3 w-3" /> {selectedCity}
              </span>
            )}
          </div>
        </div>

        {/* Main Grid display */}
        {currentDonors.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 text-center py-16 px-6 shadow-sm">
            <div className="p-4 bg-red-50 dark:bg-red-950/20 max-w-max mx-auto rounded-full mb-4 text-red-500">
              <Search className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Donors Found Match</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              We couldn't find any donors corresponding to your specified search query. Try broadening your filter parameters or selecting 'All Groups/Cities'.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 px-5 py-2.5 text-sm font-semibold bg-red-600 text-white rounded-xl hover:bg-red-500 transition-colors"
            >
              Reset Search Parameters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDonors.map((donor) => (
              <DonorCard key={donor.id} donor={donor} />
            ))}
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-3">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all focus:outline-none"
              title="Previous Page"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all focus:outline-none"
              title="Next Page"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
