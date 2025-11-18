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
import BusinessInsights from '@/components/BusinessInsights';
import { isAuthenticated, getAuthHeaders } from '@/lib/auth';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import AdMetricsChecker from '@/components/AdMetricsChecker';
import AddProductForm from '@/components/AddProductForm';
import BudgetAllocation from '@/components/BudgetAllocation';

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
        setBusinessStats({
          revenue: stateData.state.revenue,
          expenses: stateData.state.expenses,
          profit: calculatedProfit, // Recalculate to ensure accuracy
          orders: stateData.state.orders,
          inventory: stateData.state.inventory,
          marketing: stateData.state.marketing
        });
        setDay(stateData.state.day);
        setMetrics(stateData.state.metrics);
        setSimulationHistory(stateData.state.simulationHistory);
        setHasProducts(stateData.hasProducts);
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

      // Get seasonality factors
      const seasonalityResponse = await fetch('/api/products/seasonality', {
        headers: getAuthHeaders(),
      });
      const seasonalityData = await seasonalityResponse.json();
      if (seasonalityData.success) {
        seasonalityData.products.forEach((p: any) => {
          productSeasonality[p.productId] = {
            seasonality: p.calculatedSeasonality || 1.0,
            trend: p.currentTrend || 1.0
          };
        });
      }
    } catch (error) {
      console.error('Error fetching budget/seasonality:', error);
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
        const productOrders = Math.round(productVisitors * productConversionRate);
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
        
        // Update product performance in database
        try {
          await fetch('/api/products/performance', {
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
        } catch (error) {
          console.error('Error saving product performance:', error);
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
        inventory: Math.max(0, prev.inventory - totalOrders),
        marketing: Math.max(0, prev.marketing - (totalExpenses * 0.1)) // Decrease marketing budget
      };
    });
  };

  const [showRestockConfirm, setShowRestockConfirm] = useState(false);
  const [showBudgetConfirm, setShowBudgetConfirm] = useState(false);
  const [showMarketingConfirm, setShowMarketingConfirm] = useState(false);

  const increaseMarketing = () => {
    const marketingAmount = 100;
    const currentProfit = businessStats.revenue - businessStats.expenses;
    
    if (currentProfit < marketingAmount) {
      alert(`Insufficient funds. You need $${marketingAmount.toFixed(2)} but only have $${currentProfit.toFixed(2)}.`);
      return;
    }
    
    setBusinessStats(prev => {
      const newExpenses = prev.expenses + marketingAmount;
      const newProfit = prev.revenue - newExpenses;
      
      return {
        ...prev,
        marketing: prev.marketing + marketingAmount,
        expenses: newExpenses,
        profit: newProfit // Recalculate profit correctly
      };
    });
  };

  const restockInventory = () => {
    const restockAmount = 20;
    
    // Calculate restock cost based on actual product costs
    let restockCost: number;
    if (userProducts.length > 0) {
      // Use average cost from actual products
      const avgCost = userProducts.reduce((sum, p) => sum + p.cost, 0) / userProducts.length;
      restockCost = restockAmount * avgCost;
    } else {
      // Fallback to default
      restockCost = restockAmount * 15;
    }
    
    const currentProfit = businessStats.revenue - businessStats.expenses;
    
    if (currentProfit < restockCost) {
      alert(`Insufficient funds. You need $${restockCost.toFixed(2)} but only have $${currentProfit.toFixed(2)}.`);
      return;
    }
    
    setBusinessStats(prev => {
      const newExpenses = prev.expenses + restockCost;
      const newProfit = prev.revenue - newExpenses;
      
      return {
        ...prev,
        inventory: prev.inventory + restockAmount,
        expenses: newExpenses,
        profit: newProfit // Recalculate profit correctly
      };
    });
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="text-yellow-600 mt-1 flex-shrink-0" size={24} />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-yellow-800 mb-2">Add Products First</h2>
                <p className="text-yellow-700 mb-4">
                  You need to add products to your catalog before you can run the simulation. 
                  The simulation uses your actual products to calculate sales, revenue, and profit.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <AddProductForm onSuccess={handleProductAdded} />
                  <button
                    onClick={() => router.push('/products/recommendations')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <FiTrendingUp /> Get AI Recommendations
                  </button>
                  <button
                    onClick={() => router.push('/products/analyze')}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
                  >
                    <FiPlus /> Analyze Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex justify-between items-center mb-4 sm:mb-6 flex-wrap gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold">Business Dashboard</h1>
          <div className="flex items-center gap-3">
            {saving && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>
                Saving...
              </span>
            )}
            <AddProductForm onSuccess={handleProductAdded} />
            <button
              onClick={() => router.push('/products')}
              className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 flex items-center gap-2"
            >
              <FiPackage /> View Products
            </button>
          </div>
        </div>
        
        {/* Market Event Alert */}
        {currentEvent && (
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <div className="text-yellow-500 mt-1 flex-shrink-0">
              <FiAlertCircle size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base sm:text-lg text-yellow-700">{currentEvent.title}</h3>
              <p className="text-sm sm:text-base text-yellow-600">{currentEvent.description}</p>
              <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:gap-4">
                {currentEvent.impact.sales !== 0 && (
                  <span className={`text-xs sm:text-sm font-medium ${currentEvent.impact.sales > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Sales: {currentEvent.impact.sales > 0 ? '+' : ''}{currentEvent.impact.sales}%
                  </span>
                )}
                {currentEvent.impact.expenses !== 0 && (
                  <span className={`text-xs sm:text-sm font-medium ${currentEvent.impact.expenses < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Expenses: {currentEvent.impact.expenses > 0 ? '+' : ''}{currentEvent.impact.expenses}%
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Business Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard title="Total Revenue" value={`$${businessStats.revenue.toFixed(2)}`} icon={<FiDollarSign className="text-green-500" />} />
          <StatCard title="Total Expenses" value={`$${businessStats.expenses.toFixed(2)}`} icon={<FiDollarSign className="text-red-500" />} />
          <StatCard title="Total Profit" value={`$${(businessStats.revenue - businessStats.expenses).toFixed(2)}`} icon={<FiTrendingUp className="text-blue-500" />} />
          <StatCard title="Orders Fulfilled" value={businessStats.orders.toString()} icon={<FiShoppingCart className="text-purple-500" />} />
        </div>

        {/* Business Metrics */}
        <div className="card bg-white mb-6 sm:mb-8 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <FiActivity className="text-indigo-500" /> Real-World Metrics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
            <div className="p-3">
              <h3 className="text-gray-600 text-sm">Conversion Rate</h3>
              <p className="text-2xl font-bold">{metrics.conversionRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">(Industry avg: 1.5-3%)</p>
            </div>
            <div className="p-3">
              <h3 className="text-gray-600 text-sm">Cart Abandonment</h3>
              <p className="text-2xl font-bold">{metrics.abandonmentRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">(Industry avg: 65-70%)</p>
            </div>
            <div className="p-3">
              <h3 className="text-gray-600 text-sm">Avg. Order Value</h3>
              <p className="text-2xl font-bold">${metrics.averageOrderValue.toFixed(2)}</p>
              <p className="text-xs text-gray-500">(Varies by niche)</p>
            </div>
            <div className="p-3">
              <h3 className="text-gray-600 text-sm">Return Rate</h3>
              <p className="text-2xl font-bold">{metrics.returnRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">(Industry avg: 8-10%)</p>
            </div>
          </div>
        </div>

        {/* Budget Allocation */}
        <div className="mb-6 sm:mb-8">
          <BudgetAllocation />
        </div>

        {/* Actions Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="card bg-white p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2"><FiPackage /> Inventory Management</h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base text-gray-600">Current Stock: <span className="font-bold text-base sm:text-lg">{businessStats.inventory}</span> units</p>
            <button 
              onClick={() => setShowRestockConfirm(true)}
              className="btn btn-secondary w-full flex items-center justify-center gap-2 text-sm sm:text-base"
              disabled={businessStats.inventory > 50}
            >
              <FiRefreshCw /> <span className="hidden sm:inline">Restock (20 units)</span><span className="sm:hidden">Restock</span>
            </button>
          </div>

          <div className="card bg-white p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2"><FiTarget /> Marketing</h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base text-gray-600">Current Budget: <span className="font-bold text-base sm:text-lg">${businessStats.marketing.toFixed(2)}</span></p>
            <button 
              onClick={() => setShowMarketingConfirm(true)}
              className="btn btn-secondary w-full flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <FiPlus /> <span className="hidden sm:inline">Increase Budget ($100)</span><span className="sm:hidden">+$100</span>
            </button>
          </div>

          <div className="card bg-white p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2"><FiPlay /> Simulation Control</h2>
            <p className="mb-2 text-sm sm:text-base text-gray-600">Current Day: <span className="font-bold text-base sm:text-lg">{day}</span></p>
            
            <div className="flex items-center mb-3 sm:mb-4">
              <span className="text-xs sm:text-sm text-gray-600 mr-2">Speed:</span>
              <div className="flex gap-1">
                {simulationSpeeds.map((speed) => (
                  <button
                    key={speed.value}
                    onClick={() => changeSimulationSpeed(speed.value)}
                    className={`px-2 py-1 text-xs rounded-md ${
                      simulationSpeed === speed.value 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {speed.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={simulateDay}
                className="btn btn-accent flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
                disabled={businessStats.inventory <= 0 || autoSimulate}
              >
                <FiPlay /> <span className="hidden sm:inline">Next Day</span><span className="sm:hidden">Next</span>
              </button>
              <button 
                onClick={toggleAutoSimulation}
                className={`btn ${autoSimulate ? 'btn-secondary' : 'btn-primary'} flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base`}
                disabled={businessStats.inventory <= 0}
              >
                {autoSimulate ? 'Pause' : 'Auto-Run'}
              </button>
            </div>
          </div>
        </div>

        {/* Active Products Section */}
        {userProducts.length > 0 && (
          <div className="card bg-white mb-6 sm:mb-8 p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                <FiPackage className="text-indigo-500" /> Active Products in Simulation
              </h2>
              <button
                onClick={() => router.push('/products')}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Manage Products <FiPackage size={14} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              These products are currently being used in your simulation calculations. Revenue and profit are calculated based on these products.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userProducts.map((product) => {
                const profitMargin = product.sellingPrice > 0 
                  ? ((product.sellingPrice - product.cost) / product.sellingPrice * 100).toFixed(1)
                  : '0';
                return (
                  <div key={product.id} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <h3 className="font-semibold text-base mb-2 truncate" title={product.name}>{product.name}</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium capitalize">{product.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cost:</span>
                        <span className="font-medium text-green-600">${product.cost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium text-blue-600">${product.sellingPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Profit Margin:</span>
                        <span className={`font-medium ${parseFloat(profitMargin) > 0 ? 'text-green-600' : 'text-red-600'}`}>
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
          <div className="card bg-white mb-6 sm:mb-8 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Profit Trend</h2>
            <div className="overflow-x-auto">
              <Line options={chartOptions} data={chartData} />
            </div>
          </div>
        )}

        {/* Business Insights */}
        <BusinessInsights />

        {/* Ad Metrics Checker */}
        <div className="mt-6">
          <AdMetricsChecker />
        </div>
      </main>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={showRestockConfirm}
        title="Restock Inventory"
        message={`Are you sure you want to restock 20 units? This will cost $${userProducts.length > 0 
          ? (20 * (userProducts.reduce((sum, p) => sum + p.cost, 0) / userProducts.length)).toFixed(2)
          : (20 * 15).toFixed(2)
        } and will be deducted from your profit.`}
        confirmText="Restock"
        cancelText="Cancel"
        variant="info"
        onConfirm={() => {
          restockInventory();
          setShowRestockConfirm(false);
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

// Stat Card Component
function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="card bg-white p-5 flex items-center gap-4">
      <div className="text-3xl p-3 bg-gray-100 rounded-lg">{icon}</div>
      <div>
        <h3 className="text-gray-500 text-sm uppercase tracking-wide">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
} 