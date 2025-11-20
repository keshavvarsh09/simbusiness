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
  FiRefreshCw
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product dashboard...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <FiAlertCircle className="text-yellow-600 mx-auto mb-4" size={48} />
            <h2 className="text-xl font-bold text-yellow-800 mb-2">No Products Found</h2>
            <p className="text-yellow-700 mb-4">
              Add products to your catalog to view the product dashboard.
            </p>
            <button
              onClick={() => router.push('/products')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
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
        tension: 0.1
      },
      {
        label: 'Expenses',
        data: filteredPerformance.map(p => p.expenses),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1
      },
      {
        label: 'Profit',
        data: filteredPerformance.map(p => p.profit),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1
      }
    ]
  };

  const ordersChartData = {
    labels: filteredPerformance.map(p => new Date(p.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Orders',
        data: filteredPerformance.map(p => p.orders),
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        borderColor: 'rgb(139, 92, 246)',
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FiBarChart className="text-blue-600" />
            Product Dashboard
          </h1>
          <button
            onClick={loadData}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
          >
            <FiRefreshCw />
            Refresh
          </button>
        </div>

        {/* Product Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Filter by Product
          </label>
          <select
            value={selectedProduct || ''}
            onChange={(e) => setSelectedProduct(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Products</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Inventory Value</p>
                <p className="text-2xl font-bold text-gray-800">${totalInventoryValue.toFixed(2)}</p>
              </div>
              <FiPackage className="text-blue-600 text-3xl" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Available Units</p>
                <p className="text-2xl font-bold text-green-600">{totalAvailableQuantity}</p>
              </div>
              <FiCheckCircle className="text-green-600 text-3xl" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Low Stock Items</p>
                <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
              </div>
              <FiAlertCircle className="text-red-600 text-3xl" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-purple-600">{totalOrders}</p>
              </div>
              <FiShoppingCart className="text-purple-600 text-3xl" />
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        {filteredPerformance.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-2">
                <FiTrendingUp className="text-green-600" />
                <h3 className="text-lg font-semibold">Total Revenue</h3>
              </div>
              <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-2">
                <FiTrendingDown className="text-red-600" />
                <h3 className="text-lg font-semibold">Total Expenses</h3>
              </div>
              <p className="text-3xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-2">
                <FiDollarSign className="text-blue-600" />
                <h3 className="text-lg font-semibold">Total Profit</h3>
              </div>
              <p className="text-3xl font-bold text-blue-600">${totalProfit.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Charts */}
        {filteredPerformance.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue vs Expenses vs Profit</h3>
              <Line data={revenueChartData} options={{ responsive: true }} />
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Orders Over Time</h3>
              <Bar data={ordersChartData} options={{ responsive: true }} />
            </div>
          </div>
        )}

        {/* SKU Inventory Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiPackage />
            SKU Inventory Details
          </h3>
          {filteredInventory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">SKU</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Available</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Reserved</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Value</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{item.productName}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                          {item.sku}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-semibold ${item.availableQuantity <= item.reorderPoint ? 'text-red-600' : 'text-green-600'}`}>
                          {item.availableQuantity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-orange-600">
                        {item.reservedQuantity}
                      </td>
                      <td className="py-3 px-4 text-right">{item.quantity}</td>
                      <td className="py-3 px-4 text-right">
                        ${(item.quantity * item.productCost).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.needsRestock ? (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
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
            <div className="text-center py-8 text-gray-500">
              <FiPackage className="mx-auto text-4xl mb-2 text-gray-400" />
              <p>No inventory records found. Set up SKUs for your products to track inventory.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

