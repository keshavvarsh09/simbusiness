'use client';

import { useState, useEffect } from 'react';
import { FiBox, FiDollarSign, FiTag, FiStar, FiFilter } from 'react-icons/fi';
import { fetchProducts, fetchCategories, fetchProductsByCategory } from '@/services/api';
import { Product } from '@/types';
import Image from 'next/image';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [apiUrl, setApiUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Show the actual API URL being used (with fallback)
    const apiUrlEnv = process.env.NEXT_PUBLIC_API_URL;
    const actualApiUrl = apiUrlEnv || 'https://fakestoreapi.com (default)';
    setApiUrl(actualApiUrl);
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load categories for the filter
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        
        // Load initial products
        const productsData = await fetchProducts();
        setProducts(productsData);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    const loadProductsByCategory = async () => {
      if (!selectedCategory) return;
      
      setIsLoading(true);
      try {
        const productsData = selectedCategory === 'all' 
          ? await fetchProducts()
          : await fetchProductsByCategory(selectedCategory);
        setProducts(productsData);
        setError(null);
      } catch (err) {
        console.error('Error loading products by category:', err);
        setError(`Failed to load ${selectedCategory} products.`);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProductsByCategory();
  }, [selectedCategory]);

  const handleProductSelect = (productId: string) => {
    setSelectedProducts(prevSelected => 
      prevSelected.includes(productId)
        ? prevSelected.filter(id => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Catalog</h1>
        
        {/* Display API URL being used */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>API Source:</strong> {apiUrl}
            {apiUrl.includes('(default)') && (
              <span className="ml-2 text-xs text-gray-500">
                (Products are for demonstration purposes)
              </span>
            )}
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
        
        {/* Product grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                isSelected={selectedProducts.includes(product.id)}
                onSelect={handleProductSelect}
              />
            ))}
          </div>
        )}
        
        {/* Selected products summary */}
        {selectedProducts.length > 0 && (
           <div className="mt-8 p-4 bg-blue-100 border border-blue-300 rounded-lg text-center">
              <p className="text-blue-800 font-medium">
                  Selected {selectedProducts.length} product(s) for your store. 
                  (Note: Selection currently doesn't affect simulation)
              </p>
           </div>
        )}
      </main>
    </div>
  );
}

function ProductCard({ product, isSelected, onSelect }: { product: Product; isSelected: boolean; onSelect: (id: string) => void }) {
  return (
    <div className={`card bg-white overflow-hidden transition-all ${isSelected ? 'ring-2 ring-primary' : 'shadow-sm hover:shadow-md'}`}>
      <div className="bg-gray-100 h-40 flex items-center justify-center relative">
        {product.imageUrl ? (
          <div className="relative w-full h-full">
            <Image 
              src={product.imageUrl} 
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: 'contain', padding: '0.5rem' }}
            />
          </div>
        ) : (
          <FiBox size={48} className="text-gray-400" />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 truncate" title={product.name}>{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
          <FiTag size={14}/> {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </p>
        
        <div className="flex justify-between items-center text-sm mb-3">
          <span className="text-green-600 font-medium flex items-center gap-1">
            <FiDollarSign size={14}/> Cost: ${product.cost.toFixed(2)}
          </span>
          <span className="text-blue-600 font-medium flex items-center gap-1">
             <FiDollarSign size={14}/> Price: ${product.potentialPrice.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
          <span>Profit Margin: {(((product.potentialPrice - product.cost) / product.potentialPrice) * 100).toFixed(0)}%</span>
          <span className="flex items-center gap-1"><FiStar size={14} className="text-yellow-400"/> {product.rating.toFixed(1)}</span>
        </div>

        <button 
          onClick={() => onSelect(product.id)}
          className={`btn w-full text-sm ${isSelected ? 'btn-secondary' : 'btn-primary'}`}
        >
          {isSelected ? 'Remove from Store' : 'Add to Store'}
        </button>
      </div>
    </div>
  );
} 