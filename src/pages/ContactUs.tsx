import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/db';
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle, Smartphone } from 'lucide-react';

export const ContactUs: React.FC = () => {
  const { addToast } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      addToast('Please complete all form inputs.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      
      // Save contact message to our simulated DB
      db.addContactMessage(formData);

      addToast("Thanks for reaching out! We've received your request.", "success");
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      addToast("Message failed to send. Try again later.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center justify-center gap-2">
            <Mail className="h-8 w-8 text-red-600" /> Contact Our Support Team
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Have any questions or technical issues with our blood matching directory? Message us anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Column Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-red-50 dark:bg-red-950 text-red-650 dark:text-red-400 rounded-2xl shrink-0">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-950 dark:text-white">Our Head Office Address</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Health Square, Main Medical Zone, Suite 410, NY 10010
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-red-50 dark:bg-red-950 text-red-650 dark:text-red-400 rounded-2xl shrink-0">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-950 dark:text-white font-sans">Helpline Number</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-mono font-bold">
                  +1 (555) BLOOD-LF <br />
                  +92 (300) 123-4567
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-red-50 dark:bg-red-950 text-red-655 dark:text-red-400 rounded-2xl shrink-0">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-950 dark:text-white">E-mail Correspondence</h4>
                <p className="text-sm text-gray-500 dark:text-gray-405 mt-1 font-semibold truncate text-wrap">
                  support@lifeflow-donors.org <br />
                  emergency@lifeflow.com
                </p>
              </div>
            </div>

          </div>

          {/* Contact form on the right */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-8 shadow-xl">
            
            {success ? (
              <div className="text-center py-12 space-y-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-full max-w-max mx-auto">
                  <CheckCircle className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Message Sent Successfully!</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Thank you for contacting LifeFlow. Our technical operators will review your feedback and reply to your email address within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-5 py-2 hover:bg-slate-100 font-semibold text-gray-700 dark:text-gray-300 dark:hover:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Send Us a Direct Message</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Your Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="e.g. John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Your Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-sm text-gray-955 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="e.g. johndoe@gmail.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-2.5 rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g. Inquiring about plasma donation eligibility"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Message / Message Details</label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-2.5 rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    placeholder="Describe your question or message..."
                    required
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-650 hover:bg-red-500 text-white font-bold rounded-xl shadow-md transition-all font-sans"
                    id="submit-contact-btn"
                  >
                    {isSubmitting ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Send Message Details
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
