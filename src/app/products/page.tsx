'use client';

import { useState, useEffect } from 'react';
import { FiBox, FiDollarSign, FiTag, FiStar, FiFilter, FiAlertCircle, FiPlus } from 'react-icons/fi';
import { Product } from '@/types';
import { getAuthHeaders } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Product Catalog</h1>
          <button
            onClick={() => router.push('/products/analyze')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <FiPlus /> Analyze Product
          </button>
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
          <div className="text-center py-10">
            <div className="animate-pulse text-blue-600">Loading products...</div>
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

        {/* Product grid */}
        {!isLoading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ProductCard({ product }: { product: Product & { moq?: number; vendorName?: string; vendorPlatform?: string; sourceUrl?: string } }) {
  const profitMargin = product.potentialPrice > 0 
    ? (((product.potentialPrice - product.cost) / product.potentialPrice) * 100).toFixed(0)
    : '0';

  return (
    <div className="card bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="bg-gray-100 h-40 flex items-center justify-center relative">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <FiBox size={48} className="text-gray-400" />
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
            className="text-xs text-blue-600 hover:underline block mb-2"
          >
            View Original Product →
          </a>
        )}
      </div>
    </div>
  );
} 