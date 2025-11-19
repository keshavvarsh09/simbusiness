'use client';

import { useState, useEffect } from 'react';
import { FiPackage, FiPlus, FiRefreshCw, FiAlertCircle, FiCheckCircle, FiEdit2 } from 'react-icons/fi';
import { getAuthHeaders } from '@/lib/auth';

interface Product {
  id: number;
  name: string;
  category: string;
  cost: number;
  sellingPrice: number;
  sku?: string;
}

interface InventoryItem {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  reorderPoint: number;
  reorderQuantity: number;
  lastRestockedAt: string | null;
  productCost: number;
  productPrice: number;
  category: string;
  needsRestock: boolean;
}

export default function ProductInventoryManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [restockSku, setRestockSku] = useState('');
  const [restockQuantity, setRestockQuantity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSkuModal, setShowSkuModal] = useState(false);
  const [skuForm, setSkuForm] = useState({ sku: '', reorderPoint: '10', reorderQuantity: '20' });

  useEffect(() => {
    fetchProducts();
    fetchInventory();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products/user-products', {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/products/inventory', {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        setInventory(data.inventory || []);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async () => {
    if (!selectedProduct || !restockSku || !restockQuantity || parseFloat(restockQuantity) <= 0) {
      alert('Please fill in all fields with valid values');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/products/inventory', {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'restock',
          productId: selectedProduct.id,
          sku: restockSku,
          quantity: parseFloat(restockQuantity)
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Restocked ${restockQuantity} units of SKU ${restockSku}. Cost: $${data.restockCost.toFixed(2)}`);
        setRestockSku('');
        setRestockQuantity('');
        setShowRestockModal(false);
        setSelectedProduct(null);
        fetchInventory();
        fetchProducts();
      } else {
        alert(data.error || 'Failed to restock');
      }
    } catch (error) {
      console.error('Error restocking:', error);
      alert('Failed to restock inventory');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetupSku = async (product: Product) => {
    setSelectedProduct(product);
    setSkuForm({
      sku: product.sku || `${product.name.substring(0, 3).toUpperCase()}-${product.id}`,
      reorderPoint: '10',
      reorderQuantity: '20'
    });
    setShowSkuModal(true);
  };

  const saveSku = async () => {
    if (!selectedProduct || !skuForm.sku) {
      alert('Please enter a SKU');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/products/inventory', {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          productId: selectedProduct.id,
          sku: skuForm.sku,
          reorderPoint: parseInt(skuForm.reorderPoint),
          reorderQuantity: parseInt(skuForm.reorderQuantity)
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('SKU configured successfully!');
        setShowSkuModal(false);
        setSelectedProduct(null);
        fetchInventory();
        fetchProducts();
      } else {
        alert(data.error || 'Failed to save SKU');
      }
    } catch (error) {
      console.error('Error saving SKU:', error);
      alert('Failed to save SKU');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const productsWithoutSku = products.filter(p => !p.sku);
  const productsWithInventory = inventory.map(i => i.productId);
  const lowStockItems = inventory.filter(i => i.needsRestock);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FiPackage className="text-indigo-600" />
            SKU & Inventory Management
          </h3>
        </div>

        {/* Alerts */}
        {lowStockItems.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-yellow-800 mb-2">
              <FiAlertCircle />
              <span className="font-semibold">Low Stock Alert</span>
            </div>
            <p className="text-sm text-yellow-700">
              {lowStockItems.length} product{lowStockItems.length > 1 ? 's' : ''} need{lowStockItems.length === 1 ? 's' : ''} restocking
            </p>
          </div>
        )}

        {/* Products without SKU */}
        {productsWithoutSku.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Products Needing SKU Setup</h4>
            <div className="space-y-2">
              {productsWithoutSku.map((product) => (
                <div key={product.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-800">{product.name}</div>
                    <div className="text-sm text-gray-600">{product.category}</div>
                  </div>
                  <button
                    onClick={() => handleSetupSku(product)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    <FiEdit2 />
                    Setup SKU
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inventory List */}
        {inventory.length > 0 ? (
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Current Inventory</h4>
            <div className="space-y-3">
              {inventory.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-lg p-4 border ${
                    item.needsRestock ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">{item.productName}</span>
                        {item.needsRestock && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Low Stock</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-mono bg-gray-200 px-2 py-1 rounded">{item.sku}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Available:</span>
                          <span className={`font-semibold ml-1 ${item.availableQuantity <= item.reorderPoint ? 'text-red-600' : 'text-green-600'}`}>
                            {item.availableQuantity}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Reserved:</span>
                          <span className="font-semibold ml-1 text-orange-600">{item.reservedQuantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Reorder Point:</span>
                          <span className="font-semibold ml-1">{item.reorderPoint}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Restock:</span>
                          <span className="font-semibold ml-1 text-xs">
                            {item.lastRestockedAt ? new Date(item.lastRestockedAt).toLocaleDateString() : 'Never'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedProduct(products.find(p => p.id === item.productId) || null);
                        setRestockSku(item.sku);
                        setRestockQuantity(item.reorderQuantity.toString());
                        setShowRestockModal(true);
                      }}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 ml-4"
                    >
                      <FiRefreshCw />
                      Restock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FiPackage className="mx-auto text-4xl mb-2 text-gray-400" />
            <p>No inventory set up yet. Set up SKUs for your products to start tracking inventory.</p>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FiPackage className="mx-auto text-4xl mb-2 text-gray-400" />
            <p>No products found. Add products first to manage inventory.</p>
          </div>
        )}
      </div>

      {/* Restock Modal */}
      {showRestockModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Restock Inventory</h2>
                <button
                  onClick={() => {
                    setShowRestockModal(false);
                    setSelectedProduct(null);
                    setRestockSku('');
                    setRestockQuantity('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4">
                <div className="font-semibold text-gray-800 mb-2">{selectedProduct.name}</div>
                <div className="text-sm text-gray-600">Cost: ${selectedProduct.cost.toFixed(2)} per unit</div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">SKU</label>
                  <input
                    type="text"
                    value={restockSku}
                    onChange={(e) => setRestockSku(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., PROD-001-BLUE"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity to Restock</label>
                  <input
                    type="number"
                    min="1"
                    value={restockQuantity}
                    onChange={(e) => setRestockQuantity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter quantity"
                  />
                </div>
                {restockQuantity && parseFloat(restockQuantity) > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm text-gray-700">
                      <strong>Total Cost:</strong> ${(parseFloat(restockQuantity) * selectedProduct.cost).toFixed(2)}
                    </div>
                  </div>
                )}
                <button
                  onClick={handleRestock}
                  disabled={submitting || !restockSku || !restockQuantity || parseFloat(restockQuantity) <= 0}
                  className="w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {submitting ? 'Restocking...' : 'Restock Inventory'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SKU Setup Modal */}
      {showSkuModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Setup SKU</h2>
                <button
                  onClick={() => {
                    setShowSkuModal(false);
                    setSelectedProduct(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4">
                <div className="font-semibold text-gray-800 mb-2">{selectedProduct.name}</div>
                <div className="text-sm text-gray-600">Category: {selectedProduct.category}</div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-700">
                  <strong>What is a SKU?</strong>
                  <p className="mt-1">SKU (Stock Keeping Unit) is a unique identifier for tracking product variants. Even in dropshipping, SKUs help manage different sizes, colors, and automate reordering.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">SKU Code *</label>
                  <input
                    type="text"
                    value={skuForm.sku}
                    onChange={(e) => setSkuForm({ ...skuForm, sku: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    placeholder="e.g., PROD-001-BLUE-L"
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: PRODUCT-CATEGORY-VARIANT (max 20 chars)</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Reorder Point</label>
                    <input
                      type="number"
                      min="1"
                      value={skuForm.reorderPoint}
                      onChange={(e) => setSkuForm({ ...skuForm, reorderPoint: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Alert when stock ≤ this</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Reorder Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={skuForm.reorderQuantity}
                      onChange={(e) => setSkuForm({ ...skuForm, reorderQuantity: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Quantity to order</p>
                  </div>
                </div>
                <button
                  onClick={saveSku}
                  disabled={submitting || !skuForm.sku}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {submitting ? 'Saving...' : 'Save SKU Configuration'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

