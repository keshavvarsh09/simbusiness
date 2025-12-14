'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BusinessSettings } from '@/types';
import { motion } from 'framer-motion';
import { FiSave, FiMoon, FiSun, FiBell, FiDollarSign, FiMail, FiShoppingBag, FiPercent, FiTruck, FiSettings } from 'react-icons/fi';
import { isAuthenticated, getAuthHeaders } from '@/lib/auth';

export default function SettingsPage() {
  const router = useRouter();
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    businessName: 'My Dropshipping Business',
    email: '',
    currency: 'USD',
    taxRate: 7.5,
    shippingFee: 4.99,
    profitMargin: 30,
    notificationsEnabled: true,
    darkMode: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user email and settings
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
      return;
    }

    loadUserData();
  }, [router]);

  const loadUserData = async () => {
    try {
      // Get user email from token
      const token = localStorage.getItem('token');
      if (token) {
        // Decode JWT to get email (simple decode, not verification)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.email) {
            setBusinessSettings(prev => ({ ...prev, email: payload.email }));
          }
        } catch (e) {
          // If can't decode, fetch from API
          const response = await fetch('/api/user/profile', {
            headers: getAuthHeaders(),
          });
          if (response.ok) {
            const data = await response.json();
            if (data.email) {
              setBusinessSettings(prev => ({ ...prev, email: data.email }));
            }
          }
        }
      }

      // Load saved settings from localStorage
      const savedSettings = localStorage.getItem('businessSettings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setBusinessSettings(prev => ({ ...prev, ...parsed }));
        } catch (error) {
          console.error('Failed to parse saved settings:', error);
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply dark mode when that setting changes
  useEffect(() => {
    if (businessSettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [businessSettings.darkMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setBusinessSettings({
      ...businessSettings,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBusinessSettings({
      ...businessSettings,
      [name]: value
    });
  };

  const saveSettings = async () => {
    setIsSaving(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Save to localStorage 
    localStorage.setItem('businessSettings', JSON.stringify(businessSettings));

    setIsSaving(false);
    setIsSuccess(true);

    // Reset success message after 3 seconds
    setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      case 'CAD': return 'C$';
      case 'AUD': return 'A$';
      default: return '$';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-body text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
              <FiSettings className="text-gray-600 text-2xl" />
            </div>
            <div>
              <h1 className="text-display-3 font-bold text-gray-900">Settings</h1>
              <p className="text-body text-gray-500">Customize your business preferences</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Business Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6 sm:p-8"
            >
              <h2 className="text-title-2 font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiShoppingBag className="text-primary-600" />
                Business Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Business Name
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={businessSettings.businessName}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={businessSettings.email}
                      onChange={handleInputChange}
                      className="input pl-10"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Financial Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6 sm:p-8"
            >
              <h2 className="text-title-2 font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiDollarSign className="text-green-600" />
                Financial Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={businessSettings.currency}
                    onChange={handleSelectChange}
                    className="input"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="CAD">CAD (C$)</option>
                    <option value="AUD">AUD (A$)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tax Rate (%)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPercent className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="taxRate"
                      name="taxRate"
                      min="0"
                      step="0.1"
                      value={businessSettings.taxRate}
                      onChange={handleInputChange}
                      className="input pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="shippingFee" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Default Shipping Fee
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiTruck className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="shippingFee"
                      name="shippingFee"
                      min="0"
                      step="0.01"
                      value={businessSettings.shippingFee}
                      onChange={handleInputChange}
                      className="input pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="profitMargin" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Target Profit Margin (%)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPercent className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="profitMargin"
                      name="profitMargin"
                      min="0"
                      max="100"
                      value={businessSettings.profitMargin}
                      onChange={handleInputChange}
                      className="input pl-10"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6 sm:p-8"
            >
              <h2 className="text-title-2 font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiBell className="text-amber-500" />
                Preferences
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-gray-500">
                      <FiBell />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <p className="text-sm text-gray-500">Receive alerts about orders and inventory</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="notificationsEnabled"
                      checked={businessSettings.notificationsEnabled}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-gray-500">
                      {businessSettings.darkMode ? <FiMoon /> : <FiSun />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Dark Mode</h3>
                      <p className="text-sm text-gray-500">Switch between light and dark themes</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="darkMode"
                      checked={businessSettings.darkMode}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-end pt-4">
              <button
                onClick={saveSettings}
                disabled={isSaving}
                className={`btn btn-primary px-8 py-3 flex items-center gap-2 ${isSuccess ? 'bg-green-600 hover:bg-green-700 border-green-600' : ''}`}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : isSuccess ? (
                  <>
                    <FiCheckCircle className="text-xl" />
                    Saved Successfully
                  </>
                ) : (
                  <>
                    <FiSave className="text-xl" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { FiCheckCircle } from 'react-icons/fi';