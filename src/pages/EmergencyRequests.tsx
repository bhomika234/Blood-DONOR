import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/db';
import { EmergencyRequest } from '../types';
import { Flame, Clock, MapPin, PlusCircle, CheckCircle, Smartphone, User, Landmark, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const EmergencyRequests: React.FC = () => {
  const { currentUser, addToast } = useAuth();

  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'O+',
    city: '',
    hospitalName: '',
    phone: '',
    unitsNeeded: 1,
    requiredBefore: '',
    requestedBy: currentUser?.displayName || 'Anonymous Patient Family'
  });

  const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const POPULAR_CITIES = ['Karachi', 'New York', 'London', 'Delhi', 'Miami', 'Toronto', 'Tokyo', 'Sydney'];

  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadRequests = () => {
    setRequests(db.getRequests());
  };

  useEffect(() => {
    loadRequests();
    // Register local listeners for instant update emulation
    window.addEventListener('requests-updated', loadRequests);
    return () => {
      window.removeEventListener('requests-updated', loadRequests);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error
    if (errors[name]) {
      setErrors(prev => {
        const u = { ...prev };
        delete u[name];
        return u;
      });
    }
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.patientName.trim()) errs.patientName = 'Patient Name is required';
    if (!formData.city.trim()) errs.city = 'Please specify city field';
    if (!formData.hospitalName.trim()) errs.hospitalName = 'Hospital Name is required';
    if (!formData.phone.trim()) {
      errs.phone = 'Contact number is required';
    } else if (formData.phone.replace(/[^0-9]/g, '').length < 6) {
      errs.phone = 'Please enter a valid mobile phone';
    }
    if (formData.unitsNeeded < 1) errs.unitsNeeded = 'Must require at least 1 unit';
    if (!formData.requiredBefore) errs.requiredBefore = 'Required expiry limit date is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('Please input correct details in the emergency form.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 900));
      
      const requestedByFinal = currentUser?.displayName || formData.requestedBy.trim() || 'Anonymous Family Member';

      db.addRequest({
        patientName: formData.patientName.trim(),
        bloodGroup: formData.bloodGroup,
        city: formData.city,
        hospitalName: formData.hospitalName.trim(),
        phone: formData.phone.trim(),
        unitsNeeded: Number(formData.unitsNeeded),
        requiredBefore: formData.requiredBefore,
        requestedBy: requestedByFinal
      });

      addToast('Emergency Blood Request was submitted and broadcast successfully!', 'success');
      
      // Reset form save for contact details
      setFormData({
        patientName: '',
        bloodGroup: 'O+',
        city: '',
        hospitalName: '',
        phone: '',
        unitsNeeded: 1,
        requiredBefore: '',
        requestedBy: currentUser?.displayName || ''
      });
      loadRequests();
    } catch {
      addToast('Failed to submit request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkFulfilled = (id: string) => {
    try {
      db.updateRequestStatus(id, 'Fulfilled');
      addToast('This request was marked as Fulfilled. Thank you for your support!', 'success');
      loadRequests();
    } catch {
      addToast('Failed to update request status', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center justify-center gap-2">
            <Flame className="h-8 w-8 text-red-600 animate-pulse fill-red-500" /> Emergency Blood Requests
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Browse active blood requests from local hospitals, or submit an urgent case immediately.
          </p>
        </div>

        {/* Dashboard layout splits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Active lists */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-slate-800">
              Open emergency cases
            </h2>

            <div className="space-y-4">
              {requests.map((req) => (
                <div 
                  key={req.id} 
                  className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm transition-all relative overflow-hidden ${
                    req.status === 'Fulfilled' 
                      ? 'border-emerald-100 dark:border-emerald-900/30' 
                      : 'border-red-150 dark:border-red-950/20'
                  }`}
                >
                  {/* Status label top-right */}
                  <div className="absolute top-4 right-4 flex items-center gap-1">
                    {req.status === 'Fulfilled' ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" /> Fulfilled
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/30 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                        <Flame className="h-3.5 w-3.5 fill-current" /> Urgent Need
                      </span>
                    )}
                  </div>

                  <div className="flex gap-4">
                    {/* Circle badge display */}
                    <div className="p-3 bg-red-50 dark:bg-slate-800 border border-red-100 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center min-w-[64px] h-[64px] shadow-sm">
                      <span className="text-2xl font-black text-red-600 dark:text-red-400 leading-none">{req.bloodGroup}</span>
                      <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 mt-1 uppercase">Group</span>
                    </div>

                    <div className="space-y-1 pr-24 flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white max-w-xs truncate">Patient: {req.patientName}</h3>
                      <p className="text-[11px] text-gray-400">Requested by <span className="font-semibold text-gray-600 dark:text-gray-300">{req.requestedBy}</span></p>

                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-650 dark:text-gray-300">
                        <p className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{req.hospitalName}, <span className="font-semibold capitalize">{req.city}</span></span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span>Need before: <span className="font-bold text-red-600 dark:text-red-400">{req.requiredBefore}</span></span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-800/80 flex flex-wrap gap-2 justify-between items-center text-xs">
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Units Demanded:{' '}
                      <span className="font-extrabold text-red-600 dark:text-red-400">{req.unitsNeeded} Bottles</span>
                    </p>

                    <div className="flex gap-2">
                      <a
                        href={`tel:${req.phone}`}
                        className="py-1.5 px-3 bg-red-600 hover:bg-red-500 font-bold text-white rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Smartphone className="h-3.5 w-3.5" /> Call Attendant
                      </a>

                      {req.status === 'Urgent' && (
                        <button
                          onClick={() => handleMarkFulfilled(req.id)}
                          className="py-1.5 px-3 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 rounded-lg transition-all"
                        >
                          Mark Fulfilled
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {requests.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 text-gray-400">
                  No active emergency requests reported. Directory is fully completed!
                </div>
              )}
            </div>
          </div>

          {/* Form input section right */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-orange-500 p-6 text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <PlusCircle className="h-5 w-5" /> Submit Emergency Request
              </h2>
              <p className="text-red-100 text-xs mt-1">Broadcast your blood emergency to volunteers immediately.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Patient Name */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Patient Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-950 dark:text-white"
                    placeholder="e.g. Robert Miller"
                  />
                </div>
                {errors.patientName && <p className="text-xs text-red-500 font-medium mt-1">{errors.patientName}</p>}
              </div>

              {/* Grid 2x */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Blood Group */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full p-2 text-sm rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-950 dark:text-white"
                  >
                    {BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-2 text-sm rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-950 dark:text-white"
                  >
                    <option value="">-- City --</option>
                    {POPULAR_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                    <option value="Karachi">Karachi</option>
                    <option value="New York">New York</option>
                    <option value="London">London</option>
                  </select>
                  {errors.city && <p className="text-xs text-red-500 font-medium mt-1">{errors.city}</p>}
                </div>
              </div>

              {/* Hospital Name */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Hospital Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Landmark className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-950 dark:text-white"
                    placeholder="e.g. Mount Sinai General Hospital"
                  />
                </div>
                {errors.hospitalName && <p className="text-xs text-red-500 font-medium mt-1">{errors.hospitalName}</p>}
              </div>

              {/* Grid 2 */}
              <div className="grid grid-cols-2 gap-4">
                {/* Units Needed */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Units (Bottles) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="unitsNeeded"
                    min="1"
                    max="10"
                    value={formData.unitsNeeded}
                    onChange={handleChange}
                    className="w-full p-2 text-sm rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-950 dark:text-white"
                  />
                </div>

                {/* Expiry / limit Date */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Required Expiry <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="requiredBefore"
                    value={formData.requiredBefore}
                    onChange={handleChange}
                    className="w-full p-2 text-sm rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-950 dark:text-white"
                  />
                  {errors.requiredBefore && <p className="text-xs text-red-500 font-medium mt-1">{errors.requiredBefore}</p>}
                </div>
              </div>

              {/* Mobile Phone contact */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Attendant Contact Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Smartphone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-950 dark:text-white"
                    placeholder="e.g. +1 555-901-2345"
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500 font-medium mt-1">{errors.phone}</p>}
              </div>

              {/* Guest Request By details */}
              {!currentUser && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Your Name (Requested By)
                  </label>
                  <input
                    type="text"
                    name="requestedBy"
                    value={formData.requestedBy}
                    onChange={handleChange}
                    className="w-full p-2 text-sm rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:outline-none text-gray-950 dark:text-white"
                    placeholder="e.g. Linda Miller"
                  />
                </div>
              )}

              {/* Form actions */}
              <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-red-650 hover:bg-red-500 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5"
                  id="submit-emergency-request-btn"
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                  ) : (
                    <>Submit Emergency Case</>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
