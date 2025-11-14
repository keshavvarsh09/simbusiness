'use client';

import { useState, useEffect } from 'react';
import { FiTrendingUp, FiDollarSign, FiPackage, FiExternalLink, FiPlus, FiCheck } from 'react-icons/fi';
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
        throw new Error(data.error || 'Failed to add product');
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
                <div key={idx} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-lg mb-2">{rec.name}</h3>
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

                  {rec.reason && (
                    <p className="text-sm text-gray-600 mt-2 mb-3">{rec.reason}</p>
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

