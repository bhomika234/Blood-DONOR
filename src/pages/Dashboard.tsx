import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/db';
import { Donor, EmergencyRequest } from '../types';
import { DonorCard } from '../components/DonorCard';
import { 
  User, 
  MapPin, 
  Phone, 
  Heart, 
  PlusCircle, 
  Power, 
  Trash2, 
  Save, 
  AlertTriangle, 
  Calendar,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

export const Dashboard: React.FC = () => {
  const { currentUser, addToast, updateProfile } = useAuth();
  
  // States
  const [myDonors, setMyDonors] = useState<Donor[]>([]);
  const [displayEditForm, setDisplayEditForm] = useState(false);
  const [profileName, setProfileName] = useState(currentUser?.displayName || '');
  
  // Active selected donor for editing
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    bloodGroup: '',
    city: '',
    phone: '',
    email: '',
    lastDonationDate: '',
    available: true
  });

  const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Reload personal donor profiles
  const loadMyProfiles = () => {
    if (!currentUser) return;
    
    const donors = db.getDonors();
    // Match by ownerId or matching email (case-insensitive) for ultra-robust linking!
    const filtered = donors.filter(
      d => d.ownerId === currentUser.uid || d.email.toLowerCase() === currentUser.email.toLowerCase()
    );
    setMyDonors(filtered);
    
    if (filtered.length > 0) {
      setEditingDonor(filtered[0]);
    } else {
      setEditingDonor(null);
    }
  };

  useEffect(() => {
    loadMyProfiles();
    window.addEventListener('donors-updated', loadMyProfiles);
    return () => {
      window.removeEventListener('donors-updated', loadMyProfiles);
    };
  }, [currentUser]);

  // Sync edits
  useEffect(() => {
    if (editingDonor) {
      setEditFormData({
        name: editingDonor.name,
        bloodGroup: editingDonor.bloodGroup,
        city: editingDonor.city,
        phone: editingDonor.phone,
        email: editingDonor.email,
        lastDonationDate: editingDonor.lastDonationDate || '',
        available: editingDonor.available
      });
    }
  }, [editingDonor]);

  const handleUpdateProfileName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) return;

    try {
      await updateProfile(profileName.trim());
    } catch {
      // Handled in context
    }
  };

  // Toggle availability status instantly
  const handleToggleAvailability = (donor: Donor) => {
    try {
      const updated = db.updateDonor(donor.id, { available: !donor.available });
      addToast(`Availability updated! You are now marked as ${updated.available ? 'Available' : 'Unavailable'}.`, 'success');
      loadMyProfiles();
    } catch (err: any) {
      addToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Delete profile
  const handleDeleteProfile = (id: string) => {
    try {
      db.deleteDonor(id);
      addToast('Your donor profile was removed from LifeFlow directory.', 'info');
      loadMyProfiles();
    } catch (err: any) {
      addToast('Failed to remove profile', 'error');
    }
  };

  // Save edits form
  const handleSaveDonorEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDonor) return;

    if (!editFormData.name.trim() || !editFormData.city.trim() || !editFormData.phone.trim()) {
      addToast('Please input all required values.', 'error');
      return;
    }

    try {
      db.updateDonor(editingDonor.id, {
        name: editFormData.name.trim(),
        bloodGroup: editFormData.bloodGroup,
        city: editFormData.city.trim(),
        phone: editFormData.phone.trim(),
        email: editFormData.email.trim(),
        lastDonationDate: editFormData.lastDonationDate,
        available: editFormData.available
      });

      addToast('Your donor listing details were saved successfully!', 'success');
      setDisplayEditForm(false);
      loadMyProfiles();
    } catch (err: any) {
      addToast('Failed to update details', 'error');
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col justify-center items-center p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Access Denied</h2>
        <p className="text-gray-500 mt-2 max-w-sm">
          Please log into your user account to access your personalized blood donor dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Title row */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white font-sans tracking-tight flex items-center gap-2">
              <User className="h-8 w-8 text-red-600" /> Donor Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
              Manage your availability, edit medical listing details, or update display details.
            </p>
          </div>

          {/* Quick status bar */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-gray-100 dark:border-slate-800">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-2">System Status:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-3.5 w-3.5" /> Synchronized Live
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: User Account Profile */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-xl">
              <div className="text-center mb-6">
                <img
                  src={currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.displayName}`}
                  alt="Avatar"
                  className="h-20 w-20 rounded-full border-2 border-red-500 mx-auto object-cover"
                  referrerPolicy="no-referrer"
                />
                <h3 className="text-lg font-bold text-gray-950 dark:text-white mt-3 capitalize">{currentUser.displayName}</h3>
                <p className="text-xs text-red-600 dark:text-red-400 uppercase tracking-wider font-bold mt-1">{currentUser.role} Account</p>
                <p className="text-xs text-gray-400 truncate mt-1">{currentUser.email}</p>
              </div>

              {/* Edit display name form */}
              <form onSubmit={handleUpdateProfileName} className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                <div>
                  <label htmlFor="display-name" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Update Account Name
                  </label>
                  <input
                    type="text"
                    id="display-name"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Save Display Name
                </button>
              </form>
            </div>
            
            {/* Quick tips card */}
            <div className="bg-gradient-to-br from-red-600 to-red-500 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/15 rounded-full filter blur-xl"></div>
              <h4 className="font-extrabold text-base mb-2 flex items-center gap-1.5">
                <Sparkles className="h-5 w-5 animate-spin-slow" /> Quick Tip
              </h4>
              <p className="text-xs text-red-100 leading-relaxed font-medium">
                Keep your 'Availability Status' updated. If you are travelling, sick, or recently donated blood, toggle your status to Unavailable so families know not to contact you during emergencies.
              </p>
            </div>
          </div>

          {/* Column 2 & 3: Donor profile and emergency activities */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Donor registration finder */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Emergency blood Donor Status</h2>

              {myDonors.length === 0 ? (
                /* No registered profile visualizer */
                <div className="border border-dashed border-red-200 dark:border-red-950 rounded-2xl p-6 text-center space-y-4">
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-full max-w-max mx-auto text-red-600">
                    <Heart className="h-8 w-8 text-red-600 fill-current" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-200">You are not registered as a Donor</h3>
                    <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
                      Your current user account is not associated with any active blood donor listing. Register as a donor to appear in public emergency search parameters.
                    </p>
                  </div>
                  <div>
                    <a
                      href="/register"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all"
                    >
                      <PlusCircle className="h-4 w-4" /> Register as a donor now
                    </a>
                  </div>
                </div>
              ) : (
                /* Profile found manager */
                <div className="space-y-6">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950/50 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500 text-white rounded-xl">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-emerald-800 dark:text-emerald-400">Public Donor profile is Active</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-500">People finding blood in your city can see your phone number.</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleAvailability(myDonors[0])}
                      className={`flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold rounded-xl transition-all border ${
                        myDonors[0].available
                          ? 'bg-red-50 hover:bg-red-100 dark:bg-red-950/20 border-red-100 text-red-600 dark:text-red-400'
                          : 'bg-emerald-500 hover:bg-emerald-600 border-emerald-500 text-white'
                      }`}
                    >
                      <Power className="h-3.5 w-3.5" />
                      {myDonors[0].available ? 'Go Offline' : 'Mark Available'}
                    </button>
                  </div>

                  {/* Edit toggled display card */}
                  {!displayEditForm ? (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Your Listing Preview</h3>
                      <div className="max-w-md">
                        <DonorCard
                          donor={myDonors[0]}
                          onEdit={() => setDisplayEditForm(true)}
                          onDelete={handleDeleteProfile}
                        />
                      </div>
                    </div>
                  ) : (
                    /* Display editing form */
                    <form onSubmit={handleSaveDonorEdit} className="p-5 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-slate-700">
                        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100">Edit Donor Directory Listing</h4>
                        <button
                          type="button"
                          onClick={() => setDisplayEditForm(false)}
                          className="text-xs text-gray-400 hover:text-red-500"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-gray-500 mb-1">Donor Name</label>
                          <input
                            type="text"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                            className="w-full p-2 rounded-lg border bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-500 mb-1">Blood Group</label>
                          <select
                            value={editFormData.bloodGroup}
                            onChange={(e) => setEditFormData({ ...editFormData, bloodGroup: e.target.value })}
                            className="w-full p-2 rounded-lg border bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white"
                          >
                            {BLOOD_GROUPS.map(bg => (
                              <option key={bg} value={bg}>{bg}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-gray-500 mb-1">Registered City</label>
                          <input
                            type="text"
                            value={editFormData.city}
                            onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                            className="w-full p-2 rounded-lg border bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-500 mb-1">Mobile Contact Phone</label>
                          <input
                            type="tel"
                            value={editFormData.phone}
                            onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                            className="w-full p-2 rounded-lg border bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-gray-500 mb-1">Last Donation Date</label>
                          <input
                            type="date"
                            value={editFormData.lastDonationDate}
                            onChange={(e) => setEditFormData({ ...editFormData, lastDonationDate: e.target.value })}
                            className="w-full p-2 rounded-lg border bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white"
                          />
                        </div>

                        <div className="flex items-center pt-5">
                          <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700 dark:text-gray-300">
                            <input
                              type="checkbox"
                              checked={editFormData.available}
                              onChange={(e) => setEditFormData({ ...editFormData, available: e.target.checked })}
                              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                            <span>Mark Available for Donation Requests</span>
                          </label>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setDisplayEditForm(false)}
                          className="px-3.5 py-1.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Save className="h-3 w-3" /> Save Changes
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
