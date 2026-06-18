import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/db';
import { Heart, Landmark, Phone, Mail, Calendar, User, Check, Sparkles, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export const RegisterDonor: React.FC = () => {
  const { currentUser, addToast } = useAuth();
  const navigate = useNavigate();

  // Blood groups & cities
  const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const POPULAR_CITIES = ['Karachi', 'New York', 'London', 'Delhi', 'Miami', 'Toronto', 'Tokyo border', 'Sydney'];

  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: 'O+',
    city: '',
    customCity: '',
    phone: '',
    email: '',
    lastDonationDate: '',
    available: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill user data if available
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.displayName || '',
        email: currentUser.email || ''
      }));
    }
  }, [currentUser]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    
    // Choose city validation
    const targetCity = formData.city === 'custom' ? formData.customCity : formData.city;
    if (!targetCity.trim()) {
      newErrors.city = 'Please select or enter a city name';
    }

    // Phone format: minimal 7 digits
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/[^0-9]/g, '').length < 7) {
      newErrors.phone = 'Please enter a valid contact phone number';
    }

    // Email format
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Last donation date shouldn't be in the future
    if (formData.lastDonationDate) {
      const today = new Date();
      const inputDate = new Date(formData.lastDonationDate);
      if (inputDate > today) {
        newErrors.lastDonationDate = 'Last donation date cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addToast('Please satisfy all required validation fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // Small simulated DB delays
      await new Promise(resolve => setTimeout(resolve, 1000));

      const finalCity = formData.city === 'custom' ? formData.customCity.trim() : formData.city;

      // Add actual donor to our emulated firestore DB
      db.addDonor({
        name: formData.name.trim(),
        bloodGroup: formData.bloodGroup,
        city: finalCity,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        lastDonationDate: formData.lastDonationDate,
        available: formData.available,
        ownerId: currentUser?.uid || 'guest-uid-' + Math.random().toString(36).substring(2, 6)
      });

      addToast('Congratulations! You have registered successfully as a blood donor.', 'success');
      
      // Redirect based on login status
      if (currentUser) {
        navigate('/dashboard');
      } else {
        navigate('/search');
      }
    } catch (err: any) {
      addToast(err.message || 'Registration failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Helper info if not logged in */}
        {!currentUser && (
          <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-850 rounded-2xl flex items-start gap-3.5 text-sm">
            <span className="p-1 bg-orange-100 dark:bg-orange-900 rounded-lg shrink-0 mt-0.5">⚠️</span>
            <div>
              <p className="font-semibold text-orange-800 dark:text-orange-400">You are not logged in</p>
              <p className="text-orange-700 dark:text-orange-300/85 mt-1">
                You can register as a guest, but you won't be able to edit, update your availability, or delete your profile unless you have an account. We recommend{' '}
                <Link to="/signup" className="font-bold underline">
                  Signing Up
                </Link>{' '}
                or{' '}
                <Link to="/login" className="font-bold underline">
                  Logging In
                </Link>{' '}
                first.
              </p>
            </div>
          </div>
        )}

        {/* Card Form container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 py-8 px-8 text-white relative">
            <div className="absolute top-0 right-0 p-5 opacity-10">
              <Sparkles className="h-24 w-24" />
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <Heart className="h-6 w-6 text-white animate-pulse fill-current" />
              </div>
              <div>
                <h1 className="text-2xl font-black font-sans leading-none">Become a Lifesaver</h1>
                <p className="text-red-100 text-xs font-semibold mt-1.5 uppercase tracking-wider">Donor Registration Form</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-gray-900 dark:text-white ${
                    errors.name ? 'border-red-500 ring-2 ring-red-100 dark:ring-red-950/30' : ''
                  }`}
                  placeholder="e.g. Ali Khan"
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 font-medium mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Blood Group Dropdown */}
              <div>
                <label htmlFor="bloodGroup" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Blood Group <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Heart className="h-5 w-5 text-red-500 shrink-0" />
                  </div>
                  <select
                    name="bloodGroup"
                    id="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-gray-900 dark:text-white"
                  >
                    {BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* City Selection dropdown & custom field */}
              <div>
                <label htmlFor="city" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  City <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-gray-900 dark:text-white appearance-none"
                  >
                    <option value="">-- Select Registered City --</option>
                    {POPULAR_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                    <option value="custom">Other City...</option>
                  </select>
                </div>
                {errors.city && <p className="text-xs text-red-500 font-medium mt-1">{errors.city}</p>}
              </div>
            </div>

            {/* Custom City Input Block */}
            {formData.city === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700"
              >
                <label htmlFor="customCity" className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Specify Your City Name
                </label>
                <input
                  type="text"
                  name="customCity"
                  id="customCity"
                  value={formData.customCity}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-gray-900 dark:text-white text-sm"
                  placeholder="e.g. Islamabad, Boston, Chicago"
                />
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-gray-900 dark:text-white ${
                      errors.phone ? 'border-red-500 ring-2 ring-red-100 dark:ring-red-950/30' : ''
                    }`}
                    placeholder="e.g. 03001234567"
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500 font-medium mt-1">{errors.phone}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-gray-900 dark:text-white ${
                      errors.email ? 'border-red-500 ring-2 ring-red-100 dark:ring-red-950/30' : ''
                    }`}
                    placeholder="e.g. developer@gmail.com"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 font-medium mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Last Donation Date */}
              <div>
                <label htmlFor="lastDonationDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Last Donation Date <span className="text-xs text-gray-400 capitalize">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="lastDonationDate"
                    id="lastDonationDate"
                    value={formData.lastDonationDate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-gray-900 dark:text-white text-sm"
                  />
                </div>
                {errors.lastDonationDate && <p className="text-xs text-red-500 font-medium mt-1">{errors.lastDonationDate}</p>}
              </div>

              {/* Status Toggle (checkbox styled beautifully) */}
              <div className="flex flex-col justify-center">
                <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Currently Available to Donate?
                </span>
                <label className="relative inline-flex items-center cursor-pointer p-1 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:bg-gray-100/50 max-w-max">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:left-[6px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
                  <span className="ml-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {formData.available ? (
                      <span className="text-emerald-600 dark:text-emerald-400">Yes, Available Now</span>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">No, On Break</span>
                    )}
                  </span>
                </label>
              </div>
            </div>

            {/* Disclaimer and Submit */}
            <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
              <p className="text-xs text-gray-400 leading-normal mb-4">
                By clicking Submit, you agree to make your medical details and contact information visible publicly so that families in crisis can reach out to you directly.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-600/10 hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50"
                id="submit-register-btn"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                ) : (
                  <>
                    <Check className="h-5 w-5" /> Submit Registration
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
