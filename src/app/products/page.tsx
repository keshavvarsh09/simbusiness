'use client';

import { useState, useEffect } from 'react';
import { FiBox, FiDollarSign, FiTag, FiStar, FiFilter, FiAlertCircle, FiPlus, FiTrendingUp, FiCheck, FiBarChart, FiImage, FiExternalLink } from 'react-icons/fi';
import { Product } from '@/types';
import { getAuthHeaders } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import Breadcrumbs from '@/components/Breadcrumbs';
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
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <h1 className="text-3xl font-bold text-gray-800">Product Catalog</h1>
          <div className="flex gap-2">
            <AddProductForm onSuccess={loadProducts} />
            <button
              onClick={() => router.push('/products/analyze')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <FiPlus /> Analyze Product
            </button>
            <button
              onClick={() => router.push('/products/recommendations')}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center gap-2"
            >
              <FiTrendingUp /> Get Recommendations
            </button>
          </div>
        </div>
        
        {/* Info banner */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <FiAlertCircle className="text-blue-600" />
            <span>
              <strong>Your Products:</strong> This shows products you've analyzed or added from recommendations. 
              {products.length === 0 && (
                <span className="ml-2">
                  <a href="/products/analyze" className="text-blue-600 hover:underline">Analyze your first product</a> or 
                  <a href="/products/recommendations" className="text-blue-600 hover:underline ml-1">get AI recommendations</a>.
                </span>
              )}
            </span>
          </p>
        </div>
        
        {/* Category filter */}
        {categories.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <FiFilter className="text-gray-500" />
              <h3 className="font-medium">Filter by Category:</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('all')} 
                className={`px-3 py-1 text-sm rounded-full ${
                  selectedCategory === 'all' || !selectedCategory 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Products
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    selectedCategory === category 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <FiBox className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Yet</h3>
            <p className="text-gray-500 mb-6">
              Start building your product catalog by analyzing products or getting AI recommendations.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/products/analyze')}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <FiPlus /> Analyze Product
              </button>
              <button
                onClick={() => router.push('/products/recommendations')}
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 flex items-center gap-2"
              >
                <FiStar /> Get Recommendations
              </button>
            </div>
          </div>
        )}

        {/* Selection and Dashboard Controls */}
        {!isLoading && !error && products.length > 0 && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={selectAllProducts}
                  className="text-sm px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2"
                >
                  <FiCheck />
                  {selectedProducts.size === products.length ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-sm text-gray-600">
                  {selectedProducts.size} of {products.length} selected
                </span>
                <span className="text-xs text-gray-500">
                  ({activeProducts.size} active in dashboard)
                </span>
              </div>
              {selectedProducts.size > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddToDashboard}
                    disabled={addingToDashboard}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 text-sm"
                  >
                    <FiPlus />
                    {addingToDashboard ? 'Adding...' : 'Add to Dashboard'}
                  </button>
                  <button
                    onClick={handleRemoveFromDashboard}
                    disabled={addingToDashboard}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 text-sm"
                  >
                    Remove from Dashboard
                  </button>
                  <button
                    onClick={handleSimulateProducts}
                    disabled={simulating}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 text-sm"
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
    <div className={`card bg-white overflow-hidden shadow-sm hover:shadow-md transition-all relative ${isSelected ? 'ring-2 ring-indigo-500' : ''} ${isActiveInDashboard ? 'border-l-4 border-l-green-500' : ''}`}>
      {/* Selection Checkbox */}
      {onSelect && (
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={onSelect}
            className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
              isSelected 
                ? 'bg-indigo-600 border-indigo-600 text-white' 
                : 'bg-white border-gray-300 hover:border-indigo-500'
            }`}
          >
            {isSelected && <FiCheck size={14} />}
          </button>
        </div>
      )}
      
      {/* Active in Dashboard Badge */}
      {isActiveInDashboard && (
        <div className="absolute top-2 left-2 z-10">
          <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
            Active in Dashboard
          </span>
        </div>
      )}

      <div className="bg-gray-100 h-40 flex items-center justify-center relative">
        {imageLoading ? (
          <div className="animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-300 rounded"></div>
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-contain p-2"
            onError={() => {
              setImageUrl(null);
              setImageLoading(false);
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <FiBox size={48} className="text-gray-400" />
            {product.sourceUrl && (
              <button
                onClick={() => setShowImageLinks(!showImageLinks)}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <FiImage size={12} />
                View Images
              </button>
            )}
          </div>
        )}
        
        {/* Image Links Dropdown */}
        {showImageLinks && product.sourceUrl && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-2">
            <div className="flex flex-wrap gap-1 justify-center">
              {product.sourceUrl.includes('alibaba') && (
                <a
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiExternalLink size={10} /> Alibaba
                </a>
              )}
              {product.sourceUrl.includes('aliexpress') && (
                <a
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiExternalLink size={10} /> AliExpress
                </a>
              )}
              {product.sourceUrl.includes('indiamart') && (
                <a
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiExternalLink size={10} /> IndiaMart
                </a>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 truncate" title={product.name}>{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
          <FiTag size={14}/> {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </p>
        
        <div className="space-y-2 mb-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-green-600 font-medium flex items-center gap-1">
              <FiDollarSign size={14}/> Cost: ${product.cost.toFixed(2)}
            </span>
            <span className="text-blue-600 font-medium flex items-center gap-1">
              <FiDollarSign size={14}/> Price: ${product.potentialPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Profit: {profitMargin}%</span>
            <span className="flex items-center gap-1">
              <FiStar size={14} className="text-yellow-400"/> {product.rating.toFixed(1)}
            </span>
          </div>

          {product.moq && product.moq > 0 && (
            <p className="text-xs text-gray-500">MOQ: {product.moq} units</p>
          )}
          
          {product.vendorPlatform && (
            <p className="text-xs text-gray-500">Source: {product.vendorPlatform}</p>
          )}
        </div>

        {product.sourceUrl && (
          <a
            href={product.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline block mb-2 flex items-center gap-1"
          >
            <FiExternalLink size={12} /> View Original Product
          </a>
        )}

        {/* AI Performance Analysis */}
        <div className="mt-3 pt-3 border-t">
          {performance ? (
            <div className="space-y-2">
              <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getPerformanceColor(performance.performance)}`}>
                {performance.performance?.toUpperCase() || 'MODERATE'}
              </div>
              <p className="text-xs text-gray-600">{performance.description}</p>
              {performance.strengths && performance.strengths.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-green-700 mb-1">Strengths:</p>
                  <ul className="text-xs text-gray-600 list-disc list-inside">
                    {performance.strengths.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {performance.risks && performance.risks.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-red-700 mb-1">Risks:</p>
                  <ul className="text-xs text-gray-600 list-disc list-inside">
                    {performance.risks.map((r: string, i: number) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : onLoadPerformance ? (
            <button
              onClick={onLoadPerformance}
              disabled={loadingPerformance}
              className="w-full text-xs px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loadingPerformance ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <FiBarChart size={12} />
                  Get AI Performance Analysis
                </>
              )}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
} 