'use client';

import { useState, useEffect } from 'react';
import { FiDollarSign, FiPlus, FiTrendingUp, FiTrendingDown, FiCreditCard, FiPackage } from 'react-icons/fi';
import { getAuthHeaders } from '@/lib/auth';

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
      <div className="bg-white rounded-lg shadow-md p-6">
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FiCreditCard className="text-blue-600" />
            Budget Wallet
          </h3>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <FiPlus />
            Manage Budget
          </button>
        </div>

        {/* Budget Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-sm text-gray-600 mb-1">Total Budget</div>
            <div className="text-2xl font-bold text-green-700">
              ${budgetStatus?.total.toFixed(2) || '0.00'}
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Allocated</div>
            <div className="text-2xl font-bold text-blue-700">
              ${budgetStatus?.allocated.toFixed(2) || '0.00'}
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="text-sm text-gray-600 mb-1">Used</div>
            <div className="text-2xl font-bold text-orange-700">
              ${budgetStatus?.used.toFixed(2) || '0.00'}
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-sm text-gray-600 mb-1">Available</div>
            <div className="text-2xl font-bold text-purple-700">
              ${availableBudget.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Product Allocations */}
        {allocations.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FiPackage />
              Product Budget Allocations
            </h4>
            <div className="space-y-2">
              {allocations.map((alloc) => {
                const usagePercent = alloc.allocated > 0 ? (alloc.used / alloc.allocated) * 100 : 0;
                return (
                  <div key={alloc.productId} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800">{alloc.productName}</span>
                      <span className="text-sm text-gray-600">
                        ${alloc.used.toFixed(2)} / ${alloc.allocated.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full ${
                          usagePercent > 80 ? 'bg-red-500' : usagePercent > 50 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, usagePercent)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
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
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Recent Transactions</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {transactions.map((txn, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex items-center gap-3">
                    {txn.type === 'deposit' ? (
                      <FiTrendingUp className="text-green-600" />
                    ) : (
                      <FiTrendingDown className="text-red-600" />
                    )}
                    <div>
                      <div className="font-medium text-gray-800">{txn.description}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(txn.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className={`font-bold ${txn.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                    {txn.type === 'deposit' ? '+' : '-'}${txn.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manage Budget</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setAction('add');
                    setAddAmount('');
                    setProductAllocations({});
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 border-b">
                <button
                  onClick={() => setAction('add')}
                  className={`px-4 py-2 font-semibold ${
                    action === 'add'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <FiPlus className="inline mr-2" />
                  Add Funds
                </button>
                <button
                  onClick={() => setAction('allocate')}
                  className={`px-4 py-2 font-semibold ${
                    action === 'allocate'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <FiPackage className="inline mr-2" />
                  Allocate to Products
                </button>
              </div>

              {/* Add Funds */}
              {action === 'add' && (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Amount to Add ($)
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="text-sm text-gray-700">
                      <strong>Current Balance:</strong> ${budgetStatus?.total.toFixed(2) || '0.00'}
                    </div>
                    {addAmount && (
                      <div className="text-sm text-gray-700 mt-2">
                        <strong>New Balance:</strong> ${((budgetStatus?.total || 0) + (parseFloat(addAmount) || 0)).toFixed(2)}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleAddFunds}
                    disabled={submitting || !addAmount || parseFloat(addAmount) <= 0}
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {submitting ? 'Processing...' : `Add $${addAmount || '0'} to Wallet`}
                  </button>
                </div>
              )}

              {/* Allocate to Products */}
              {action === 'allocate' && (
                <div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                    <div className="text-sm text-gray-700">
                      <strong>Available Budget:</strong> ${availableBudget.toFixed(2)}
                    </div>
                  </div>
                  {products.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No products found. Add products first to allocate budget.
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
                          <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="font-semibold text-gray-800">{product.name}</div>
                                <div className="text-sm text-gray-600">{product.category}</div>
                              </div>
                              {currentAlloc && (
                                <div className="text-sm text-gray-600">
                                  Current: ${currentAlloc.allocated.toFixed(2)}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <FiDollarSign className="text-gray-400" />
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
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.00"
                              />
                              <span className="text-sm text-gray-600">Max: ${remaining.toFixed(2)}</span>
                            </div>
                          </div>
                        );
                      })}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-700">Total Allocation:</span>
                          <span className="text-xl font-bold text-blue-600">
                            ${Object.values(productAllocations).reduce((sum, val) => sum + (parseFloat(val) || 0), 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Remaining: ${(availableBudget - Object.values(productAllocations).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)).toFixed(2)}
                        </div>
                      </div>
                      <button
                        onClick={handleAllocate}
                        disabled={submitting || Object.values(productAllocations).every(val => !val || parseFloat(val) <= 0)}
                        className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                      >
                        {submitting ? 'Allocating...' : 'Allocate Budget'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

