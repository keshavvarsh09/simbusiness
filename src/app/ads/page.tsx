'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiDollarSign, FiTarget, FiTrendingUp, FiBarChart, FiFacebook, FiSearch } from 'react-icons/fi';
import { getAuthHeaders, isAuthenticated } from '@/lib/auth';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function AdsPage() {
  const router = useRouter();
  const [platform, setPlatform] = useState<'meta' | 'google'>('meta');
  const [productInfo, setProductInfo] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [userProducts, setUserProducts] = useState<Array<{ id: number; name: string; cost: number; sellingPrice: number }>>([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
      return;
    }

    loadUserProducts();
  }, [router]);

  const loadUserProducts = async () => {
    try {
      const response = await fetch('/api/products/user-products', {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        setUserProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleGenerateStrategy = async () => {
    if (!productInfo || !budget || parseFloat(budget) <= 0) {
      setError('Please provide product information and a valid budget');
      return;
    }

    setLoading(true);
    setError(null);
    setStrategy(null);

    try {
      // Parse product info if it's JSON, otherwise use as string
      let productData: any;
      try {
        productData = JSON.parse(productInfo);
      } catch {
        // If not JSON, try to find matching product
        const matchingProduct = userProducts.find(p =>
          p.name.toLowerCase().includes(productInfo.toLowerCase())
        );
        if (matchingProduct) {
          productData = {
            name: matchingProduct.name,
            cost: matchingProduct.cost,
            sellingPrice: matchingProduct.sellingPrice,
            category: 'general'
          };
        } else {
          productData = { name: productInfo, description: productInfo };
        }
      }

      const endpoint = platform === 'meta'
        ? '/api/ads/meta-strategy'
        : '/api/ads/google-strategy';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productInfo: productData,
          budget: parseFloat(budget)
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Ensure strategy is properly formatted
        let formattedStrategy = data.strategy;
        if (typeof formattedStrategy === 'string') {
          formattedStrategy = { detailedStrategy: formattedStrategy };
        }
        setStrategy(formattedStrategy);
      } else {
        const errorMsg = data.details
          ? `${data.error}: ${data.details}`
          : (data.error || 'Failed to generate strategy');
        setError(errorMsg);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to generate strategy');
    } finally {
      setLoading(false);
    }
  };

  const selectProduct = (product: any) => {
    setProductInfo(JSON.stringify({
      name: product.name,
      cost: product.cost,
      sellingPrice: product.sellingPrice,
      category: 'general'
    }, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <FiTarget className="text-blue-600" />
          Advertising Strategy Generator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Generate Strategy</h2>

              {/* Platform Selection */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Platform
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPlatform('meta')}
                    className={`flex-1 px-4 py-2 rounded-md font-medium ${platform === 'meta'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    <FiFacebook className="inline mr-2" />
                    Meta (Facebook/Instagram)
                  </button>
                  <button
                    onClick={() => setPlatform('google')}
                    className={`flex-1 px-4 py-2 rounded-md font-medium ${platform === 'google'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    <FiSearch className="inline mr-2" />
                    Google Ads
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Information
                </label>
                {userProducts.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-600 mb-1">Quick Select:</p>
                    <div className="flex flex-wrap gap-2">
                      {userProducts.slice(0, 3).map((product) => (
                        <button
                          key={product.id}
                          onClick={() => selectProduct(product)}
                          className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                        >
                          {product.name.substring(0, 20)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <textarea
                  value={productInfo}
                  onChange={(e) => setProductInfo(e.target.value)}
                  placeholder='Enter product info as JSON: {"name": "Product Name", "cost": 10, "sellingPrice": 30, "category": "electronics"}'
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Or enter product name to auto-fill from your products
                </p>
              </div>

              {/* Budget */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Budget ($)
                </label>
                <div className="relative">
                  <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Enter budget"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateStrategy}
                disabled={loading || !productInfo || !budget}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FiTrendingUp />
                    Generate Strategy
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Strategy Results */}
          <div className="lg:col-span-2">
            {strategy ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiBarChart className="text-green-600" />
                  {platform === 'meta' ? 'Meta Ads Strategy' : 'Google Ads Strategy'}
                </h2>

                {strategy.detailedStrategy ? (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                      {strategy.detailedStrategy}
                    </pre>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {strategy.campaignStructure && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Campaign Structure</h3>
                        <p className="text-gray-700">{strategy.campaignStructure}</p>
                      </div>
                    )}

                    {strategy.targetAudience && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Target Audience</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Demographics:</strong> {strategy.targetAudience.demographics}
                          </p>
                          {strategy.targetAudience.interests && (
                            <p className="text-sm text-gray-700 mt-2">
                              <strong>Interests:</strong> {strategy.targetAudience.interests.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {strategy.budgetAllocation && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Budget Allocation</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Daily Budget:</strong> ${strategy.budgetAllocation.dailyBudget}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">
                            <strong>Campaign Duration:</strong> {strategy.budgetAllocation.campaignDuration} days
                          </p>
                        </div>
                      </div>
                    )}

                    {strategy.optimizationTips && strategy.optimizationTips.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Optimization Tips</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {strategy.optimizationTips.map((tip: string, idx: number) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {strategy.expectedResults && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Expected Results</h3>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                          <div>
                            <p className="text-sm text-gray-600">Impressions</p>
                            <p className="text-lg font-bold">{strategy.expectedResults.impressions?.toLocaleString() || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Clicks</p>
                            <p className="text-lg font-bold">{strategy.expectedResults.clicks?.toLocaleString() || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Conversions</p>
                            <p className="text-lg font-bold">{strategy.expectedResults.conversions?.toLocaleString() || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">ROAS</p>
                            <p className="text-lg font-bold">{strategy.expectedResults.roas || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {strategy.detailedStrategy && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Detailed Strategy</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{strategy.detailedStrategy}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FiTarget className="mx-auto text-gray-400 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Strategy Generated Yet</h3>
                <p className="text-gray-500">
                  Fill in the form on the left and click &quot;Generate Strategy&quot; to get AI-powered advertising recommendations.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

