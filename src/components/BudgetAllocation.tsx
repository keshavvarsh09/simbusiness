'use client';

import { useState, useEffect } from 'react';
import { FiDollarSign, FiPlus, FiTrendingUp, FiTrendingDown, FiCreditCard, FiPackage, FiX } from 'react-icons/fi';
import { getAuthHeaders } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';

interface BudgetStatus {
  total: number;
  allocated: number;
  used: number;
  available: number;
}

interface Allocation {
  productId: number;
  productName: string;
  allocated: number;
  used: number;
  available: number;
}

interface Transaction {
  type: string;
  amount: number;
  description: string;
  timestamp: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  cost: number;
  sellingPrice: number;
}

export default function BudgetAllocation() {
  const [showModal, setShowModal] = useState(false);
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus | null>(null);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<'add' | 'allocate'>('add');
  const [addAmount, setAddAmount] = useState('');
  const [productAllocations, setProductAllocations] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBudgetStatus();
    fetchProducts();
  }, []);

  const fetchBudgetStatus = async () => {
    try {
      const response = await fetch('/api/budget/allocate', {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        setBudgetStatus(data.budget);
        setAllocations(data.allocations || []);
        setTransactions(data.recentTransactions || []);
      }
    } catch (error) {
      console.error('Error fetching budget status:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddFunds = async () => {
    const amount = parseFloat(addAmount);
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/budget/allocate', {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_funds',
          amount: amount
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`$${amount} added to your wallet! New balance: $${data.newBudget.toFixed(2)}`);
        setAddAmount('');
        setShowModal(false);
        await fetchBudgetStatus();
        // Trigger a custom event to notify other components
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('budgetUpdated', { detail: { newBudget: data.newBudget } }));
        }
      } else {
        alert(data.error || data.details || 'Failed to add funds');
      }
    } catch (error) {
      console.error('Error adding funds:', error);
      alert('Failed to add funds');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAllocate = async () => {
    const allocations = Object.entries(productAllocations)
      .filter(([_, amount]) => amount && parseFloat(amount) > 0)
      .map(([productId, amount]) => ({
        productId: parseInt(productId),
        amount: parseFloat(amount)
      }));

    if (allocations.length === 0) {
      alert('Please allocate budget to at least one product');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/budget/allocate', {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'allocate',
          allocations
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Budget allocated successfully!`);
        setProductAllocations({});
        setShowModal(false);
        fetchBudgetStatus();
      } else {
        alert(data.error || data.details || 'Failed to allocate budget');
      }
    } catch (error) {
      console.error('Error allocating budget:', error);
      alert('Failed to allocate budget');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card bg-white p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const availableBudget = budgetStatus?.available || 0;

  return (
    <>
      <div className="card bg-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 text-white">
              <FiCreditCard size={20} />
            </div>
            <div>
              <h3 className="text-title-2 font-bold text-gray-900">Budget Wallet</h3>
              <p className="text-caption text-gray-500">Manage your finances</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary text-sm flex items-center gap-2"
          >
            <FiPlus />
            Manage Budget
          </button>
        </div>

        {/* Budget Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-50/50 rounded-2xl p-4 border border-green-100">
            <div className="text-caption font-medium text-green-600 mb-1 uppercase tracking-wider">Total Budget</div>
            <div className="text-title-1 font-bold text-green-700">
              ${budgetStatus?.total.toFixed(2) || '0.00'}
            </div>
          </div>
          <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
            <div className="text-caption font-medium text-blue-600 mb-1 uppercase tracking-wider">Allocated</div>
            <div className="text-title-1 font-bold text-blue-700">
              ${budgetStatus?.allocated.toFixed(2) || '0.00'}
            </div>
          </div>
          <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-100">
            <div className="text-caption font-medium text-orange-600 mb-1 uppercase tracking-wider">Used</div>
            <div className="text-title-1 font-bold text-orange-700">
              ${budgetStatus?.used.toFixed(2) || '0.00'}
            </div>
          </div>
          <div className="bg-purple-50/50 rounded-2xl p-4 border border-purple-100">
            <div className="text-caption font-medium text-purple-600 mb-1 uppercase tracking-wider">Available</div>
            <div className="text-title-1 font-bold text-purple-700">
              ${availableBudget.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Product Allocations */}
        {allocations.length > 0 && (
          <div className="mb-8">
            <h4 className="text-subhead font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiPackage className="text-gray-400" />
              Product Budget Allocations
            </h4>
            <div className="space-y-3">
              {allocations.map((alloc) => {
                const usagePercent = alloc.allocated > 0 ? (alloc.used / alloc.allocated) * 100 : 0;
                return (
                  <div key={alloc.productId} className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-900">{alloc.productName}</span>
                      <span className="text-sm font-medium text-gray-600">
                        ${alloc.used.toFixed(2)} <span className="text-gray-400">/</span> ${alloc.allocated.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, usagePercent)}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`h-full rounded-full ${usagePercent > 80 ? 'bg-red-500' : usagePercent > 50 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                      />
                    </div>
                    <div className="flex justify-between text-xs font-medium text-gray-500">
                      <span>Available: ${alloc.available.toFixed(2)}</span>
                      <span>{usagePercent.toFixed(1)}% used</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        {transactions.length > 0 && (
          <div>
            <h4 className="text-subhead font-semibold text-gray-900 mb-4">Recent Transactions</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {transactions.map((txn, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${txn.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                      {txn.type === 'deposit' ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{txn.description}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(txn.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className={`font-bold text-sm ${txn.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                    {txn.type === 'deposit' ? '+' : '-'}${txn.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-20">
                <h2 className="text-title-2 font-bold text-gray-900">Manage Budget</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setAction('add');
                    setAddAmount('');
                    setProductAllocations({});
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar">
                {/* Tabs */}
                <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
                  <button
                    onClick={() => setAction('add')}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${action === 'add'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <FiPlus className="inline mr-2" />
                    Add Funds
                  </button>
                  <button
                    onClick={() => setAction('allocate')}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${action === 'allocate'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <FiPackage className="inline mr-2" />
                    Allocate to Products
                  </button>
                </div>

                {/* Add Funds */}
                {action === 'add' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Amount to Add ($)
                      </label>
                      <div className="relative">
                        <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          value={addAmount}
                          onChange={(e) => setAddAmount(e.target.value)}
                          className="input pl-10 text-lg"
                          placeholder="Enter amount"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Current Balance:</span>
                        <span className="font-semibold text-gray-900">${budgetStatus?.total.toFixed(2) || '0.00'}</span>
                      </div>
                      {addAmount && (
                        <div className="flex justify-between text-sm pt-2 border-t border-blue-200/50">
                          <span className="text-blue-700 font-medium">New Balance:</span>
                          <span className="font-bold text-blue-700">${((budgetStatus?.total || 0) + (parseFloat(addAmount) || 0)).toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleAddFunds}
                      disabled={submitting || !addAmount || parseFloat(addAmount) <= 0}
                      className="btn btn-primary w-full py-4 text-lg shadow-lg shadow-primary-500/20"
                    >
                      {submitting ? 'Processing...' : `Add $${addAmount || '0'} to Wallet`}
                    </button>
                  </div>
                )}

                {/* Allocate to Products */}
                {action === 'allocate' && (
                  <div className="space-y-6">
                    <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4 flex justify-between items-center">
                      <span className="text-sm font-medium text-purple-700">Available to Allocate</span>
                      <span className="text-xl font-bold text-purple-700">${availableBudget.toFixed(2)}</span>
                    </div>

                    {products.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FiPackage className="text-gray-400" size={24} />
                        </div>
                        <p className="text-gray-500 font-medium">No products found</p>
                        <p className="text-sm text-gray-400 mt-1">Add products to your store first</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {products.map((product) => {
                          const currentAlloc = allocations.find(a => a.productId === product.id);
                          const totalAllocated = Object.values(productAllocations).reduce(
                            (sum, val) => sum + (parseFloat(val) || 0),
                            0
                          );
                          const remaining = availableBudget - totalAllocated + (parseFloat(productAllocations[product.id] || '0'));

                          return (
                            <div key={product.id} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors bg-white">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <div className="font-semibold text-gray-900">{product.name}</div>
                                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">{product.category}</div>
                                </div>
                                {currentAlloc && (
                                  <div className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-lg text-gray-600">
                                    Current: ${currentAlloc.allocated.toFixed(2)}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="relative flex-1">
                                  <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    max={remaining}
                                    value={productAllocations[product.id] || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      if (val === '' || parseFloat(val) >= 0) {
                                        setProductAllocations(prev => ({
                                          ...prev,
                                          [product.id]: val
                                        }));
                                      }
                                    }}
                                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="0.00"
                                  />
                                </div>
                                <div className="text-xs text-gray-500 whitespace-nowrap">
                                  Max: ${remaining.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-100 mt-6">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-gray-700">Total Allocation</span>
                            <div className="text-right">
                              <div className="text-xl font-bold text-blue-600">
                                ${Object.values(productAllocations).reduce((sum, val) => sum + (parseFloat(val) || 0), 0).toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-500">
                                Remaining: ${(availableBudget - Object.values(productAllocations).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)).toFixed(2)}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={handleAllocate}
                            disabled={submitting || Object.values(productAllocations).every(val => !val || parseFloat(val) <= 0)}
                            className="btn btn-primary w-full py-3 shadow-lg shadow-primary-500/20"
                          >
                            {submitting ? 'Allocating...' : 'Confirm Allocation'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

