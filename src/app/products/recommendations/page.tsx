'use client';

import { useState, useEffect } from 'react';
import { FiTrendingUp, FiDollarSign, FiPackage, FiExternalLink, FiPlus, FiCheck, FiStar, FiUsers, FiShield, FiSettings, FiChevronDown, FiFilter } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getAuthHeaders } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-display-3 font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-accent-50 flex items-center justify-center">
                <FiTrendingUp className="text-accent-600 text-2xl" />
              </div>
              AI Recommendations
            </h1>
            <p className="text-body text-gray-600">Curated product ideas based on your interests and market trends</p>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-apple border border-gray-100">
            {userProfile && (
              <div className="hidden sm:block px-3 text-sm text-gray-600 border-r border-gray-200">
                <span className="font-medium text-gray-900">{userProfile.productGenre || 'All Genres'}</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="font-medium text-gray-900">${userProfile.budget || 0}</span> Budget
              </div>
            )}
            <button
              onClick={() => setShowGenreModal(true)}
              className="btn btn-secondary text-sm py-2 px-4 flex items-center gap-2"
            >
              <FiSettings className="text-gray-500" /> Preferences
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card h-96 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="card card-hover flex flex-col h-full"
              >
                {/* Product Image */}
                <div className="relative h-48 mb-4 bg-gray-50 rounded-xl overflow-hidden group">
                  {rec.imageUrl ? (
                    <img
                      src={rec.imageUrl}
                      alt={rec.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <FiPackage size={48} />
                    </div>
                  )}

                  <div className="absolute top-2 right-2 flex gap-1">
                    <span className={`badge ${rec.demand === 'high' ? 'badge-success' :
                        rec.demand === 'medium' ? 'badge-warning' : 'badge-danger'
                      }`}>
                      {rec.demand} demand
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-title-3 font-bold text-gray-900 mb-1 line-clamp-1" title={rec.name}>{rec.name}</h3>
                    <p className="text-sm text-gray-500 capitalize flex items-center gap-1">
                      <FiPackage size={14} /> {rec.category}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Cost</p>
                      <p className="font-semibold text-gray-900">${rec.estimatedCost || rec.cost || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Selling Price</p>
                      <p className="font-semibold text-gray-900">${rec.sellingPrice || rec.price || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Margin</p>
                      <p className="font-bold text-green-600">{rec.profitMargin ? `${rec.profitMargin}%` : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">MOQ</p>
                      <p className="font-semibold text-gray-900">{rec.recommendedMOQ || rec.moq || 'N/A'}</p>
                    </div>
                  </div>

                  {rec.reason && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{rec.reason}</p>
                  )}

                  {/* Real Scraped Products Preview */}
                  {rec.scrapedProducts && rec.scrapedProducts.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Found Online</p>
                      <div className="flex -space-x-2 overflow-hidden">
                        {rec.scrapedProducts.slice(0, 4).map((prod: any, i: number) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden" title={prod.title}>
                            {prod.imageUrl ? (
                              <img src={prod.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">{i + 1}</div>
                            )}
                          </div>
                        ))}
                        {rec.scrapedProducts.length > 4 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                            +{rec.scrapedProducts.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                    <button
                      onClick={() => handleAddToSimulation(rec, idx)}
                      disabled={addingProducts.has(idx) || addedProducts.has(idx)}
                      className={`flex-1 btn text-sm py-2.5 flex items-center justify-center gap-2 ${addedProducts.has(idx)
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : addingProducts.has(idx)
                            ? 'bg-gray-100 text-gray-400'
                            : 'btn-primary'
                        }`}
                    >
                      {addedProducts.has(idx) ? (
                        <>
                          <FiCheck /> Added
                        </>
                      ) : addingProducts.has(idx) ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div> Adding...
                        </>
                      ) : (
                        <>
                          <FiPlus /> Add to Sim
                        </>
                      )}
                    </button>

                    {/* External Links Dropdown Trigger could go here */}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 card bg-gray-50 border-dashed border-2 border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiPackage className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-title-2 font-bold text-gray-900 mb-2">No recommendations found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">Try adjusting your preferences to see new product ideas.</p>
            <button
              onClick={() => setShowGenreModal(true)}
              className="btn btn-primary"
            >
              <FiSettings className="mr-2" /> Update Preferences
            </button>
          </div>
        )}

        {/* See More Button */}
        {!loading && recommendations.length > 0 && hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={handleSeeMore}
              disabled={loadingMore}
              className="btn btn-secondary px-8 py-3"
            >
              {loadingMore ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Loading More...
                </>
              ) : (
                <>
                  <FiChevronDown className="mr-2" /> Load More Ideas
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Change Interest Modal */}
      <AnimatePresence>
        {showGenreModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setShowGenreModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-apple-xl w-full max-w-md p-6 relative z-10"
            >
              <h2 className="text-title-2 font-bold mb-6">Customize Recommendations</h2>

              <div className="space-y-5">
                <div>
                  <label htmlFor="productGenre" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Category
                  </label>
                  <div className="relative">
                    <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      id="productGenre"
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                      className="input pl-10"
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
                </div>

                <div>
                  <label htmlFor="customBudget" className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Limit
                  </label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      id="customBudget"
                      value={customBudget}
                      onChange={(e) => setCustomBudget(e.target.value)}
                      placeholder={userProfile?.budget?.toString() || 'Enter budget'}
                      min="0"
                      step="0.01"
                      className="input pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Leave empty to keep current budget</p>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setShowGenreModal(false);
                    setCustomBudget('');
                  }}
                  className="flex-1 btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateGenre}
                  className="flex-1 btn btn-primary"
                >
                  Update Results
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
