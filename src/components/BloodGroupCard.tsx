import React from 'react';
import { Heart } from 'lucide-react';

interface BloodGroupCardProps {
  group: string;
  count: number;
  compatibility: string;
  active?: boolean;
  onClick?: () => void;
}

export const BloodGroupCard: React.FC<BloodGroupCardProps> = ({ 
  group, 
  count, 
  compatibility,
  active = false,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden p-5 rounded-2xl border text-left transition-all duration-300 w-full focus:outline-none ${
        active 
          ? 'bg-red-500 text-white border-red-500 shadow-md scale-102 font-bold' 
          : 'bg-white dark:bg-slate-800 hover:bg-red-50/50 dark:hover:bg-red-950/20 border-gray-100 dark:border-slate-700/50 shadow-sm hover:shadow'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        {/* Blood drop look */}
        <div className={`p-3 rounded-xl ${active ? 'bg-red-600' : 'bg-red-50 dark:bg-red-950/40'}`}>
          <Heart className={`h-6 w-6 ${active ? 'text-white' : 'text-red-500 fill-current'}`} />
        </div>
        <span className={`text-2xl font-black ${active ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
          {group}
        </span>
      </div>
      <div>
        <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${active ? 'text-red-100' : 'text-gray-400'}`}>
          Registered Donors
        </h4>
        <p className={`text-2xl font-black ${active ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}>
          {count} {count === 1 ? 'person' : 'people'}
        </p>
        <p className={`text-[11px] mt-2 leading-tight ${active ? 'text-red-100/90' : 'text-gray-500'}`}>
          <span className="font-semibold">Compatibility:</span> {compatibility}
        </p>
      </div>
    </button>
  );
};
