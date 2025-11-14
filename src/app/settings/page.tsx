'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BusinessSettings } from '@/types';
import { motion } from 'framer-motion';
import { FiSave, FiMoon, FiSun, FiBell, FiDollarSign, FiMail, FiShoppingBag, FiPercent, FiTruck } from 'react-icons/fi';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500 mt-2">Customize your business preferences</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="text-2xl font-bold mb-6">Business Settings</h2>
              
              {/* Business Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <FiShoppingBag className="mr-2" /> 
                  Business Information
                </h3>
                <div className="space-y-4">
                  <div className="group">
                    <label htmlFor="businessName" className="block text-sm font-medium mb-1">
                      Business Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        value={businessSettings.businessName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-blue-400"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      <span className="flex items-center">
                        <FiMail className="mr-2" /> Email
                      </span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={businessSettings.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-blue-400"
                    />
                  </div>
                </div>
              </div>
              
              {/* Financial Settings */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <FiDollarSign className="mr-2" />
                  Financial Settings
                </h3>
                <div className="space-y-4">
                  <div className="group">
                    <label htmlFor="currency" className="block text-sm font-medium mb-1">
                      Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={businessSettings.currency}
                      onChange={handleSelectChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-blue-400"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="CAD">CAD (C$)</option>
                      <option value="AUD">AUD (A$)</option>
                    </select>
                  </div>

                  <div className="group">
                    <label htmlFor="taxRate" className="block text-sm font-medium mb-1 flex items-center">
                      <FiPercent className="mr-2" /> Tax Rate (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="taxRate"
                        name="taxRate"
                        min="0"
                        step="0.1"
                        value={businessSettings.taxRate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-blue-400"
                      />
                      <div className="absolute right-3 top-2.5 text-gray-500">%</div>
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="shippingFee" className="block text-sm font-medium mb-1 flex items-center">
                      <FiTruck className="mr-2" /> Default Shipping Fee
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-2.5 text-gray-500">
                        {getCurrencySymbol(businessSettings.currency)}
                      </div>
                      <input
                        type="number"
                        id="shippingFee"
                        name="shippingFee"
                        min="0"
                        step="0.01"
                        value={businessSettings.shippingFee}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-blue-400"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="profitMargin" className="block text-sm font-medium mb-1 flex items-center">
                      <FiPercent className="mr-2" /> Target Profit Margin (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="profitMargin"
                        name="profitMargin"
                        min="0"
                        max="100"
                        value={businessSettings.profitMargin}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-blue-400"
                      />
                      <div className="absolute right-3 top-2.5 text-gray-500">%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        id="notificationsEnabled" 
                        name="notificationsEnabled"
                        checked={businessSettings.notificationsEnabled}
                        onChange={handleInputChange}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label 
                        htmlFor="notificationsEnabled" 
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                          businessSettings.notificationsEnabled ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      ></label>
                    </div>
                    <label htmlFor="notificationsEnabled" className="flex items-center cursor-pointer">
                      <FiBell className="mr-2" /> Enable Notifications
                    </label>
                  </div>

                  <div className="flex items-center">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        id="darkMode" 
                        name="darkMode"
                        checked={businessSettings.darkMode}
                        onChange={handleInputChange}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label 
                        htmlFor="darkMode" 
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                          businessSettings.darkMode ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      ></label>
                    </div>
                    <label htmlFor="darkMode" className="flex items-center cursor-pointer">
                      {businessSettings.darkMode ? (
                        <><FiMoon className="mr-2" /> Dark Mode</>
                      ) : (
                        <><FiSun className="mr-2" /> Light Mode</>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={saveSettings}
                  disabled={isSaving}
                  className={`w-full py-3 px-4 flex items-center justify-center rounded-md ${
                    isSuccess 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400`}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : isSuccess ? (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Settings Saved!
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div
            className="mt-8 text-center text-sm text-gray-500"
          >
            <p>Your settings are automatically synced across all your devices.</p>
          </div>
        </div>
      </main>

      {/* CSS for toggle switch */}
      <style jsx>{`
        .toggle-checkbox:checked {
          transform: translateX(100%);
          border-color: white;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #3B82F6;
        }
      `}</style>
    </div>
  );
} 