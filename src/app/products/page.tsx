'use client';

import { useState, useEffect } from 'react';
import { FiBox, FiDollarSign, FiTag, FiStar, FiFilter, FiAlertCircle, FiPlus, FiTrendingUp, FiCheck, FiBarChart, FiImage, FiExternalLink } from 'react-icons/fi';
import { Product } from '@/types';
import { getAuthHeaders } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import Breadcrumbs from '@/components/Breadcrumbs';
import { motion } from 'framer-motion';
import { ProductCardSkeleton } from '@/components/SkeletonLoader';
import AddProductForm from '@/components/AddProductForm';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [simulating, setSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [loadingPerformance, setLoadingPerformance] = useState<Set<string>>(new Set());
  const [productPerformances, setProductPerformances] = useState<Record<string, any>>({});
  const [addingToDashboard, setAddingToDashboard] = useState(false);
  const [activeProducts, setActiveProducts] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
      return;
    }

    loadProducts();
  }, [router]);

  useEffect(() => {
    if (selectedCategory) {
      loadProducts();
    }
  }, [selectedCategory]);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const categoryParam = selectedCategory && selectedCategory !== 'all'
        ? `?category=${encodeURIComponent(selectedCategory)}`
        : '';

      const response = await fetch(`/api/products/list${categoryParam}`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load products');
      }

      if (data.success) {
        setProducts(data.products || []);
        setCategories(data.categories || []);

        // Track which products are active in dashboard
        const activeSet = new Set<string>(
          (data.products || [])
            .filter((p: any) => p.activeInDashboard !== false)
            .map((p: any) => p.id as string)
        );
        setActiveProducts(activeSet);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Error loading products:', err);
      setError(err.message || 'Failed to load products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const selectAllProducts = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(products.map(p => p.id)));
    }
  };

  const handleSimulateProducts = async () => {
    if (selectedProducts.size === 0) {
      alert('Please select at least one product to simulate');
      return;
    }

    setSimulating(true);
    try {
      const response = await fetch('/api/products/simulate', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          productIds: Array.from(selectedProducts).map(id => id.replace('P', '')),
          days: 30,
          marketingBudget: 0
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSimulationResults(data);
      } else {
        alert(data.error || 'Failed to simulate products');
      }
    } catch (error: any) {
      alert('Failed to simulate products: ' + error.message);
    } finally {
      setSimulating(false);
    }
  };

  const loadProductPerformance = async (productId: string) => {
    if (productPerformances[productId]) return; // Already loaded

    setLoadingPerformance(prev => new Set(prev).add(productId));
    try {
      const response = await fetch('/api/products/performance', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          productIds: [productId.replace('P', '')]
        }),
      });

      const data = await response.json();
      if (data.success && data.analyses.length > 0) {
        setProductPerformances(prev => ({
          ...prev,
          [productId]: data.analyses[0]
        }));
      }
    } catch (error) {
      console.error('Failed to load product performance:', error);
    } finally {
      setLoadingPerformance(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleAddToDashboard = async () => {
    if (selectedProducts.size === 0) {
      alert('Please select at least one product to add to dashboard');
      return;
    }

    setAddingToDashboard(true);
    try {
      const response = await fetch('/api/products/toggle-dashboard', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          productIds: Array.from(selectedProducts),
          active: true
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if it's a "table does not exist" error and offer to initialize database
        if (data.error?.includes('Table does not exist') || data.error?.includes('does not exist')) {
          const shouldInit = confirm(
            `${data.error}\n\n${data.hint || 'Would you like to initialize the database now? This will create all required tables.'}`
          );

          if (shouldInit) {
            try {
              setAddingToDashboard(true);
              const initResponse = await fetch('/api/init-db', {
                method: 'GET',
                headers: getAuthHeaders(),
              });

              const initData = await initResponse.json();

              if (initData.success) {
                alert('Database initialized successfully! Please try adding products to dashboard again.');
                // Retry the original operation
                setAddingToDashboard(false);
                return handleAddToDashboard();
              } else {
                alert(`Database initialization failed: ${initData.error || initData.details || 'Unknown error'}`);
              }
            } catch (initError: any) {
              alert(`Failed to initialize database: ${initError.message}`);
            } finally {
              setAddingToDashboard(false);
            }
          }
          return;
        }

        // Check if it's a schema error and offer to run migration
        if (data.error?.includes('schema') || data.error?.includes('column') || data.migrationEndpoint) {
          const shouldMigrate = confirm(
            `${data.error}: ${data.details || ''}\n\n${data.hint || 'Would you like to run the database migration now?'}`
          );

          if (shouldMigrate) {
            try {
              const migrateResponse = await fetch('/api/migrate', {
                method: 'POST',
                headers: getAuthHeaders(),
              });

              const migrateData = await migrateResponse.json();

              if (migrateData.success) {
                alert('Migration successful! Please try adding products to dashboard again.');
                // Retry the original operation
                return handleAddToDashboard();
              } else {
                alert(`Migration failed: ${migrateData.error || migrateData.details || 'Unknown error'}`);
              }
            } catch (migrateError: any) {
              alert(`Failed to run migration: ${migrateError.message}`);
            }
          }
          return;
        }

        // Show detailed error message if available
        const errorMsg = data.details
          ? `${data.error}: ${data.details}`
          : (data.error || 'Failed to add products to dashboard');
        if (data.hint) {
          alert(`${errorMsg}\n\n${data.hint}`);
        } else {
          alert(errorMsg);
        }
        return;
      }

      if (data.success) {
        // Update active products set
        setActiveProducts(prev => {
          const newSet = new Set(prev);
          selectedProducts.forEach(id => newSet.add(id));
          return newSet;
        });
        alert(`${data.updated} product(s) added to dashboard! They will now be used in revenue calculations.`);
      } else {
        const errorMsg = data.details
          ? `${data.error}: ${data.details}`
          : (data.error || 'Failed to add products to dashboard');
        alert(errorMsg);
      }
    } catch (error: any) {
      alert('Failed to add products to dashboard: ' + error.message);
    } finally {
      setAddingToDashboard(false);
    }
  };

  const handleRemoveFromDashboard = async () => {
    if (selectedProducts.size === 0) {
      alert('Please select at least one product to remove from dashboard');
      return;
    }

    setAddingToDashboard(true);
    try {
      const response = await fetch('/api/products/toggle-dashboard', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          productIds: Array.from(selectedProducts),
          active: false
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if it's a "table does not exist" error and offer to initialize database
        if (data.error?.includes('Table does not exist') || data.error?.includes('does not exist')) {
          const shouldInit = confirm(
            `${data.error}\n\n${data.hint || 'Would you like to initialize the database now? This will create all required tables.'}`
          );

          if (shouldInit) {
            try {
              setAddingToDashboard(true);
              const initResponse = await fetch('/api/init-db', {
                method: 'GET',
                headers: getAuthHeaders(),
              });

              const initData = await initResponse.json();

              if (initData.success) {
                alert('Database initialized successfully! Please try removing products from dashboard again.');
                // Retry the original operation
                setAddingToDashboard(false);
                return handleRemoveFromDashboard();
              } else {
                alert(`Database initialization failed: ${initData.error || initData.details || 'Unknown error'}`);
              }
            } catch (initError: any) {
              alert(`Failed to initialize database: ${initError.message}`);
            } finally {
              setAddingToDashboard(false);
            }
          }
          return;
        }

        // Check if it's a schema error and offer to run migration
        if (data.error?.includes('schema') || data.error?.includes('column') || data.migrationEndpoint) {
          const shouldMigrate = confirm(
            `${data.error}: ${data.details || ''}\n\n${data.hint || 'Would you like to run the database migration now?'}`
          );

          if (shouldMigrate) {
            try {
              const migrateResponse = await fetch('/api/migrate', {
                method: 'POST',
                headers: getAuthHeaders(),
              });

              const migrateData = await migrateResponse.json();

              if (migrateData.success) {
                alert('Migration successful! Please try removing products from dashboard again.');
                // Retry the original operation
                return handleRemoveFromDashboard();
              } else {
                alert(`Migration failed: ${migrateData.error || migrateData.details || 'Unknown error'}`);
              }
            } catch (migrateError: any) {
              alert(`Failed to run migration: ${migrateError.message}`);
            }
          }
          return;
        }

        // Show detailed error message if available
        const errorMsg = data.details
          ? `${data.error}: ${data.details}`
          : (data.error || 'Failed to remove products from dashboard');
        if (data.hint) {
          alert(`${errorMsg}\n\n${data.hint}`);
        } else {
          alert(errorMsg);
        }
        return;
      }

      if (data.success) {
        // Update active products set
        setActiveProducts(prev => {
          const newSet = new Set(prev);
          selectedProducts.forEach(id => newSet.delete(id));
          return newSet;
        });
        alert(`${data.updated} product(s) removed from dashboard.`);
      } else {
        const errorMsg = data.details
          ? `${data.error}: ${data.details}`
          : (data.error || 'Failed to remove products from dashboard');
        alert(errorMsg);
      }
    } catch (error: any) {
      alert('Failed to remove products from dashboard: ' + error.message);
    } finally {
      setAddingToDashboard(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Breadcrumbs />

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-display-3 font-bold text-gray-900 mb-2">Product Catalog</h1>
            <p className="text-body text-gray-600">Manage and analyze your product portfolio</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <AddProductForm onSuccess={loadProducts} />
            <button
              onClick={() => router.push('/products/analyze')}
              className="btn btn-primary flex items-center gap-2"
            >
              <FiPlus /> Analyze Product
            </button>
            <button
              onClick={() => router.push('/products/recommendations')}
              className="btn btn-accent flex items-center gap-2"
            >
              <FiTrendingUp /> Get Recommendations
            </button>
          </div>
        </div>

        {/* Info banner */}
        <div className="mb-8 card bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200/50">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                <FiAlertCircle className="text-primary-600" size={20} />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-body text-gray-700">
                <strong className="text-gray-900">Your Products:</strong> This shows products you&apos;ve analyzed or added from recommendations.
                {products.length === 0 && (
                  <span className="ml-2">
                    <a href="/products/analyze" className="text-primary-600 hover:text-primary-700 font-medium">Analyze your first product</a> or
                    <a href="/products/recommendations" className="text-primary-600 hover:text-primary-700 font-medium ml-1">get AI recommendations</a>.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FiFilter className="text-gray-500" size={18} />
              <h3 className="text-title-3 font-semibold text-gray-900">Filter by Category</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 text-sm rounded-xl font-medium transition-all ${selectedCategory === 'all' || !selectedCategory
                  ? 'bg-primary-600 text-white shadow-apple'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
              >
                All Products
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 text-sm rounded-xl font-medium transition-all ${selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-apple'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading and error states */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-10">
            <div className="text-red-600">{error}</div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-20 card bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <FiBox className="text-gray-400" size={40} />
            </div>
            <h3 className="text-title-1 font-bold text-gray-900 mb-3">No Products Yet</h3>
            <p className="text-body text-gray-600 mb-8 max-w-md mx-auto">
              Start building your product catalog by analyzing products or getting AI recommendations.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => router.push('/products/analyze')}
                className="btn btn-primary flex items-center gap-2"
              >
                <FiPlus /> Analyze Product
              </button>
              <button
                onClick={() => router.push('/products/recommendations')}
                className="btn btn-accent flex items-center gap-2"
              >
                <FiStar /> Get Recommendations
              </button>
            </div>
          </div>
        )}

        {/* Selection and Dashboard Controls */}
        {!isLoading && !error && products.length > 0 && (
          <div className="mb-8 card">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={selectAllProducts}
                  className="btn btn-secondary text-sm flex items-center gap-2"
                >
                  <FiCheck />
                  {selectedProducts.size === products.length ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-body text-gray-600">
                  {selectedProducts.size} of {products.length} selected
                </span>
                <span className="badge badge-primary">
                  {activeProducts.size} active in dashboard
                </span>
              </div>
              {selectedProducts.size > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleAddToDashboard}
                    disabled={addingToDashboard}
                    className="btn btn-accent text-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    <FiPlus />
                    {addingToDashboard ? 'Adding...' : 'Add to Dashboard'}
                  </button>
                  <button
                    onClick={handleRemoveFromDashboard}
                    disabled={addingToDashboard}
                    className="btn bg-red-50 text-red-600 hover:bg-red-100 text-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    Remove from Dashboard
                  </button>
                  <button
                    onClick={handleSimulateProducts}
                    disabled={simulating}
                    className="btn btn-primary text-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    <FiBarChart />
                    {simulating ? 'Simulating...' : 'Simulate'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Product grid */}
        {!isLoading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selectedProducts.has(product.id)}
                onSelect={() => toggleProductSelection(product.id)}
                performance={productPerformances[product.id]}
                loadingPerformance={loadingPerformance.has(product.id)}
                onLoadPerformance={() => loadProductPerformance(product.id)}
                isActiveInDashboard={activeProducts.has(product.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

interface ProductCardProps {
  product: Product & { moq?: number; vendorName?: string; vendorPlatform?: string; sourceUrl?: string; activeInDashboard?: boolean };
  isSelected?: boolean;
  onSelect?: () => void;
  performance?: any;
  loadingPerformance?: boolean;
  onLoadPerformance?: () => void;
  isActiveInDashboard?: boolean;
}

function ProductCard({ product, isSelected = false, onSelect, performance, loadingPerformance, onLoadPerformance, isActiveInDashboard = false }: ProductCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(product.imageUrl || null);
  const [imageLoading, setImageLoading] = useState(!product.imageUrl && !!product.sourceUrl);
  const [showImageLinks, setShowImageLinks] = useState(false);

  useEffect(() => {
    // Try to fetch image from source URL
    if (!imageUrl && product.sourceUrl) {
      // For Alibaba/AliExpress/IndiaMart, show link button instead of fetching
      if (product.sourceUrl.includes('alibaba.com') ||
        product.sourceUrl.includes('aliexpress.com') ||
        product.sourceUrl.includes('indiamart.com')) {
        setImageLoading(false);
        return;
      }

      // Try fetching via API for other URLs
      fetch(`/api/products/fetch-image?url=${encodeURIComponent(product.sourceUrl)}`)
        .then(res => res.json())
        .then(data => {
          if (data.imageUrl && !data.imageUrl.includes('placeholder')) {
            setImageUrl(data.imageUrl);
          }
        })
        .catch(err => {
          console.error('Error fetching product image:', err);
        })
        .finally(() => {
          setImageLoading(false);
        });
    } else if (!product.sourceUrl) {
      setImageLoading(false);
    }
  }, [product.sourceUrl, imageUrl]);

  const profitMargin = product.potentialPrice > 0
    ? (((product.potentialPrice - product.cost) / product.potentialPrice) * 100).toFixed(0)
    : '0';

  const getPerformanceColor = (perf?: string) => {
    switch (perf) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`card card-hover overflow-hidden relative group ${isSelected ? 'ring-2 ring-primary-500' : ''} ${isActiveInDashboard ? 'border-l-4 border-l-accent-500' : ''}`}>
      {/* Selection Checkbox */}
      {onSelect && (
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
              ? 'bg-primary-500 border-primary-500 text-white scale-110'
              : 'bg-white/80 backdrop-blur-sm border-gray-300 hover:border-primary-500'
              }`}
          >
            {isSelected && <FiCheck size={14} />}
          </button>
        </div>
      )}

      {/* Active in Dashboard Badge */}
      {isActiveInDashboard && (
        <div className="absolute top-3 left-3 z-10">
          <span className="badge badge-success shadow-sm backdrop-blur-md bg-white/90">
            Active
          </span>
        </div>
      )}

      <div className="bg-gray-50 h-48 flex items-center justify-center relative p-4 group-hover:bg-gray-100/50 transition-colors duration-300">
        {imageLoading ? (
          <div className="animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
            onError={() => {
              setImageUrl(null);
              setImageLoading(false);
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              <FiBox size={32} className="text-gray-400" />
            </div>
            {product.sourceUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowImageLinks(!showImageLinks);
                }}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 mt-2"
              >
                <FiImage size={12} />
                View Images
              </button>
            )}
          </div>
        )}

        {/* Image Links Dropdown */}
        {showImageLinks && product.sourceUrl && (
          <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-xl p-2 rounded-xl shadow-apple-lg border border-gray-100 z-20">
            <div className="flex flex-wrap gap-2 justify-center">
              {product.sourceUrl.includes('alibaba') && (
                <a
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-2.5 py-1.5 bg-[#FF6A00] text-white rounded-lg hover:bg-[#E65F00] flex items-center gap-1.5 transition-colors font-medium w-full justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiExternalLink size={12} /> Alibaba
                </a>
              )}
              {product.sourceUrl.includes('aliexpress') && (
                <a
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-2.5 py-1.5 bg-[#FF4747] text-white rounded-lg hover:bg-[#E63E3E] flex items-center gap-1.5 transition-colors font-medium w-full justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiExternalLink size={12} /> AliExpress
                </a>
              )}
              {product.sourceUrl.includes('indiamart') && (
                <a
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-2.5 py-1.5 bg-[#2E3192] text-white rounded-lg hover:bg-[#26287A] flex items-center gap-1.5 transition-colors font-medium w-full justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiExternalLink size={12} /> IndiaMart
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-title-3 font-semibold text-gray-900 mb-1 truncate leading-tight" title={product.name}>{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <FiStar size={12} className="text-yellow-400 fill-current" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Cost</p>
              <p className="text-body font-semibold text-gray-900">${product.cost.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-0.5">Potential</p>
              <p className="text-body font-bold text-primary-600">${product.potentialPrice.toFixed(2)}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
            <span className={`text-xs font-medium px-2 py-1 rounded-lg ${Number(profitMargin) > 50 ? 'bg-green-50 text-green-700' :
              Number(profitMargin) > 30 ? 'bg-blue-50 text-blue-700' :
                'bg-gray-50 text-gray-700'
              }`}>
              {profitMargin}% Margin
            </span>

            {product.sourceUrl && (
              <a
                href={product.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-600 transition-colors p-1"
                onClick={(e) => e.stopPropagation()}
                title="View Source"
              >
                <FiExternalLink size={16} />
              </a>
            )}
          </div>
        </div>

        {/* AI Performance Analysis */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          {performance ? (
            <div className="space-y-2">
              <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getPerformanceColor(performance.performance)}`}>
                {performance.performance?.toUpperCase() || 'MODERATE'}
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">{performance.description}</p>
              {performance.strengths && performance.strengths.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-green-700 mb-1">Strengths:</p>
                  <ul className="text-xs text-gray-600 list-disc list-inside">
                    {performance.strengths.slice(0, 2).map((s: string, i: number) => (
                      <li key={i} className="truncate">{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : onLoadPerformance ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLoadPerformance();
              }}
              disabled={loadingPerformance}
              className="w-full text-xs px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
            >
              {loadingPerformance ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <FiBarChart size={12} />
                  Get AI Analysis
                </>
              )}
            </button>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}