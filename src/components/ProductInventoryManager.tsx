'use client';

import { useState, useEffect } from 'react';
import { FiPackage, FiPlus, FiRefreshCw, FiAlertCircle, FiCheckCircle, FiEdit2, FiBox, FiTrendingUp, FiSettings } from 'react-icons/fi';
import { getAuthHeaders } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';

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
      <div className="card p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          <div className="h-20 bg-gray-200 rounded-xl"></div>
          <div className="h-20 bg-gray-200 rounded-xl"></div>
          <div className="h-20 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const productsWithoutSku = products.filter(p => !p.sku);
  const lowStockItems = inventory.filter(i => i.needsRestock);

  return (
    <>
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-title-2 font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <FiPackage className="text-indigo-600 text-xl" />
            </div>
            Inventory Management
          </h3>
        </div>

        {/* Alerts */}
        {lowStockItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-start gap-3"
          >
            <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h4 className="font-semibold text-red-900">Low Stock Alert</h4>
              <p className="text-sm text-red-700 mt-1">
                {lowStockItems.length} product{lowStockItems.length > 1 ? 's' : ''} need{lowStockItems.length === 1 ? 's' : ''} restocking immediately to avoid lost sales.
              </p>
            </div>
          </motion.div>
        )}

        {/* Products without SKU */}
        {productsWithoutSku.length > 0 && (
          <div className="mb-8">
            <h4 className="text-title-3 font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiSettings className="text-gray-400" />
              Setup Required
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {productsWithoutSku.map((product) => (
                <div key={product.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between group hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-400 border border-gray-100">
                      <FiBox />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.category}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSetupSku(product)}
                    className="btn btn-primary text-sm py-2 px-4 flex items-center gap-2"
                  >
                    <FiEdit2 size={14} />
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
            <h4 className="text-title-3 font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiPackage className="text-gray-400" />
              Current Stock
            </h4>
            <div className="space-y-3">
              {inventory.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -2 }}
                  className={`rounded-xl p-5 border transition-all ${item.needsRestock
                      ? 'bg-red-50/50 border-red-100 hover:shadow-md'
                      : 'bg-white border-gray-100 hover:shadow-md'
                    }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900 text-lg">{item.productName}</span>
                        {item.needsRestock && (
                          <span className="badge badge-danger">Low Stock</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs border border-gray-200">
                          {item.sku}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div className="bg-white/50 p-2 rounded-lg">
                          <span className="text-gray-500 block text-xs mb-0.5">Available</span>
                          <span className={`font-bold text-lg ${item.availableQuantity <= item.reorderPoint ? 'text-red-600' : 'text-green-600'}`}>
                            {item.availableQuantity}
                          </span>
                        </div>
                        <div className="bg-white/50 p-2 rounded-lg">
                          <span className="text-gray-500 block text-xs mb-0.5">Reserved</span>
                          <span className="font-bold text-lg text-orange-600">{item.reservedQuantity}</span>
                        </div>
                        <div className="bg-white/50 p-2 rounded-lg">
                          <span className="text-gray-500 block text-xs mb-0.5">Reorder Point</span>
                          <span className="font-semibold text-gray-900">{item.reorderPoint}</span>
                        </div>
                        <div className="bg-white/50 p-2 rounded-lg">
                          <span className="text-gray-500 block text-xs mb-0.5">Last Restock</span>
                          <span className="font-medium text-gray-900">
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
                      className="btn btn-secondary whitespace-nowrap flex items-center justify-center gap-2 h-full py-3"
                    >
                      <FiRefreshCw />
                      Restock
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : products.length > 0 && productsWithoutSku.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <FiPackage className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-title-3 font-bold text-gray-900 mb-2">No Inventory Yet</h3>
            <p className="text-body text-gray-500">Set up SKUs for your products to start tracking inventory.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <FiBox className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-title-3 font-bold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-body text-gray-500">Add products to your catalog to manage inventory.</p>
          </div>
        ) : null}
      </div>

      {/* Restock Modal */}
      <AnimatePresence>
        {showRestockModal && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => {
                setShowRestockModal(false);
                setSelectedProduct(null);
                setRestockSku('');
                setRestockQuantity('');
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-apple-xl w-full max-w-md p-6 relative z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-title-2 font-bold text-gray-900">Restock Inventory</h2>
                  <p className="text-sm text-gray-500">Add stock to your inventory</p>
                </div>
                <button
                  onClick={() => {
                    setShowRestockModal(false);
                    setSelectedProduct(null);
                    setRestockSku('');
                    setRestockQuantity('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                >
                  ✕
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
                <div className="font-bold text-gray-900 mb-1">{selectedProduct.name}</div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <FiTrendingUp className="text-green-600" />
                  Cost: ${selectedProduct.cost.toFixed(2)} per unit
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                  <input
                    type="text"
                    value={restockSku}
                    onChange={(e) => setRestockSku(e.target.value)}
                    className="input font-mono"
                    placeholder="e.g., PROD-001-BLUE"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity to Restock</label>
                  <input
                    type="number"
                    min="1"
                    value={restockQuantity}
                    onChange={(e) => setRestockQuantity(e.target.value)}
                    className="input"
                    placeholder="Enter quantity"
                  />
                </div>
                {restockQuantity && parseFloat(restockQuantity) > 0 && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex justify-between items-center">
                    <span className="text-sm text-blue-800 font-medium">Total Cost</span>
                    <span className="text-lg font-bold text-blue-900">
                      ${(parseFloat(restockQuantity) * selectedProduct.cost).toFixed(2)}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleRestock}
                  disabled={submitting || !restockSku || !restockQuantity || parseFloat(restockQuantity) <= 0}
                  className="btn btn-primary w-full py-3 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Restocking...
                    </>
                  ) : (
                    <>
                      <FiRefreshCw /> Confirm Restock
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SKU Setup Modal */}
      <AnimatePresence>
        {showSkuModal && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => {
                setShowSkuModal(false);
                setSelectedProduct(null);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-apple-xl w-full max-w-md p-6 relative z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-title-2 font-bold text-gray-900">Setup SKU</h2>
                  <p className="text-sm text-gray-500">Configure inventory tracking</p>
                </div>
                <button
                  onClick={() => {
                    setShowSkuModal(false);
                    setSelectedProduct(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                >
                  ✕
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
                <div className="font-bold text-gray-900 mb-1">{selectedProduct.name}</div>
                <div className="text-sm text-gray-600">Category: {selectedProduct.category}</div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU Code <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={skuForm.sku}
                    onChange={(e) => setSkuForm({ ...skuForm, sku: e.target.value.toUpperCase() })}
                    className="input font-mono uppercase"
                    placeholder="e.g., PROD-001-BLUE-L"
                  />
                  <p className="text-xs text-gray-500 mt-1">Unique identifier for this product variant</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reorder Point</label>
                    <input
                      type="number"
                      min="1"
                      value={skuForm.reorderPoint}
                      onChange={(e) => setSkuForm({ ...skuForm, reorderPoint: e.target.value })}
                      className="input"
                    />
                    <p className="text-xs text-gray-500 mt-1">Alert when stock ≤ this</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reorder Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={skuForm.reorderQuantity}
                      onChange={(e) => setSkuForm({ ...skuForm, reorderQuantity: e.target.value })}
                      className="input"
                    />
                    <p className="text-xs text-gray-500 mt-1">Default quantity</p>
                  </div>
                </div>
                <button
                  onClick={saveSku}
                  disabled={submitting || !skuForm.sku}
                  className="btn btn-primary w-full py-3 font-semibold"
                >
                  {submitting ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
