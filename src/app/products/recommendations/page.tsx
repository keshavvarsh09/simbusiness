'use client';

import { useState, useEffect } from 'react';
import { FiTrendingUp, FiDollarSign, FiPackage, FiExternalLink, FiPlus, FiCheck, FiStar, FiUsers, FiShield, FiSettings, FiChevronDown } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getAuthHeaders } from '@/lib/auth';

export default function ProductRecommendationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [addingProducts, setAddingProducts] = useState<Set<number>>(new Set());
  const [addedProducts, setAddedProducts] = useState<Set<number>>(new Set());
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [userProfile, setUserProfile] = useState<{ budget?: number; productGenre?: string } | null>(null);
  const [showGenreModal, setShowGenreModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [customBudget, setCustomBudget] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
      return;
    }
    loadUserProfile();
    fetchRecommendations();
  }, [router]);

  const loadUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserProfile({
            budget: parseFloat(data.budget || 0),
            productGenre: data.product_genre || data.productGenre
          });
          setSelectedGenre(data.product_genre || data.productGenre || '');
        }
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const fetchRecommendations = async (reset: boolean = false) => {
    if (reset) {
      setLoading(true);
      setOffset(0);
    } else {
      setLoadingMore(true);
    }
    setError('');

    try {
      const currentOffset = reset ? 0 : offset;
      const response = await fetch(`/api/products/recommendations?limit=10&offset=${currentOffset}`, {
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
      
      if (reset) {
        setRecommendations(recs);
      } else {
        setRecommendations(prev => [...prev, ...recs]);
      }
      
      setHasMore(data.pagination?.hasMore || false);
      setOffset(currentOffset + recs.length);
    } catch (err) {
      setError('Failed to fetch recommendations. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSeeMore = () => {
    fetchRecommendations(false);
  };

  const handleUpdateGenre = async () => {
    if (!selectedGenre) {
      alert('Please select a product genre');
      return;
    }

    try {
      const updateData: any = { productGenre: selectedGenre };
      if (customBudget) {
        updateData.budget = parseFloat(customBudget);
      }

      const response = await fetch('/api/user/update-interests', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update interests');
      }

      // Update local state
      setUserProfile(prev => ({
        ...prev,
        productGenre: selectedGenre,
        budget: customBudget ? parseFloat(customBudget) : prev?.budget
      }));

      setShowGenreModal(false);
      
      // Refresh recommendations with new genre
      fetchRecommendations(true);
      
      alert('Product genre updated! Loading new recommendations...');
    } catch (err: any) {
      alert(err.message || 'Failed to update product genre');
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
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FiTrendingUp className="text-green-500" />
              Product Recommendations
            </h1>
            <div className="flex items-center gap-3">
              {userProfile && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Genre:</span> {userProfile.productGenre || 'Not set'} | 
                  <span className="font-medium ml-2">Budget:</span> ${userProfile.budget || 0}
                </div>
              )}
              <button
                onClick={() => setShowGenreModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm"
              >
                <FiSettings /> Change Interest
              </button>
            </div>
          </div>

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

                  {/* Product Image */}
                  {rec.imageUrl && (
                    <div className="mb-3">
                      <img 
                        src={rec.imageUrl} 
                        alt={rec.name}
                        className="w-full h-48 object-cover rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Real Scraped Products from Web */}
                  {rec.scrapedProducts && rec.scrapedProducts.length > 0 && (
                    <div className="mb-3 pt-3 border-t">
                      <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        🌐 Real Products Found ({rec.scrapedProducts.length}):
                        {rec.hasRealData && (
                          <span className="text-green-600 text-xs">✓ Live Data</span>
                        )}
                      </p>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {rec.scrapedProducts.slice(0, 5).map((scraped: any, sIdx: number) => (
                          <a
                            key={sIdx}
                            href={scraped.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors border border-gray-200"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-gray-800 truncate">
                                  {scraped.title || scraped.name}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {scraped.supplier || 'Supplier'}
                                  {scraped.rating && (
                                    <span className="ml-2">
                                      ⭐ {scraped.rating.toFixed(1)}
                                      {scraped.reviews && ` (${scraped.reviews})`}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right ml-2">
                                {scraped.price > 0 && (
                                  <div className="text-xs font-bold text-green-600">
                                    ${scraped.price.toFixed(2)}
                                  </div>
                                )}
                                {scraped.moq > 1 && (
                                  <div className="text-xs text-gray-500">
                                    MOQ: {scraped.moq}
                                  </div>
                                )}
                              </div>
                            </div>
                            {scraped.imageUrl && (
                              <img 
                                src={scraped.imageUrl} 
                                alt={scraped.title}
                                className="w-full h-20 object-cover rounded mt-2"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            )}
                          </a>
                        ))}
                      </div>
                      {rec.scrapedProducts.length > 5 && (
                        <p className="text-xs text-gray-500 mt-2">
                          + {rec.scrapedProducts.length - 5} more products found
                        </p>
                      )}
                    </div>
                  )}

                  {/* Product Image Links */}
                  {rec.imageLinks && (
                    <div className="mb-3 pt-3 border-t">
                      <p className="text-xs font-semibold text-gray-700 mb-2">View More Products:</p>
                      <div className="flex flex-wrap gap-2">
                        {rec.imageLinks.alibaba && (
                          <a
                            href={rec.imageLinks.alibaba}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 flex items-center gap-1"
                          >
                            📷 Alibaba <FiExternalLink className="text-xs" />
                          </a>
                        )}
                        {rec.imageLinks.aliexpress && (
                          <a
                            href={rec.imageLinks.aliexpress}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-1"
                          >
                            📷 AliExpress <FiExternalLink className="text-xs" />
                          </a>
                        )}
                        {rec.imageLinks.indiamart && (
                          <a
                            href={rec.imageLinks.indiamart}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center gap-1"
                          >
                            📷 IndiaMart <FiExternalLink className="text-xs" />
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

          {/* See More Button */}
          {!loading && recommendations.length > 0 && hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={handleSeeMore}
                disabled={loadingMore}
                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <FiChevronDown /> See More Recommendations
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Change Interest Modal */}
      {showGenreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-2xl font-bold mb-4">Change Product Interest</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="productGenre" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Genre/Category
                </label>
                <select
                  id="productGenre"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion & Apparel</option>
                  <option value="home">Home & Kitchen</option>
                  <option value="beauty">Beauty & Personal Care</option>
                  <option value="sports">Sports & Outdoors</option>
                  <option value="toys">Toys & Games</option>
                  <option value="books">Books & Media</option>
                  <option value="health">Health & Wellness</option>
                  <option value="automotive">Automotive</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="customBudget" className="block text-sm font-medium text-gray-700 mb-2">
                  Budget (Optional - leave empty to keep current)
                </label>
                <input
                  type="number"
                  id="customBudget"
                  value={customBudget}
                  onChange={(e) => setCustomBudget(e.target.value)}
                  placeholder={userProfile?.budget?.toString() || 'Enter budget'}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateGenre}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update & Refresh
              </button>
              <button
                onClick={() => {
                  setShowGenreModal(false);
                  setCustomBudget('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

