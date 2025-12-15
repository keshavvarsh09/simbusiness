'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BusinessStats } from '@/types';
import {
  FiDollarSign,
  FiShoppingCart,
  FiTrendingUp,
  FiPackage,
  FiTarget,
  FiPlay,
  FiPlus,
  FiRefreshCw,
  FiAlertCircle,
  FiActivity
} from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';
import BusinessInsights from '@/components/BusinessInsights';
import { isAuthenticated, getAuthHeaders } from '@/lib/auth';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import AdMetricsChecker from '@/components/AdMetricsChecker';
import AddProductForm from '@/components/AddProductForm';
import BudgetAllocation from '@/components/BudgetAllocation';
import ProductInventoryManager from '@/components/ProductInventoryManager';
import MarketingHub from '@/components/MarketingHub';
import FinancialDashboard from '@/components/FinancialDashboard';
import SalesFunnel from '@/components/SalesFunnel';
import LogisticsTracker from '@/components/LogisticsTracker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Real-world market events that affect business
const marketEvents = [
  {
    title: 'Supply Chain Disruption',
    description: 'Global shipping delays are affecting delivery times.',
    impact: { inventory: 0, sales: -15, expenses: 0 }
  },
  {
    title: 'Trending Product',
    description: 'One of your products went viral on social media!',
    impact: { inventory: 0, sales: +30, expenses: 0 }
  },
  {
    title: 'Supplier Price Increase',
    description: 'Your supplier has increased costs by 10%.',
    impact: { inventory: 0, sales: 0, expenses: +10 }
  },
  {
    title: 'Competitor Sale',
    description: 'A major competitor is running a big promotion.',
    impact: { inventory: 0, sales: -20, expenses: 0 }
  },
  {
    title: 'Holiday Season',
    description: 'Seasonal shopping has increased overall demand.',
    impact: { inventory: 0, sales: +25, expenses: 0 }
  },
  {
    title: 'Shipping Carrier Promotion',
    description: 'Your shipping carrier is offering a discount.',
    impact: { inventory: 0, sales: 0, expenses: -15 }
  },
  {
    title: 'Product Quality Issue',
    description: 'Customers reported issues with a recent batch.',
    impact: { inventory: 0, sales: -10, expenses: +5 }
  }
];

// Simulation speed options
const simulationSpeeds = [
  { label: '1x', value: 1 },
  { label: '5x', value: 5 },
  { label: '10x', value: 10 }
];

export default function Dashboard() {
  const router = useRouter();
  const [businessStats, setBusinessStats] = useState<BusinessStats>({
    revenue: 0,
    expenses: 0,
    profit: 0,
    orders: 0,
    inventory: 15,
    marketing: 0
  });
  const [simulationHistory, setSimulationHistory] = useState<{ profit: number[] }>({ profit: [] });
  const [day, setDay] = useState(0);
  const [currentEvent, setCurrentEvent] = useState<typeof marketEvents[0] | null>(null);
  const [autoSimulate, setAutoSimulate] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [metrics, setMetrics] = useState({
    conversionRate: 2.7, // percent
    abandonmentRate: 68, // percent
    averageOrderValue: 47, // dollars
    returnRate: 8 // percent
  });
  const [loading, setLoading] = useState(true);
  const [hasProducts, setHasProducts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userProducts, setUserProducts] = useState<Array<{ id: number; name: string; cost: number; sellingPrice: number; category: string }>>([]);

  // Load state on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
      return;
    }

    loadDashboardState();

    // Listen for budget updates from BudgetAllocation component
    const handleBudgetUpdate = () => {
      // Refresh dashboard state to show updated budget
      loadDashboardState();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('budgetUpdated', handleBudgetUpdate);
      return () => {
        window.removeEventListener('budgetUpdated', handleBudgetUpdate);
      };
    }
  }, [router]);

  // Save state after changes (debounced)
  useEffect(() => {
    if (!loading && hasProducts) {
      const saveTimer = setTimeout(() => {
        saveDashboardState();
      }, 1000); // Save 1 second after last change

      return () => clearTimeout(saveTimer);
    }
  }, [businessStats, day, metrics, simulationHistory, loading, hasProducts]);

  const loadDashboardState = async () => {
    try {
      // Load dashboard state
      const stateResponse = await fetch('/api/dashboard/state', {
        headers: getAuthHeaders(),
      });

      const stateData = await stateResponse.json();
      if (stateData.success) {
        // Always recalculate profit from revenue - expenses to ensure accuracy
        const calculatedProfit = stateData.state.revenue - stateData.state.expenses;

        // Calculate actual inventory from SKU inventory
        let actualInventory = stateData.state.inventory;
        try {
          const inventoryResponse = await fetch('/api/products/inventory', {
            headers: getAuthHeaders(),
          });
          const inventoryData = await inventoryResponse.json();
          if (inventoryData.success && inventoryData.inventory) {
            actualInventory = inventoryData.inventory.reduce((sum: number, inv: any) => sum + inv.availableQuantity, 0);
          }
        } catch (error) {
          console.error('Failed to load inventory:', error);
        }

        setBusinessStats({
          revenue: stateData.state.revenue,
          expenses: stateData.state.expenses,
          profit: calculatedProfit, // Recalculate to ensure accuracy
          orders: stateData.state.orders,
          inventory: actualInventory, // Use actual SKU inventory
          marketing: stateData.state.marketing
        });
        setDay(stateData.state.day);
        setMetrics(stateData.state.metrics);
        setSimulationHistory(stateData.state.simulationHistory);
        setHasProducts(stateData.hasProducts);
      } else {
        console.error('Failed to load dashboard state:', stateData.error);
        alert(`Failed to load dashboard: ${stateData.error || 'Unknown error'}`);
      }

      // Load user products for calculations
      if (stateData.hasProducts) {
        try {
          const productsResponse = await fetch('/api/products/user-products', {
            headers: getAuthHeaders(),
          });

          const productsData = await productsResponse.json();
          if (productsData.success && productsData.products.length > 0) {
            setUserProducts(productsData.products);

            // Update average order value based on actual products
            if (productsData.averages.sellingPrice > 0) {
              setMetrics(prev => ({
                ...prev,
                averageOrderValue: productsData.averages.sellingPrice
              }));
            }
          } else {
            // If no active products found, set empty array
            setUserProducts([]);
          }
        } catch (error) {
          console.error('Failed to load user products:', error);
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard state:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDashboardState = async () => {
    if (saving) return;
    setSaving(true);
    try {
      // Always calculate profit correctly before saving
      const calculatedProfit = businessStats.revenue - businessStats.expenses;
      await fetch('/api/dashboard/state', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          revenue: businessStats.revenue,
          expenses: businessStats.expenses,
          profit: calculatedProfit, // Always save calculated profit
          orders: businessStats.orders,
          inventory: businessStats.inventory,
          marketing: businessStats.marketing,
          day,
          metrics,
          simulationHistory
        }),
      });
    } catch (error) {
      console.error('Failed to save dashboard state:', error);
    } finally {
      setSaving(false);
    }
  };

  // Auto-simulation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (autoSimulate && businessStats.inventory > 0) {
      interval = setInterval(() => {
        simulateDay();
      }, 2000 / simulationSpeed); // Adjust speed based on multiplier
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoSimulate, businessStats.inventory, simulationSpeed]);

  // Simulate business operations with per-product budgets and seasonality
  const simulateDay = async () => {
    if (!hasProducts) {
      alert('Please add products first before running simulation. Go to Products > Recommendations or Analyze Product.');
      return;
    }

    if (userProducts.length === 0) {
      alert('No active products found. Please activate products in the Products page.');
      return;
    }

    setDay(prevDay => prevDay + 1);

    // Randomly trigger market events (10% chance each day)
    if (Math.random() < 0.1) {
      const newEvent = marketEvents[Math.floor(Math.random() * marketEvents.length)];
      setCurrentEvent(newEvent);
    } else if (currentEvent) {
      // Clear event after a day
      setCurrentEvent(null);
    }

    // Fetch product budget allocations and seasonality
    let productAllocations: any[] = [];
    let productSeasonality: Record<number, { seasonality: number; trend: number }> = {};

    try {
      // Get budget allocations
      const budgetResponse = await fetch('/api/budget/allocate', {
        headers: getAuthHeaders(),
      });
      const budgetData = await budgetResponse.json();
      if (budgetData.success) {
        productAllocations = budgetData.allocations || [];
      }

      // Get seasonality factors (optional - if endpoint doesn't exist, use defaults)
      try {
        const seasonalityResponse = await fetch('/api/products/seasonality', {
          headers: getAuthHeaders(),
        });
        if (seasonalityResponse.ok) {
          const seasonalityData = await seasonalityResponse.json();
          if (seasonalityData.success) {
            seasonalityData.products.forEach((p: any) => {
              productSeasonality[p.productId] = {
                seasonality: p.calculatedSeasonality || 1.0,
                trend: p.currentTrend || 1.0
              };
            });
          }
        }
      } catch (seasonalityError) {
        // Seasonality endpoint is optional, use default values
        console.log('Seasonality endpoint not available, using defaults');
        userProducts.forEach((product) => {
          if (!productSeasonality[product.id]) {
            productSeasonality[product.id] = {
              seasonality: 1.0,
              trend: 1.0
            };
          }
        });
      }
    } catch (error) {
      console.error('Error fetching budget:', error);
      alert('Failed to fetch budget allocations. Simulation will continue with default values.');
    }

    // Calculate total allocated budget for distribution
    const totalAllocated = productAllocations.reduce((sum, a) => sum + a.allocated, 0);

    // Base visitors (grows over time)
    const dailyVisitors = 100 + (day / 10);

    // Distribute orders across products based on budget allocation and seasonality
    let totalRevenue = 0;
    let totalExpenses = 0;
    let totalOrders = 0;
    const shippingPerOrder = 5;

    // If products have budget allocations, distribute orders proportionally
    if (productAllocations.length > 0 && totalAllocated > 0) {
      for (const alloc of productAllocations) {
        const product = userProducts.find(p => p.id === alloc.productId);
        if (!product || alloc.allocated <= 0) continue;

        // Calculate product's share of total budget
        const budgetShare = alloc.allocated / totalAllocated;

        // Get seasonality and trend factors
        const seasonality = productSeasonality[product.id]?.seasonality || 1.0;
        const trend = productSeasonality[product.id]?.trend || 1.0;

        // Calculate visitors for this product (based on budget allocation)
        const productVisitors = Math.round(dailyVisitors * budgetShare);

        // Apply seasonality and trend to conversion rate
        let productConversionRate = (metrics.conversionRate / 100) * seasonality * trend;

        // Apply marketing effect (based on allocated budget)
        const marketingEffect = 1 + (alloc.allocated / 1000); // More budget = better marketing
        productConversionRate = productConversionRate * marketingEffect;

        // Apply event impacts
        if (currentEvent) {
          productConversionRate = productConversionRate * (1 + (currentEvent.impact.sales / 100));
        }

        // Calculate orders for this product
        const potentialOrders = Math.round(productVisitors * productConversionRate);

        // Get available inventory for this product (from SKU inventory)
        let availableInventory = 0;
        try {
          const inventoryResponse = await fetch(`/api/products/inventory?productId=${product.id}`, {
            headers: getAuthHeaders(),
          });
          const inventoryData = await inventoryResponse.json();
          if (inventoryData.success && inventoryData.inventory) {
            availableInventory = inventoryData.inventory.reduce((sum: number, inv: any) => sum + inv.availableQuantity, 0);
          }
        } catch (error) {
          console.error('Error fetching inventory:', error);
        }

        // Limit orders to available inventory
        const productOrders = Math.min(potentialOrders, availableInventory);
        const productRevenue = productOrders * product.sellingPrice;

        // Calculate costs
        const productCost = productOrders * product.cost;
        const productShipping = productOrders * shippingPerOrder;
        const productReturns = productRevenue * (metrics.returnRate / 100) * 0.5;

        // Marketing spend from allocated budget (5% daily)
        const productMarketingSpend = Math.min(alloc.allocated * 0.05, alloc.available);

        const productExpenses = productCost + productShipping + productReturns + productMarketingSpend;
        const productProfit = productRevenue - productExpenses;

        totalRevenue += productRevenue;
        totalExpenses += productExpenses;
        totalOrders += productOrders;

        // Deduct inventory from SKU inventory
        if (productOrders > 0) {
          try {
            // Get product SKU
            const inventoryResponse = await fetch(`/api/products/inventory?productId=${product.id}`, {
              headers: getAuthHeaders(),
            });
            const inventoryData = await inventoryResponse.json();
            if (inventoryData.success && inventoryData.inventory && inventoryData.inventory.length > 0) {
              // Deduct from first available SKU
              const firstSku = inventoryData.inventory.find((inv: any) => inv.availableQuantity > 0);
              if (firstSku) {
                const deductQty = Math.min(productOrders, firstSku.availableQuantity);
                const deductResponse = await fetch('/api/products/deduct-inventory', {
                  method: 'POST',
                  headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    productId: product.id,
                    sku: firstSku.sku,
                    quantity: deductQty
                  }),
                });
                if (!deductResponse.ok) {
                  console.error('Failed to deduct inventory:', await deductResponse.text());
                }
              } else {
                console.warn(`No available inventory for product ${product.id}, skipping deduction`);
              }
            } else {
              console.warn(`No SKU inventory found for product ${product.id}, skipping deduction`);
            }
          } catch (error) {
            console.error('Error deducting inventory:', error);
            // Don't block simulation if inventory deduction fails
          }
        }

        // Update product performance in database (optional endpoint)
        try {
          const perfResponse = await fetch('/api/products/performance', {
            method: 'POST',
            headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: product.id,
              orders: productOrders,
              revenue: productRevenue,
              expenses: productExpenses,
              profit: productProfit,
              marketingSpend: productMarketingSpend,
              seasonalityApplied: seasonality,
              trendApplied: trend
            }),
          });
          if (!perfResponse.ok) {
            console.warn('Product performance endpoint not available or failed');
          }
        } catch (error) {
          // Performance tracking is optional, don't block simulation
          console.log('Product performance tracking not available');
        }
      }
    } else {
      // Fallback: distribute evenly or use single product
      const selectedProduct = userProducts[Math.floor(Math.random() * userProducts.length)];
      const seasonality = productSeasonality[selectedProduct.id]?.seasonality || 1.0;
      const trend = productSeasonality[selectedProduct.id]?.trend || 1.0;

      let conversionRate = (metrics.conversionRate / 100) * seasonality * trend;
      if (currentEvent) {
        conversionRate = conversionRate * (1 + (currentEvent.impact.sales / 100));
      }

      const potentialOrders = Math.round(dailyVisitors * conversionRate);
      const availableInventory = businessStats.inventory;
      const actualOrders = Math.min(potentialOrders, availableInventory);

      totalRevenue = actualOrders * selectedProduct.sellingPrice;
      const productCost = actualOrders * selectedProduct.cost;
      const shipping = actualOrders * shippingPerOrder;
      const returns = totalRevenue * (metrics.returnRate / 100) * 0.5;
      const marketingSpend = businessStats.marketing * 0.05;

      totalExpenses = productCost + shipping + returns + marketingSpend;
      totalOrders = actualOrders;
    }

    // Apply event expense impact
    const expenseMultiplier = currentEvent ? (1 + (currentEvent.impact.expenses / 100)) : 1;
    const finalExpenses = totalExpenses * expenseMultiplier;
    const finalProfit = totalRevenue - finalExpenses;

    // Update business metrics
    setMetrics(prev => ({
      ...prev,
      conversionRate: Math.max(1, Math.min(5, prev.conversionRate + (Math.random() - 0.5) * 0.2)),
      abandonmentRate: Math.max(50, Math.min(80, prev.abandonmentRate + (Math.random() - 0.5) * 1)),
      averageOrderValue: Math.max(30, Math.min(70, prev.averageOrderValue + (Math.random() - 0.5) * 2)),
      returnRate: Math.max(5, Math.min(15, prev.returnRate + (Math.random() - 0.5) * 0.5))
    }));

    // Calculate total inventory from SKU inventory
    let totalInventory = 0;
    try {
      const inventoryResponse = await fetch('/api/products/inventory', {
        headers: getAuthHeaders(),
      });
      const inventoryData = await inventoryResponse.json();
      if (inventoryData.success && inventoryData.inventory) {
        totalInventory = inventoryData.inventory.reduce((sum: number, inv: any) => sum + inv.availableQuantity, 0);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }

    setBusinessStats(prev => {
      const newTotalRevenue = prev.revenue + totalRevenue;
      const newTotalExpenses = prev.expenses + finalExpenses;
      const newTotalProfit = newTotalRevenue - newTotalExpenses;

      setSimulationHistory(prevHistory => ({
        profit: [...prevHistory.profit, newTotalProfit]
      }));

      return {
        revenue: newTotalRevenue,
        expenses: newTotalExpenses,
        profit: newTotalProfit,
        orders: prev.orders + totalOrders,
        inventory: totalInventory, // Use actual SKU inventory count
        marketing: Math.max(0, prev.marketing - (totalExpenses * 0.1)) // Decrease marketing budget
      };
    });
  };

  const [showRestockConfirm, setShowRestockConfirm] = useState(false);
  const [showBudgetConfirm, setShowBudgetConfirm] = useState(false);
  const [showMarketingConfirm, setShowMarketingConfirm] = useState(false);

  const increaseMarketing = async () => {
    const marketingAmount = 100;

    // Check budget from wallet instead of profit
    try {
      const budgetResponse = await fetch('/api/budget/allocate', {
        headers: getAuthHeaders(),
      });
      const budgetData = await budgetResponse.json();

      if (budgetData.success) {
        const availableBudget = budgetData.budget?.available || 0;

        if (availableBudget < marketingAmount) {
          alert(`Insufficient budget. You need $${marketingAmount.toFixed(2)} but only have $${availableBudget.toFixed(2)} available in your wallet.`);
          return;
        }

        // Add funds to marketing budget (this is just increasing the marketing allocation)
        // The actual spending happens during simulation
        setBusinessStats(prev => ({
          ...prev,
          marketing: prev.marketing + marketingAmount
        }));
      } else {
        alert('Failed to check budget. Please try again.');
      }
    } catch (error) {
      console.error('Error checking budget:', error);
      alert('Failed to check budget. Please try again.');
    }
  };

  const restockInventory = async () => {
    // Restocking is now handled through the ProductInventoryManager component
    // This function is kept for backward compatibility but redirects to inventory manager
    alert('Please use the SKU & Inventory Management section below to restock products. This ensures proper SKU tracking and budget deduction.');
  };

  const toggleAutoSimulation = () => {
    setAutoSimulate(!autoSimulate);
  };

  const changeSimulationSpeed = (speed: number) => {
    setSimulationSpeed(speed);
  };

  const chartData = {
    labels: Array.from({ length: simulationHistory.profit.length }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Profit Over Time',
        data: simulationHistory.profit,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Business Profit Simulation',
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
          <p className="text-body text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const handleProductAdded = () => {
    // Reload dashboard state to refresh hasProducts and userProducts
    loadDashboardState();
  };

  if (!hasProducts) {
    return (
      <div className="max-w-3xl mx-auto pt-12">
        <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200/50">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <FiAlertCircle className="text-yellow-600" size={24} />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-title-1 font-bold text-gray-900 mb-2">Add Products First</h2>
              <p className="text-body text-gray-700 mb-6 leading-relaxed">
                You need to add products to your catalog before you can run the simulation.
                The simulation uses your actual products to calculate sales, revenue, and profit.
              </p>
              <div className="flex flex-wrap gap-3">
                <AddProductForm onSuccess={handleProductAdded} />
                <button
                  onClick={() => router.push('/products/recommendations')}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <FiTrendingUp /> Get AI Recommendations
                </button>
                <button
                  onClick={() => router.push('/products/analyze')}
                  className="btn btn-accent flex items-center gap-2"
                >
                  <FiPlus /> Analyze Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-display-3 font-bold text-gray-900 mb-2">Business Dashboard</h1>
          <p className="text-body text-gray-600">Monitor your business performance and make data-driven decisions</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {saving && (
            <span className="text-sm text-gray-500 flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-200 border-t-primary-600"></div>
              Saving...
            </span>
          )}
          <AddProductForm onSuccess={handleProductAdded} />
          <button
            onClick={() => router.push('/products')}
            className="btn btn-secondary text-sm flex items-center gap-2"
          >
            <FiPackage /> View Products
          </button>
          <button
            onClick={() => router.push('/products/dashboard')}
            className="btn btn-primary text-sm flex items-center gap-2"
          >
            <FiActivity /> Product Dashboard
          </button>
        </div>
      </div>

      {/* Market Event Alert */}
      {currentEvent && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200/50"
        >
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <FiAlertCircle className="text-yellow-600" size={24} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-title-2 font-bold text-gray-900 mb-2">{currentEvent.title}</h3>
              <p className="text-body text-gray-700 mb-4">{currentEvent.description}</p>
              <div className="flex flex-wrap gap-4">
                {currentEvent.impact.sales !== 0 && (
                  <span className={`badge ${currentEvent.impact.sales > 0 ? 'badge-success' : 'badge-danger'}`}>
                    Sales: {currentEvent.impact.sales > 0 ? '+' : ''}{currentEvent.impact.sales}%
                  </span>
                )}
                {currentEvent.impact.expenses !== 0 && (
                  <span className={`badge ${currentEvent.impact.expenses < 0 ? 'badge-success' : 'badge-danger'}`}>
                    Expenses: {currentEvent.impact.expenses > 0 ? '+' : ''}{currentEvent.impact.expenses}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Business Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Total Revenue" value={`$${businessStats.revenue.toFixed(2)}`} icon={<FiDollarSign className="text-green-500" />} />
        <StatCard title="Total Expenses" value={`$${businessStats.expenses.toFixed(2)}`} icon={<FiDollarSign className="text-red-500" />} />
        <StatCard title="Total Profit" value={`$${(businessStats.revenue - businessStats.expenses).toFixed(2)}`} icon={<FiTrendingUp className="text-blue-500" />} />
        <StatCard title="Orders Fulfilled" value={businessStats.orders.toString()} icon={<FiShoppingCart className="text-purple-500" />} />
      </div>

      {/* Business Metrics */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
            <FiActivity className="text-primary-600" size={20} />
          </div>
          <h2 className="text-title-1 font-bold text-gray-900">Real-World Metrics</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 rounded-xl bg-gray-50">
            <h3 className="text-subhead text-gray-600 mb-2">Conversion Rate</h3>
            <p className="text-display-3 font-bold text-gray-900 mb-1">{metrics.conversionRate.toFixed(1)}%</p>
            <p className="text-caption text-gray-500">Industry avg: 1.5-3%</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-gray-50">
            <h3 className="text-subhead text-gray-600 mb-2">Cart Abandonment</h3>
            <p className="text-display-3 font-bold text-gray-900 mb-1">{metrics.abandonmentRate.toFixed(1)}%</p>
            <p className="text-caption text-gray-500">Industry avg: 65-70%</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-gray-50">
            <h3 className="text-subhead text-gray-600 mb-2">Avg. Order Value</h3>
            <p className="text-display-3 font-bold text-gray-900 mb-1">${metrics.averageOrderValue.toFixed(2)}</p>
            <p className="text-caption text-gray-500">Varies by niche</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-gray-50">
            <h3 className="text-subhead text-gray-600 mb-2">Return Rate</h3>
            <p className="text-display-3 font-bold text-gray-900 mb-1">{metrics.returnRate.toFixed(1)}%</p>
            <p className="text-caption text-gray-500">Industry avg: 8-10%</p>
          </div>
        </div>
      </div>

      {/* Budget Allocation */}
      <div>
        <BudgetAllocation />
      </div>

      {/* SKU & Inventory Management */}
      <div id="inventory-manager">
        <ProductInventoryManager />
      </div>

      {/* Actions Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card card-hover">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <FiPackage className="text-blue-600" size={20} />
            </div>
            <h2 className="text-title-2 font-bold text-gray-900">Inventory Management</h2>
          </div>
          <p className="text-body text-gray-600 mb-4">
            Current Stock: <span className="font-bold text-title-2 text-gray-900">{businessStats.inventory}</span> units
          </p>
          <button
            onClick={() => setShowRestockConfirm(true)}
            className="btn btn-secondary w-full flex items-center justify-center gap-2"
            disabled={businessStats.inventory > 50}
          >
            <FiRefreshCw /> Restock (20 units)
          </button>
        </div>

        <div className="card card-hover">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <FiTarget className="text-purple-600" size={20} />
            </div>
            <h2 className="text-title-2 font-bold text-gray-900">Marketing</h2>
          </div>
          <p className="text-body text-gray-600 mb-4">
            Current Budget: <span className="font-bold text-title-2 text-gray-900">${businessStats.marketing.toFixed(2)}</span>
          </p>
          <button
            onClick={() => setShowMarketingConfirm(true)}
            className="btn btn-secondary w-full flex items-center justify-center gap-2"
          >
            <FiPlus /> Increase Budget ($100)
          </button>
        </div>

        <div className="card card-hover">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
              <FiPlay className="text-accent-600" size={20} />
            </div>
            <h2 className="text-title-2 font-bold text-gray-900">Simulation Control</h2>
          </div>
          <p className="text-body text-gray-600 mb-4">
            Current Day: <span className="font-bold text-title-2 text-gray-900">{day}</span>
          </p>

          <div className="flex items-center mb-4">
            <span className="text-subhead text-gray-600 mr-3">Speed:</span>
            <div className="flex gap-2">
              {simulationSpeeds.map((speed) => (
                <button
                  key={speed.value}
                  onClick={() => changeSimulationSpeed(speed.value)}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${simulationSpeed === speed.value
                    ? 'bg-primary-600 text-white shadow-apple'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {speed.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={simulateDay}
              className="btn btn-accent flex items-center justify-center gap-2"
              disabled={businessStats.inventory <= 0 || autoSimulate}
            >
              <FiPlay /> Next Day
            </button>
            <button
              onClick={toggleAutoSimulation}
              className={`btn ${autoSimulate ? 'btn-secondary' : 'btn-primary'} flex items-center justify-center gap-2`}
              disabled={businessStats.inventory <= 0}
            >
              {autoSimulate ? 'Pause' : 'Auto-Run'}
            </button>
          </div>
        </div>
      </div>

      {/* Active Products Section */}
      {userProducts.length > 0 && (
        <div className="card">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <FiPackage className="text-indigo-600" size={20} />
              </div>
              <div>
                <h2 className="text-title-1 font-bold text-gray-900">Active Products in Simulation</h2>
                <p className="text-subhead text-gray-600 mt-1">
                  Revenue and profit are calculated based on these products
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/products')}
              className="btn btn-ghost text-sm flex items-center gap-2"
            >
              Manage Products <FiPackage size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userProducts.map((product) => {
              const profitMargin = product.sellingPrice > 0
                ? ((product.sellingPrice - product.cost) / product.sellingPrice * 100).toFixed(1)
                : '0';
              return (
                <div key={product.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 hover:border-gray-200 transition-all">
                  <h3 className="font-semibold text-title-3 mb-3 truncate" title={product.name}>{product.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium capitalize text-gray-900">{product.category}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cost:</span>
                      <span className="font-medium text-accent-600">${product.cost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium text-primary-600">${product.sellingPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="text-gray-600">Profit Margin:</span>
                      <span className={`font-bold ${parseFloat(profitMargin) > 0 ? 'text-accent-600' : 'text-red-600'}`}>
                        {profitMargin}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Profit Chart */}
      {simulationHistory.profit.length > 0 && (
        <div className="card">
          <h2 className="text-title-1 font-bold text-gray-900 mb-6">Profit Trend</h2>
          <div className="overflow-x-auto">
            <Line options={chartOptions} data={chartData} />
          </div>
        </div>
      )}

      {/* Business Insights */}
      <BusinessInsights />

      {/* Marketing Hub - Organic & Paid Marketing */}
      <div className="mt-6">
        <MarketingHub budget={businessStats.marketing} />
      </div>

      {/* Financial Dashboard - P&L Statement */}
      <div className="mt-6">
        <FinancialDashboard
          revenue={businessStats.revenue}
          expenses={businessStats.expenses}
          orders={businessStats.orders}
          adSpend={businessStats.marketing * 0.1}
        />
      </div>

      {/* Sales Funnel - Conversion Tracking */}
      <div className="mt-6">
        <SalesFunnel
          day={day}
          visitors={Math.floor((100 + (day / 10)) * 10)}
          orders={businessStats.orders}
          revenue={businessStats.revenue}
          organicTraffic={Math.floor((100 + (day / 10)) * 6)}
          paidTraffic={Math.floor((100 + (day / 10)) * 4)}
        />
      </div>

      {/* Logistics Tracker - Shipping Simulation */}
      <div className="mt-6">
        <LogisticsTracker orders={businessStats.orders} />
      </div>

      {/* Ad Metrics Checker */}
      <div className="mt-6">
        <AdMetricsChecker />
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={showRestockConfirm}
        title="Restock Inventory"
        message="Please use the SKU & Inventory Management section below to restock products. This ensures proper SKU tracking and budget deduction from your wallet."
        confirmText="Go to Inventory Manager"
        cancelText="Cancel"
        variant="info"
        onConfirm={() => {
          setShowRestockConfirm(false);
          // Scroll to inventory manager section
          document.getElementById('inventory-manager')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onCancel={() => setShowRestockConfirm(false)}
      />

      <ConfirmationDialog
        isOpen={showMarketingConfirm}
        title="Increase Marketing Budget"
        message="Are you sure you want to increase your marketing budget by $100? This will be deducted from your profit."
        confirmText="Increase"
        cancelText="Cancel"
        variant="info"
        onConfirm={() => {
          increaseMarketing();
          setShowMarketingConfirm(false);
        }}
        onCancel={() => setShowMarketingConfirm(false)}
      />
    </div>
  );
}

// Stat Card Component - Apple Style
function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card card-hover"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
          <div className="text-2xl">{icon}</div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-subhead text-gray-600 mb-1 truncate">{title}</h3>
          <p className="text-title-1 font-bold text-gray-900 truncate">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}