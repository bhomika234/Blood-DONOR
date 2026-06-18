import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 transition-colors duration-300" id="app-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Info column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-red-600/20 rounded-lg">
                <Heart className="h-5 w-5 text-red-500 fill-current" />
              </div>
              <span className="font-sans text-lg font-bold text-white">LifeFlow</span>
            </div>
            <p className="text-sm text-slate-400">
              Connecting life-savers with patients in emergency situations. Together, we can make sure nobody has to suffer due to a shortage of blood.
            </p>
            <div className="flex gap-1 items-center text-xs text-red-500 font-semibold bg-red-950/40 p-2.5 rounded-lg border border-red-900/30 max-w-max">
              <Shield className="h-4 w-4" /> Emulated Sandbox Mode
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-red-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-red-400 transition-colors">Find Blood Donors</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-red-400 transition-colors">Register as a Donor</Link>
              </li>
              <li>
                <Link to="/requests" className="hover:text-red-400 transition-colors">Emergency Requests</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-red-400 transition-colors">FAQ / Donating Tips</Link>
              </li>
            </ul>
          </div>

          {/* Popular Blood Groups */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Blood Groups</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
              <Link to="/search?group=O%2B" className="hover:text-red-400 transition-colors">O Positive (O+)</Link>
              <Link to="/search?group=O%2D" className="hover:text-red-400 transition-colors">O Negative (O-)</Link>
              <Link to="/search?group=A%2B" className="hover:text-red-400 transition-colors">A Positive (A+)</Link>
              <Link to="/search?group=A%2D" className="hover:text-red-400 transition-colors">A Negative (A-)</Link>
              <Link to="/search?group=B%2B" className="hover:text-red-400 transition-colors">B Positive (B+)</Link>
              <Link to="/search?group=B%2D" className="hover:text-red-400 transition-colors">B Negative (B-)</Link>
              <Link to="/search?group=AB%2B" className="hover:text-red-400 transition-colors">AB Positive (AB+)</Link>
              <Link to="/search?group=AB%2D" className="hover:text-red-400 transition-colors">AB Negative (AB-)</Link>
            </div>
          </div>

          {/* Contact Column */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Contact Info</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-red-500 shrink-0" />
                <span>+1 (555) BLOOD-LF</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-red-500 shrink-0" />
                <span className="truncate">support@lifeflow-donors.org</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                <span>Health Square, Main Medical Zone</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 space-y-1">
          <p>© {new Date().getFullYear()} LifeFlow. All rights reserved.</p>
          <p>This utility is a high-performance, compliant prototype engineered with offline local storage sandbox persistence.</p>
        </div>
      </div>
    </footer>
  );
};
