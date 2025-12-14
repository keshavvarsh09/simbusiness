'use client';

import { useState, useEffect } from 'react';
import { Supplier } from '@/types';
import { FiInfo, FiStar, FiClock, FiDollarSign, FiPackage, FiAlertTriangle, FiBarChart, FiGlobe, FiSearch, FiFilter, FiPlus, FiRefreshCw, FiCheck, FiTruck } from 'react-icons/fi';
import { getAuthHeaders, isAuthenticated } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { TableSkeleton } from '@/components/SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';

// Expanded supplier risk factors
const supplierRiskFactors = {
  high: [
    "Unreliable shipment timing (30%+ variance in delivery estimates)",
    "Low quality product photos that don't match actual products",
    "Poor communication (>48hr response times)",
    "No quality control process",
    "No return policy"
  ],
  medium: [
    "Limited shipping carrier options",
    "Occasional stock discrepancies",
    "Seasonal price fluctuations",
    "Manual order processing system",
    "Language barrier requiring translation"
  ],
  low: [
    "Clear communication channels",
    "Consistent product quality",
    "Automated order processing",
    "Dedicated account manager",
    "Quality inspection before shipping"
  ]
};

// Supplier analytics
const supplierAnalytics = [
  {
    title: "Shipping Times",
    description: "Average shipping times by location",
    data: [
      { location: "China", time: "12-20 days", percentage: 35 },
      { location: "USA", time: "3-5 days", percentage: 15 },
      { location: "Europe", time: "5-10 days", percentage: 20 },
      { location: "Southeast Asia", time: "10-15 days", percentage: 25 },
      { location: "Other", time: "7-25 days", percentage: 5 }
    ]
  },
  {
    title: "Price Levels",
    description: "Price range by supplier tier",
    data: [
      { level: "Budget", margin: "50-70%", percentage: 30 },
      { level: "Mid-range", margin: "35-50%", percentage: 45 },
      { level: "Premium", margin: "20-35%", percentage: 25 }
    ]
  }
];

export default function Suppliers() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<{ category: string, location: string }>({ category: '', location: '' });
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [activeAnalytic, setActiveAnalytic] = useState(0);
  const [riskFactorType, setRiskFactorType] = useState<'high' | 'medium' | 'low'>('medium');

  // Load suppliers on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
      return;
    }
    loadSuppliers();
  }, [router]);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/suppliers/recommendations', {
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      if (data.success) {
        setSuppliers(data.suppliers || []);
      } else {
        console.error('Failed to load suppliers:', data.error);
      }
    } catch (error) {
      console.error('Error loading suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const regenerateSuppliers = async () => {
    setGenerating(true);
    try {
      await loadSuppliers();
    } finally {
      setGenerating(false);
    }
  };

  // Extract unique categories and locations
  const categories = Array.from(new Set(suppliers.map(s => s.category)));
  const locations = Array.from(new Set(suppliers.map(s => s.location)));

  // Filter suppliers based on search and filters
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filter.category ? supplier.category === filter.category : true;
    const matchesLocation = filter.location ? supplier.location === filter.location : true;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleSupplierSelect = (id: number) => {
    const supplier = suppliers.find(s => s.id === id);
    if (supplier) {
      setSelectedSupplier(supplier);
      // Scroll to details panel on mobile
      if (window.innerWidth < 1024) {
        document.getElementById('supplier-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (type: 'category' | 'location', value: string) => {
    setFilter(prev => ({ ...prev, [type]: value }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilter({ category: '', location: '' });
  };

  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading suppliers...</p>
        </div>
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-apple p-8 text-center border border-gray-100">
            <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FiPackage className="text-yellow-600 text-3xl" />
            </div>
            <h2 className="text-title-2 font-bold text-gray-900 mb-2">No Suppliers Yet</h2>
            <p className="text-body text-gray-500 mb-8">
              Add products to your catalog first, then we'll generate AI-powered supplier recommendations for you.
            </p>
            <button
              onClick={() => router.push('/products/recommendations')}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              <FiPlus /> Add Products
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Breadcrumbs />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-display-2 font-bold text-gray-900 mb-2">Supplier Management</h1>
            <p className="text-body text-gray-500">Manage your supply chain and evaluate partner risks.</p>
          </div>
          <button className="btn btn-primary flex items-center gap-2 self-start md:self-center">
            <FiPlus size={18} /> Add New Supplier
          </button>
        </div>

        {/* Educational Section - Risk Factors */}
        <div className="card mb-8 bg-gradient-to-br from-white to-gray-50/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-title-2 font-bold flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${riskFactorType === 'high' ? 'bg-red-50 text-red-500' :
                  riskFactorType === 'medium' ? 'bg-yellow-50 text-yellow-500' : 'bg-green-50 text-green-500'
                }`}>
                <FiAlertTriangle size={20} />
              </div>
              Supplier Risk Assessment
            </h2>
            <div className="flex bg-gray-100/80 p-1 rounded-xl">
              <button
                onClick={() => setRiskFactorType('high')}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${riskFactorType === 'high' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                High Risk
              </button>
              <button
                onClick={() => setRiskFactorType('medium')}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${riskFactorType === 'medium' ? 'bg-white text-yellow-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Medium Risk
              </button>
              <button
                onClick={() => setRiskFactorType('low')}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${riskFactorType === 'low' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Low Risk
              </button>
            </div>
          </div>

          <p className="text-body text-gray-600 mb-6 max-w-3xl">
            {riskFactorType === 'high'
              ? 'Suppliers with these characteristics pose significant risks to your business. Avoid or approach with extreme caution.'
              : riskFactorType === 'medium'
                ? 'These factors represent moderate risks that should be monitored but may be acceptable with proper management.'
                : 'These positive factors indicate a reliable supplier relationship with minimal risks.'
            }
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supplierRiskFactors[riskFactorType].map((factor, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${riskFactorType === 'high' ? 'bg-red-100 text-red-600' :
                    riskFactorType === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                  }`}>
                  {riskFactorType === 'low' ? <FiCheck size={12} /> : <FiAlertTriangle size={12} />}
                </div>
                <span className="text-sm text-gray-700 font-medium">{factor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <button
              onClick={toggleAnalytics}
              className="btn btn-secondary flex items-center gap-2 text-sm"
            >
              <FiBarChart /> {showAnalytics ? 'Hide Analytics' : 'Show Market Analytics'}
            </button>
          </div>
          <div className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
            Showing {filteredSuppliers.length} of {suppliers.length} suppliers
          </div>
        </div>

        {/* Analytics Panel */}
        <AnimatePresence>
          {showAnalytics && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="card bg-white">
                <div className="flex gap-6 mb-6 border-b border-gray-100 pb-2">
                  {supplierAnalytics.map((analytic, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveAnalytic(index)}
                      className={`pb-4 text-sm font-medium transition-all relative ${activeAnalytic === index ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      {analytic.title}
                      {activeAnalytic === index && (
                        <motion.div
                          layoutId="activeAnalytic"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
                        />
                      )}
                    </button>
                  ))}
                </div>

                <h3 className="text-title-3 font-bold text-gray-900 mb-2">{supplierAnalytics[activeAnalytic].title}</h3>
                <p className="text-body text-gray-500 mb-6">{supplierAnalytics[activeAnalytic].description}</p>

                <div className="space-y-4">
                  {supplierAnalytics[activeAnalytic].data.map((item, index) => (
                    <div key={index} className="flex items-center group">
                      <div className="w-32 text-sm font-medium text-gray-700">
                        {'location' in item ? item.location : item.level}
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-primary-500 h-full rounded-full"
                          ></motion.div>
                        </div>
                      </div>
                      <div className="w-32 text-right text-sm text-gray-600">
                        <span className="font-bold text-gray-900">{item.percentage}%</span>
                        <span className="text-xs text-gray-400 ml-1">
                          ({'time' in item ? item.time : `${item.margin} margin`})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-2">
                  <FiInfo /> Data based on aggregated industry statistics and SimBusiness platform analytics.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Suppliers List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-0 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-title-3 font-bold flex items-center gap-2">
                    <FiGlobe className="text-primary-500" /> Suppliers Directory
                  </h2>
                </div>

                {/* Search and Filters */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="input pl-10"
                      placeholder="Search suppliers by name or category..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <div className="relative inline-block">
                      <select
                        className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        value={filter.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                      >
                        <option value="">All Categories</option>
                        {categories.map((category, i) => (
                          <option key={i} value={category}>{category}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <FiFilter size={14} />
                      </div>
                    </div>

                    <div className="relative inline-block">
                      <select
                        className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        value={filter.location}
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                      >
                        <option value="">All Locations</option>
                        {locations.map((location, i) => (
                          <option key={i} value={location}>{location}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <FiFilter size={14} />
                      </div>
                    </div>

                    {(filter.category || filter.location || searchTerm) && (
                      <button
                        onClick={resetFilters}
                        className="text-sm font-medium text-red-600 hover:text-red-700 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr className="text-left border-b border-gray-100">
                      <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Supplier</th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lead Time</th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredSuppliers.length > 0 ? (
                      filteredSuppliers.map((supplier) => (
                        <tr
                          key={supplier.id}
                          className={`group hover:bg-gray-50/50 transition-colors cursor-pointer ${selectedSupplier?.id === supplier.id ? 'bg-primary-50/30' : ''}`}
                          onClick={() => handleSupplierSelect(supplier.id)}
                        >
                          <td className="py-4 px-6 font-medium text-gray-900">{supplier.name}</td>
                          <td className="py-4 px-6 text-sm text-gray-600">{supplier.location}</td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {supplier.category}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <FiStar className={`${supplier.rating >= 4.5 ? 'text-yellow-400' : 'text-gray-300'} mr-1.5`} size={16} fill={supplier.rating >= 4.5 ? "currentColor" : "none"} />
                              <span className="text-sm font-medium text-gray-900">{supplier.rating}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600">{supplier.lead_time}</td>
                          <td className="py-4 px-6 text-right">
                            <button
                              className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSupplierSelect(supplier.id);
                              }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                              <FiSearch className="text-gray-400 text-xl" />
                            </div>
                            <p className="text-gray-900 font-medium">No suppliers found</p>
                            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Supplier Details */}
          <div id="supplier-details" className="lg:col-span-1">
            <div className="card sticky top-8">
              <h2 className="text-title-3 font-bold mb-6 flex items-center gap-2">
                <FiInfo className="text-primary-500" />
                {selectedSupplier ? 'Supplier Details' : 'Select a Supplier'}
              </h2>

              {selectedSupplier ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={selectedSupplier.id}
                >
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedSupplier.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium flex items-center gap-1">
                        <FiGlobe size={12} /> {selectedSupplier.location}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
                        {selectedSupplier.category}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Rating</p>
                        <div className="flex items-center gap-1 font-bold text-gray-900">
                          <FiStar className="text-yellow-400" fill="currentColor" size={14} />
                          {selectedSupplier.rating}/5.0
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Lead Time</p>
                        <div className="flex items-center gap-1 font-bold text-gray-900">
                          <FiClock className="text-gray-400" size={14} />
                          {selectedSupplier.lead_time}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Price Level</p>
                        <div className="flex items-center gap-1 font-bold text-gray-900">
                          <FiDollarSign className="text-green-500" size={14} />
                          {selectedSupplier.price_level}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Min Order</p>
                        <div className="flex items-center gap-1 font-bold text-gray-900">
                          <FiPackage className="text-orange-500" size={14} />
                          {selectedSupplier.min_order} units
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100">
                    <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-sm">
                      <FiBarChart className="text-blue-500" /> Performance Score
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                          <span>Reliability</span>
                          <span>{(selectedSupplier.rating / 5 * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-white rounded-full h-2 border border-blue-100">
                          <div
                            className={`h-full rounded-full ${selectedSupplier.rating >= 4.5 ? 'bg-green-500' :
                                selectedSupplier.rating >= 4.0 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                            style={{ width: `${(selectedSupplier.rating / 5 * 100).toFixed(0)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                          <span>Shipping Speed</span>
                          <span className={
                            selectedSupplier.lead_time.split('-')[0] <= '5' ? 'text-green-600' :
                              selectedSupplier.lead_time.split('-')[0] <= '10' ? 'text-yellow-600' : 'text-red-600'
                          }>
                            {selectedSupplier.lead_time.split('-')[0] <= '5' ? 'Fast' :
                              selectedSupplier.lead_time.split('-')[0] <= '10' ? 'Average' : 'Slow'}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs bg-white/60 p-2 rounded-lg border border-blue-100/50 text-blue-800 leading-relaxed">
                        <span className="font-bold">Recommendation:</span> {
                          selectedSupplier.rating >= 4.5 ?
                            "Excellent choice for core products. High reliability." :
                            selectedSupplier.rating >= 4.0 ?
                              "Good backup supplier. Monitor quality on first orders." :
                              "High risk. Only use if no alternatives exist."
                        }
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button className="btn btn-primary w-full flex items-center justify-center gap-2">
                      <FiTruck size={18} /> Place Order
                    </button>
                    <button className="btn btn-secondary w-full">Contact Supplier</button>

                    <div className="text-center text-xs text-gray-400 pt-2">
                      Last order: Never
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiTruck className="text-gray-300 text-2xl" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">No Supplier Selected</h3>
                  <p className="text-xs text-gray-500">Select a supplier from the list to view detailed metrics and risk assessment.</p>
                </div>
              )}
            </div>

            {/* Educational Tips */}
            <div className="card mt-6 bg-gray-50/50 border-dashed">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-sm text-gray-900">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiInfo className="text-blue-600 text-xs" />
                </div>
                Quick Tips
              </h3>
              <ul className="space-y-3 text-xs text-gray-600">
                <li className="flex gap-2 items-start">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Always order samples before bulk purchasing</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Diversify suppliers to mitigate risks</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Negotiate better rates for long-term contracts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}