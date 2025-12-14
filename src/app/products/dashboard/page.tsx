'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiPackage,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiBarChart,
  FiShoppingCart,
  FiAlertCircle,
  FiCheckCircle,
  FiRefreshCw,
  FiFilter
} from 'react-icons/fi';
import { getAuthHeaders, isAuthenticated } from '@/lib/auth';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

interface ProductPerformance {
  productId: number;
  productName: string;
  date: string;
  orders: number;
  revenue: number;
  expenses: number;
  profit: number;
  marketingSpend: number;
}

export default function ProductDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [performance, setPerformance] = useState<ProductPerformance[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
      return;
    }

    loadData();
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load products
      const productsResponse = await fetch('/api/products/user-products', {
        headers: getAuthHeaders(),
      });
      const productsData = await productsResponse.json();
      if (productsData.success) {
        setProducts(productsData.products || []);
        if (productsData.products.length > 0 && !selectedProduct) {
          setSelectedProduct(productsData.products[0].id);
        }
      }

      // Load inventory
      const inventoryResponse = await fetch('/api/products/inventory', {
        headers: getAuthHeaders(),
      });
      const inventoryData = await inventoryResponse.json();
      if (inventoryData.success) {
        setInventory(inventoryData.inventory || []);
      }

      // Load performance
      const performanceResponse = await fetch('/api/products/performance', {
        headers: getAuthHeaders(),
      });
      const performanceData = await performanceResponse.json();
      if (performanceData.success) {
        setPerformance(performanceData.performance || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-body text-gray-600">Loading product dashboard...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="card bg-yellow-50 border-yellow-200 text-center py-12">
            <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="text-yellow-600 text-3xl" />
            </div>
            <h2 className="text-title-2 font-bold text-yellow-900 mb-2">No Products Found</h2>
            <p className="text-body text-yellow-800 mb-6 max-w-md mx-auto">
              Add products to your catalog to view the product dashboard and track inventory.
            </p>
            <button
              onClick={() => router.push('/products')}
              className="btn btn-primary"
            >
              Go to Products
            </button>
          </div>
        </main>
      </div>
    );
  }

  const filteredInventory = selectedProduct
    ? inventory.filter(inv => inv.productId === selectedProduct)
    : inventory;

  const filteredPerformance = selectedProduct
    ? performance.filter(perf => perf.productId === selectedProduct)
    : performance;

  // Calculate totals
  const totalInventoryValue = inventory.reduce((sum, inv) => sum + (inv.quantity * inv.productCost), 0);
  const totalAvailableQuantity = inventory.reduce((sum, inv) => sum + inv.availableQuantity, 0);
  const totalReservedQuantity = inventory.reduce((sum, inv) => sum + inv.reservedQuantity, 0);
  const lowStockCount = inventory.filter(inv => inv.needsRestock).length;

  // Performance metrics
  const totalRevenue = filteredPerformance.reduce((sum, perf) => sum + perf.revenue, 0);
  const totalExpenses = filteredPerformance.reduce((sum, perf) => sum + perf.expenses, 0);
  const totalProfit = filteredPerformance.reduce((sum, perf) => sum + perf.profit, 0);
  const totalOrders = filteredPerformance.reduce((sum, perf) => sum + perf.orders, 0);

  // Chart data
  const revenueChartData = {
    labels: filteredPerformance.map(p => new Date(p.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Revenue',
        data: filteredPerformance.map(p => p.revenue),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Expenses',
        data: filteredPerformance.map(p => p.expenses),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Profit',
        data: filteredPerformance.map(p => p.profit),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const ordersChartData = {
    labels: filteredPerformance.map(p => new Date(p.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Orders',
        data: filteredPerformance.map(p => p.orders),
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1,
        borderRadius: 8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        titleFont: {
          family: "'Inter', sans-serif",
          size: 13,
          weight: 'bold' as const
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: '#f3f4f6'
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 11
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-display-3 font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center">
                <FiBarChart className="text-primary-600 text-2xl" />
              </div>
              Product Dashboard
            </h1>
            <p className="text-body text-gray-600">Overview of your inventory performance and metrics</p>
          </div>
          <button
            onClick={loadData}
            className="btn btn-secondary flex items-center gap-2"
          >
            <FiRefreshCw />
            Refresh Data
          </button>
        </div>

        {/* Product Selector */}
        <div className="mb-8">
          <div className="relative max-w-xs">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={selectedProduct || ''}
              onChange={(e) => setSelectedProduct(e.target.value ? parseInt(e.target.value) : null)}
              className="input pl-10"
            >
              <option value="">All Products</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ y: -4 }}
            className="card card-hover p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Inventory Value</p>
                <p className="text-title-2 font-bold text-gray-900">${totalInventoryValue.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <FiDollarSign size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="card card-hover p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Available Units</p>
                <p className="text-title-2 font-bold text-green-600">{totalAvailableQuantity}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                <FiCheckCircle size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="card card-hover p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Low Stock Items</p>
                <p className="text-title-2 font-bold text-red-600">{lowStockCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                <FiAlertCircle size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="card card-hover p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                <p className="text-title-2 font-bold text-purple-600">{totalOrders}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <FiShoppingCart size={20} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        {filteredPerformance.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="card p-6 bg-gradient-to-br from-green-50 to-white border-green-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <FiTrendingUp size={20} />
                </div>
                <h3 className="text-title-3 font-semibold text-gray-900">Total Revenue</h3>
              </div>
              <p className="text-display-3 font-bold text-green-700">${totalRevenue.toFixed(2)}</p>
            </div>

            <div className="card p-6 bg-gradient-to-br from-red-50 to-white border-red-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-100 rounded-lg text-red-600">
                  <FiTrendingDown size={20} />
                </div>
                <h3 className="text-title-3 font-semibold text-gray-900">Total Expenses</h3>
              </div>
              <p className="text-display-3 font-bold text-red-700">${totalExpenses.toFixed(2)}</p>
            </div>

            <div className="card p-6 bg-gradient-to-br from-blue-50 to-white border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <FiDollarSign size={20} />
                </div>
                <h3 className="text-title-3 font-semibold text-gray-900">Total Profit</h3>
              </div>
              <p className="text-display-3 font-bold text-blue-700">${totalProfit.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Charts */}
        {filteredPerformance.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card p-6">
              <h3 className="text-title-3 font-bold text-gray-900 mb-6">Financial Overview</h3>
              <div className="h-80">
                <Line data={revenueChartData} options={chartOptions} />
              </div>
            </div>
            <div className="card p-6">
              <h3 className="text-title-3 font-bold text-gray-900 mb-6">Order Volume</h3>
              <div className="h-80">
                <Bar data={ordersChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        )}

        {/* SKU Inventory Table */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-title-3 font-bold text-gray-900 flex items-center gap-2">
              <FiPackage className="text-gray-400" />
              SKU Inventory Details
            </h3>
          </div>

          {filteredInventory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="text-left py-4 px-6 font-semibold text-gray-600 text-sm">Product</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-600 text-sm">SKU</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-600 text-sm">Available</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-600 text-sm">Reserved</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-600 text-sm">Total</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-600 text-sm">Value</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-600 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-900">{item.productName}</td>
                      <td className="py-4 px-6">
                        <span className="font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          {item.sku}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className={`font-semibold ${item.availableQuantity <= item.reorderPoint ? 'text-red-600' : 'text-green-600'}`}>
                          {item.availableQuantity}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right text-orange-600 font-medium">
                        {item.reservedQuantity}
                      </td>
                      <td className="py-4 px-6 text-right text-gray-600">{item.quantity}</td>
                      <td className="py-4 px-6 text-right font-medium text-gray-900">
                        ${(item.quantity * item.productCost).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {item.needsRestock ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            In Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiPackage className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-title-3 font-bold text-gray-900 mb-2">No Inventory Records</h3>
              <p className="text-body text-gray-500">Set up SKUs for your products to track inventory.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
