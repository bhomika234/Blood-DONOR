import React, { useState } from 'react';
import { Donor } from '../types';
import { useAuth } from '../context/AuthContext';
import { MapPin, Phone, Calendar, CheckCircle, AlertTriangle, Copy, Check, MessageSquare } from 'lucide-react';

interface DonorCardProps {
  donor: Donor;
  onEdit?: (donor: Donor) => void;
  onDelete?: (id: string) => void;
}

export const DonorCard: React.FC<DonorCardProps> = ({ donor, onEdit, onDelete }) => {
  const { currentUser, addToast } = useAuth();
  const [copied, setCopied] = useState(false);

  const canManage = currentUser && (currentUser.uid === donor.ownerId || currentUser.role === 'admin');

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(donor.phone);
    setCopied(true);
    addToast(`Copied ${donor.name}'s phone number to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString('en-US', options);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group">
      {/* Blood Group Badge top-right */}
      <div className="absolute top-4 right-4 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl border border-red-100 dark:border-red-900/30 flex flex-col items-center justify-center min-w-[50px] shadow-sm">
        <span className="text-xl font-black text-red-600 dark:text-red-400 leading-none">
          {donor.bloodGroup}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-red-500 font-bold mt-1">blood</span>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Name and Status */}
        <div className="mb-4 pr-16">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
            {donor.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            {donor.available ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                <CheckCircle className="h-3.5 w-3.5" /> Available Now
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
                <AlertTriangle className="h-3.5 w-3.5" /> busy
              </span>
            )}
          </div>
        </div>

        {/* Details List */}
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300 flex-1">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{donor.city}</p>
              <p className="text-xs text-gray-400">Registered City</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {donor.lastDonationDate ? formattedDate(donor.lastDonationDate) : 'Never donated'}
              </p>
              <p className="text-xs text-gray-400">Last Donation Date</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Phone className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                {donor.phone}
                <button 
                  onClick={handleCopyPhone}
                  className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                  title="Copy Phone Number"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </p>
              <p className="text-xs text-gray-400">Mobile Contact</p>
            </div>
          </div>
        </div>

        {/* Administration overlays */}
        {canManage && (
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-700/60 flex items-center justify-end gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(donor)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 transition-colors"
              >
                Edit Profile
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to remove your donor profile?")) {
                    onDelete(donor.id);
                  }
                }}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Immediate Direct Contact Triggers */}
      <div className="bg-gray-50 dark:bg-slate-800/40 border-t border-gray-100 dark:border-slate-700/40 p-3.5 grid grid-cols-2 gap-2 text-center text-xs">
        <a
          href={`tel:${donor.phone}`}
          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-sm hover:scale-[1.02]"
        >
          <Phone className="h-3.5 w-3.5" /> Call Now
        </a>
        <a
          href={`https://wa.me/${donor.phone.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-sm hover:scale-[1.02]"
        >
          <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
        </a>
      </div>
    </div>
  );
};
