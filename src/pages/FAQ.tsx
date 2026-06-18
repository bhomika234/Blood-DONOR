import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { FAQ } from '../types';
import { HelpCircle, ChevronDown, ChevronUp, Clock, ShieldAlert, Heart, Info } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>("faq-1"); // Expand first by default
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    setFaqs(db.getFAQs());
  }, []);

  const categories = ['All', 'Eligibility', 'Donation Process', 'Safety', 'Tips'];

  const filteredFaqs = faqs.filter(faq => {
    if (selectedCategory === 'All') return true;
    return faq.category === selectedCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Title */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center justify-center gap-2">
            <HelpCircle className="h-8 w-8 text-red-655" /> Learning Directory & FAQ
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Find answers to commonly asked questions regarding medical eligibility, safety standards, and benefits of blood donations.
          </p>
        </div>

        {/* Category Selector Tab Bars */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none items-center justify-start sm:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setExpandedId(null);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all font-sans shrink-0 ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-55'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="space-y-4 mb-12">
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div 
                key={faq.id} 
                className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-150 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow transition-all"
              >
                {/* Accordion header button view */}
                <button
                  onClick={() => toggleExpand(faq.id)}
                  type="button"
                  className="w-full text-left p-5 sm:p-6 flex justify-between items-center gap-4 hover:bg-gray-50/50 dark:hover:bg-slate-850 transition-colors focus:outline-none"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-[10px] font-bold text-red-650 bg-red-50 dark:text-red-400 dark:bg-red-950/40 px-2 py-0.5 rounded-lg border border-red-100/40 mt-1 uppercase">
                      {faq.category}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white text-base sm:text-md">
                      {faq.question}
                    </span>
                  </div>

                  <span className="text-gray-400 shrink-0">
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </span>
                </button>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-gray-650 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-slate-800/80 bg-red-50/10 dark:bg-slate-900">
                    <p className="font-sans font-medium">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <p className="text-center py-6 text-gray-405 text-sm">No topics available in this specific category.</p>
          )}
        </div>

        {/* Infobox detailing donor benefits */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full filter blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl font-bold font-sans">Ready to Save Lives Near You?</h3>
              <p className="text-xs text-slate-400 max-w-md leading-normal">
                Sign up as an active blood donor in minutes. Mark yourself as available and prepare to answer emergency hospital calls when patients require matching antibodies.
              </p>
            </div>

            <a
              href="/register"
              className="py-3 px-6 bg-red-600 hover:bg-red-550 shrink-0 font-bold text-white rounded-xl text-sm transition-all shadow shadow-red-600/30"
            >
              Sign Up As Donor
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
export default FAQPage;
