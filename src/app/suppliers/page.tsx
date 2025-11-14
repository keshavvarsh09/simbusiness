'use client';

import { useState, useEffect } from 'react';
import { Supplier } from '@/types';
import { FiInfo, FiStar, FiClock, FiDollarSign, FiPackage, FiAlertTriangle, FiBarChart, FiGlobe, FiSearch, FiFilter, FiPlus, FiRefreshCw } from 'react-icons/fi';
import { getAuthHeaders, isAuthenticated } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { TableSkeleton } from '@/components/SkeletonLoader';

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading suppliers...</p>
        </div>
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <FiPackage className="mx-auto text-yellow-600 mb-4" size={48} />
            <h2 className="text-xl font-bold text-yellow-800 mb-2">No Suppliers Yet</h2>
            <p className="text-yellow-700 mb-4">
              Add products to your catalog first, then we'll generate AI-powered supplier recommendations for you.
            </p>
            <button
              onClick={() => router.push('/products/recommendations')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Add Products
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        <h1 className="text-3xl font-bold mb-6">Supplier Management</h1>
        
        {/* Educational Section - Risk Factors */}
        <div className="card bg-white mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FiAlertTriangle className={`${
                riskFactorType === 'high' ? 'text-red-500' :
                riskFactorType === 'medium' ? 'text-yellow-500' : 'text-green-500'
              }`} />
              Supplier Risk Assessment
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setRiskFactorType('high')}
                className={`px-3 py-1 text-sm rounded-md ${riskFactorType === 'high' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}
              >
                High Risk
              </button>
              <button 
                onClick={() => setRiskFactorType('medium')}
                className={`px-3 py-1 text-sm rounded-md ${riskFactorType === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}
              >
                Medium Risk
              </button>
              <button 
                onClick={() => setRiskFactorType('low')}
                className={`px-3 py-1 text-sm rounded-md ${riskFactorType === 'low' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
              >
                Low Risk
              </button>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">
            {riskFactorType === 'high' 
              ? 'Suppliers with these characteristics pose significant risks to your business. Avoid or approach with extreme caution.'
              : riskFactorType === 'medium'
                ? 'These factors represent moderate risks that should be monitored but may be acceptable with proper management.'
                : 'These positive factors indicate a reliable supplier relationship with minimal risks.'
            }
          </p>
          
          <ul className="list-disc pl-5 space-y-1">
            {supplierRiskFactors[riskFactorType].map((factor, index) => (
              <li key={index} className="text-gray-700">{factor}</li>
            ))}
          </ul>
        </div>
        
        {/* Analytics Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <button 
              onClick={toggleAnalytics}
              className="btn btn-outline flex items-center gap-2"
            >
              <FiBarChart /> {showAnalytics ? 'Hide Analytics' : 'Show Market Analytics'}
            </button>
          </div>
          <div className="text-sm text-gray-500">
            Showing {filteredSuppliers.length} of {suppliers.length} suppliers
          </div>
        </div>
        
        {/* Analytics Panel */}
        {showAnalytics && (
          <div className="card bg-white mb-8">
            <div className="flex gap-4 mb-4 border-b pb-4">
              {supplierAnalytics.map((analytic, index) => (
                <button
                  key={index}
                  onClick={() => setActiveAnalytic(index)}
                  className={`px-4 py-2 ${activeAnalytic === index ? 'text-primary font-medium border-b-2 border-primary' : 'text-gray-600'}`}
                >
                  {analytic.title}
                </button>
              ))}
            </div>
            
            <h3 className="font-medium mb-2">{supplierAnalytics[activeAnalytic].title}</h3>
            <p className="text-gray-600 mb-4">{supplierAnalytics[activeAnalytic].description}</p>
            
            <div className="space-y-3">
              {supplierAnalytics[activeAnalytic].data.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-1/4 text-sm font-medium">
                    {'location' in item ? item.location : item.level}
                  </div>
                  <div className="w-1/2">
                    <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-1/4 pl-4 text-sm">
                    <span className="font-medium">{item.percentage}%</span> - {'time' in item ? item.time : `${item.margin} margin`}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t text-sm text-gray-500">
              <p>Data based on aggregated industry statistics and SimBusiness platform analytics.</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Suppliers List */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FiGlobe /> Suppliers Directory
                </h2>
                <button className="btn btn-primary flex items-center gap-2">
                  <FiPlus size={16} /> Add New Supplier
                </button>
              </div>
              
              {/* Search and Filters */}
              <div className="mb-4 space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="Search suppliers..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <div className="relative inline-block">
                    <select
                      className="appearance-none bg-white border rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:ring-primary focus:border-primary text-sm"
                      value={filter.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map((category, i) => (
                        <option key={i} value={category}>{category}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <FiFilter size={14} />
                    </div>
                  </div>
                  
                  <div className="relative inline-block">
                    <select
                      className="appearance-none bg-white border rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:ring-primary focus:border-primary text-sm"
                      value={filter.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                    >
                      <option value="">All Locations</option>
                      {locations.map((location, i) => (
                        <option key={i} value={location}>{location}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <FiFilter size={14} />
                    </div>
                  </div>
                  
                  {(filter.category || filter.location || searchTerm) && (
                    <button 
                      onClick={resetFilters}
                      className="text-sm text-gray-600 hover:text-gray-900 px-2 py-1"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2">Supplier</th>
                      <th className="pb-2">Location</th>
                      <th className="pb-2">Category</th>
                      <th className="pb-2">Rating</th>
                      <th className="pb-2">Lead Time</th>
                      <th className="pb-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSuppliers.length > 0 ? (
                      filteredSuppliers.map((supplier) => (
                        <tr key={supplier.id} className="border-b">
                          <td className="py-2 font-medium">{supplier.name}</td>
                          <td className="py-2">{supplier.location}</td>
                          <td className="py-2">{supplier.category}</td>
                          <td className="py-2">
                            <div className="flex items-center">
                              <FiStar className={`${supplier.rating >= 4.5 ? 'text-yellow-500' : 'text-gray-400'} mr-1`} />
                              <span>{supplier.rating}</span>
                            </div>
                          </td>
                          <td className="py-2">{supplier.lead_time}</td>
                          <td className="py-2">
                            <button 
                              onClick={() => handleSupplierSelect(supplier.id)}
                              className="text-primary hover:underline mr-3"
                            >
                              View
                            </button>
                            <button className="text-gray-600 hover:underline">
                              Order
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-gray-500">
                          No suppliers found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Supplier Details */}
          <div id="supplier-details">
            <div className="card">
              <h2 className="text-xl font-bold mb-4">
                {selectedSupplier ? 'Supplier Details' : 'Select a Supplier'}
              </h2>
              
              {selectedSupplier ? (
                <div>
                  <div className="mb-4 pb-4 border-b">
                    <h3 className="text-lg font-medium mb-1">{selectedSupplier.name}</h3>
                    <p className="text-gray-600 flex items-center gap-1">
                      <FiGlobe size={14} /> {selectedSupplier.location} • {selectedSupplier.category}
                    </p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-1">
                        <FiStar size={14} /> Rating:
                      </span>
                      <span className="font-medium flex items-center">
                        <span className={`${selectedSupplier.rating >= 4.5 ? 'text-yellow-500' : 'text-gray-400'} mr-1`}>★</span>
                        {selectedSupplier.rating}/5.0
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-1">
                        <FiClock size={14} /> Lead Time:
                      </span>
                      <span className="font-medium">{selectedSupplier.lead_time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-1">
                        <FiDollarSign size={14} /> Price Level:
                      </span>
                      <span className="font-medium">{selectedSupplier.price_level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-1">
                        <FiPackage size={14} /> Minimum Order:
                      </span>
                      <span className="font-medium">{selectedSupplier.min_order} units</span>
                    </div>
                  </div>
                  
                  {/* Risk Assessment */}
                  <div className="mb-6 p-3 rounded-lg bg-gray-50 border">
                    <h4 className="font-medium mb-2 flex items-center gap-1">
                      <FiInfo size={14} className="text-blue-500" /> Supplier Assessment
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Reliability Score:</span>
                          <span className="font-medium">{(selectedSupplier.rating / 5 * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div 
                            className={`h-1.5 rounded-full ${
                              selectedSupplier.rating >= 4.5 ? 'bg-green-500' : 
                              selectedSupplier.rating >= 4.0 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${(selectedSupplier.rating / 5 * 100).toFixed(0)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Shipping Speed:</span>
                          <span className="font-medium">
                            {selectedSupplier.lead_time.split('-')[0] <= '5' ? 'Fast' : 
                             selectedSupplier.lead_time.split('-')[0] <= '10' ? 'Medium' : 'Slow'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm mt-1">
                        <span className="font-medium text-blue-600">Tip:</span> {
                          selectedSupplier.rating >= 4.5 ? 
                            "High reliability - good for core product offerings." : 
                          selectedSupplier.rating >= 4.0 ?
                            "Moderate reliability - test with small orders first." :
                            "Lower reliability - consider alternative suppliers."
                        }
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button className="btn btn-primary w-full flex items-center justify-center gap-2">
                      <FiPackage size={16} /> Place Order
                    </button>
                    <button className="btn btn-outline w-full">Contact Supplier</button>
                    
                    <div className="text-center text-sm text-gray-500 pt-2">
                      <p>Last order: Never</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiInfo size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">Select a supplier from the list to view details and performance metrics.</p>
                </div>
              )}
            </div>
            
            {/* Educational Tips */}
            <div className="card mt-6">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <FiInfo className="text-blue-500" /> Supplier Management Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Always order samples before committing to bulk orders</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Establish communication protocols early to avoid misunderstandings</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Diversify your supplier base to mitigate supply chain risks</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Document all agreements, including pricing and shipping terms</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Build relationships with managers for better service and potential discounts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 