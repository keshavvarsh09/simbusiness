'use client';

import { useState, useEffect } from 'react';
import { FiTrendingUp, FiDollarSign, FiPackage, FiExternalLink, FiPlus, FiCheck, FiStar, FiUsers, FiShield } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getAuthHeaders } from '@/lib/auth';

export default function ProductRecommendationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [addingProducts, setAddingProducts] = useState<Set<number>>(new Set());
  const [addedProducts, setAddedProducts] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
      return;
    }
    fetchRecommendations();
  }, [router]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/products/recommendations', {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch recommendations');
        return;
      }

      const recs = Array.isArray(data.recommendations) 
        ? data.recommendations 
        : (data.recommendations?.recommendations || []);
      
      setRecommendations(recs);
    } catch (err) {
      setError('Failed to fetch recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToSimulation = async (product: any, index: number) => {
    if (addingProducts.has(index) || addedProducts.has(index)) return;

    setAddingProducts(prev => new Set(prev).add(index));

    try {
      const response = await fetch('/api/products/add', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: product.name,
          category: product.category,
          estimatedCost: product.estimatedCost || product.cost,
          sellingPrice: product.sellingPrice || product.price,
          moq: product.recommendedMOQ || product.moq || 1,
          vendorPlatform: 'alibaba',
          searchTerms: product.searchTerms || product.name,
          alibabaUrl: product.links?.alibaba,
          aliexpressUrl: product.links?.aliexpress,
          indiamartUrl: product.links?.indiamart
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show detailed error message if available
        const errorMsg = data.details 
          ? `${data.error}: ${data.details}` 
          : (data.error || 'Failed to add product');
        throw new Error(errorMsg);
      }

      setAddedProducts(prev => new Set(prev).add(index));
    } catch (err: any) {
      alert(err.message || 'Failed to add product to simulation');
    } finally {
      setAddingProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-green-500" />
            Product Recommendations
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <p>Loading recommendations...</p>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{rec.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 capitalize">{rec.category}</p>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Cost:</span>
                      <span className="font-bold">${rec.estimatedCost || rec.cost || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Selling Price:</span>
                      <span className="font-bold">${rec.sellingPrice || rec.price || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Profit Margin:</span>
                      <span className="font-bold text-green-600">
                        {rec.profitMargin ? `${rec.profitMargin}%` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">MOQ:</span>
                      <span className="font-bold">{rec.recommendedMOQ || rec.moq || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs capitalize ${
                      rec.demand === 'high' ? 'bg-green-100 text-green-700' :
                      rec.demand === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      Demand: {rec.demand || 'N/A'}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs capitalize ${
                      rec.competition === 'low' ? 'bg-green-100 text-green-700' :
                      rec.competition === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      Competition: {rec.competition || 'N/A'}
                    </span>
                  </div>

                  {/* Price Comparison */}
                  {rec.prices && (
                    <div className="mb-3 pt-3 border-t">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Price Comparison:</p>
                      <div className="space-y-1 text-xs">
                        {rec.prices.alibaba && rec.prices.alibaba.average > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Alibaba:</span>
                            <span className="font-semibold">
                              ${rec.prices.alibaba.average.toFixed(2)} {rec.prices.alibaba.currency}
                            </span>
                          </div>
                        )}
                        {rec.prices.aliexpress && rec.prices.aliexpress.average > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">AliExpress:</span>
                            <span className="font-semibold">
                              ${rec.prices.aliexpress.average.toFixed(2)} {rec.prices.aliexpress.currency}
                            </span>
                          </div>
                        )}
                        {rec.prices.indiamart && rec.prices.indiamart.average > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">IndiaMart:</span>
                            <span className="font-semibold">
                              ₹{rec.prices.indiamart.average.toFixed(0)} {rec.prices.indiamart.currency}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Supplier Details */}
                  {rec.suppliers && rec.suppliers.length > 0 && (
                    <div className="mb-3 pt-3 border-t">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Suppliers:</p>
                      <div className="space-y-2">
                        {rec.suppliers.map((supplier: any, sIdx: number) => (
                          <a
                            key={sIdx}
                            href={supplier.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-medium">{supplier.name}</span>
                                {supplier.verified && (
                                  <FiShield className="text-xs text-green-600" title="Verified" />
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <FiStar className="text-xs text-yellow-500 fill-yellow-500" />
                                <span className="text-xs font-semibold">{supplier.rating?.toFixed(1)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <FiUsers className="text-xs" />
                                <span>{supplier.reviews?.toLocaleString() || 0} reviews</span>
                              </div>
                              <span className="capitalize">{supplier.platform}</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {rec.reason && (
                    <p className="text-sm text-gray-600 mt-2 mb-3">{rec.reason}</p>
                  )}

                  {/* Product Image Links */}
                  {rec.imageLinks && (
                    <div className="mb-3 pt-3 border-t">
                      <p className="text-xs font-semibold text-gray-700 mb-2">View Product Images:</p>
                      <div className="flex flex-wrap gap-2">
                        {rec.imageLinks.alibaba && (
                          <a
                            href={rec.imageLinks.alibaba}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 flex items-center gap-1"
                          >
                            📷 Alibaba Images <FiExternalLink className="text-xs" />
                          </a>
                        )}
                        {rec.imageLinks.aliexpress && (
                          <a
                            href={rec.imageLinks.aliexpress}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-1"
                          >
                            📷 AliExpress Images <FiExternalLink className="text-xs" />
                          </a>
                        )}
                        {rec.imageLinks.indiamart && (
                          <a
                            href={rec.imageLinks.indiamart}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center gap-1"
                          >
                            📷 IndiaMart Images <FiExternalLink className="text-xs" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Product Links */}
                  {rec.links && (
                    <div className="mb-3 pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-2">Find on:</p>
                      <div className="flex flex-wrap gap-2">
                        {rec.links.alibaba && (
                          <a
                            href={rec.links.alibaba}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 flex items-center gap-1"
                          >
                            Alibaba <FiExternalLink className="text-xs" />
                          </a>
                        )}
                        {rec.links.aliexpress && (
                          <a
                            href={rec.links.aliexpress}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-1"
                          >
                            AliExpress <FiExternalLink className="text-xs" />
                          </a>
                        )}
                        {rec.links.indiamart && (
                          <a
                            href={rec.links.indiamart}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center gap-1"
                          >
                            IndiaMart <FiExternalLink className="text-xs" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Add to Simulation Button */}
                  <button
                    onClick={() => handleAddToSimulation(rec, idx)}
                    disabled={addingProducts.has(idx) || addedProducts.has(idx)}
                    className={`w-full py-2 px-4 rounded-md font-medium flex items-center justify-center gap-2 transition-colors ${
                      addedProducts.has(idx)
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : addingProducts.has(idx)
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {addedProducts.has(idx) ? (
                      <>
                        <FiCheck /> Added to Simulation
                      </>
                    ) : addingProducts.has(idx) ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Adding...
                      </>
                    ) : (
                      <>
                        <FiPlus /> Add to Simulation
                      </>
                    )}
                  </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recommendations available. Please set your budget and product genre in settings.</p>
          )}
        </div>
      </div>
    </div>
  );
}

