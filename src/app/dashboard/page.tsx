'use client';

import { useState, useEffect } from 'react';
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

  // Simulate business operations
  const simulateDay = () => {
    setDay(prevDay => prevDay + 1);
    
    // Randomly trigger market events (10% chance each day)
    if (Math.random() < 0.1) {
      const newEvent = marketEvents[Math.floor(Math.random() * marketEvents.length)];
      setCurrentEvent(newEvent);
    } else if (currentEvent) {
      // Clear event after a day
      setCurrentEvent(null);
    }
    
    // Apply marketing effect
    const marketingEffect = 1 + (businessStats.marketing / 500);
    
    // Calculate sales with realistic e-commerce metrics
    // Base visitors
    const dailyVisitors = 100 + (day / 10); // Traffic grows slightly over time
    
    // Apply conversion rate (with marketing and event effects)
    let conversionRate = metrics.conversionRate / 100; // Convert percentage to decimal
    
    // Apply event impacts if present
    if (currentEvent) {
      conversionRate = conversionRate * (1 + (currentEvent.impact.sales / 100));
    }
    
    // Apply marketing effect
    conversionRate = conversionRate * marketingEffect;
    
    // Calculate orders based on visitors and conversion rate
    const potentialOrders = Math.round(dailyVisitors * conversionRate);
    const availableInventory = businessStats.inventory;
    const actualOrders = Math.min(potentialOrders, availableInventory);
    
    // Calculate revenue based on order value (with variation)
    const orderValueVariation = 0.2; // 20% variation in order value
    const baseOrderValue = metrics.averageOrderValue;
    const actualOrderValue = baseOrderValue * (1 - orderValueVariation/2 + Math.random() * orderValueVariation);
    
    const newRevenue = actualOrders * actualOrderValue;
    
    // Calculate costs (product cost, shipping, returns handling)
    const costPerOrder = actualOrderValue * 0.4; // 40% COGS
    const shippingPerOrder = 5;
    const returnCost = newRevenue * (metrics.returnRate / 100) * 0.5; // 50% of returned revenue is lost
    
    // Marketing spend
    const marketingSpend = businessStats.marketing * 0.05; // Daily marketing spend
    
    // Total expenses
    const newExpenses = (actualOrders * (costPerOrder + shippingPerOrder)) + marketingSpend + returnCost;
    
    // Apply event expense impact
    const expenseMultiplier = currentEvent ? (1 + (currentEvent.impact.expenses / 100)) : 1;
    const finalExpenses = newExpenses * expenseMultiplier;
    
    const newProfit = newRevenue - finalExpenses;
    
    // Update business metrics (simulating real business conditions)
    setMetrics(prev => ({
      ...prev,
      conversionRate: Math.max(1, Math.min(5, prev.conversionRate + (Math.random() - 0.5) * 0.2)),
      abandonmentRate: Math.max(50, Math.min(80, prev.abandonmentRate + (Math.random() - 0.5) * 1)),
      averageOrderValue: Math.max(30, Math.min(70, prev.averageOrderValue + (Math.random() - 0.5) * 2)),
      returnRate: Math.max(5, Math.min(15, prev.returnRate + (Math.random() - 0.5) * 0.5))
    }));
    
    setBusinessStats(prev => ({
      revenue: prev.revenue + newRevenue,
      expenses: prev.expenses + finalExpenses,
      profit: prev.profit + newProfit,
      orders: prev.orders + actualOrders,
      inventory: prev.inventory - actualOrders,
      marketing: Math.max(0, prev.marketing - marketingSpend) // Decrease marketing budget
    }));

    setSimulationHistory(prev => ({
      profit: [...prev.profit, businessStats.profit + newProfit]
    }));
  };

  const increaseMarketing = () => {
    setBusinessStats(prev => ({
      ...prev,
      marketing: prev.marketing + 100,
      expenses: prev.expenses + 100 // Add marketing cost immediately
    }));
  };

  const restockInventory = () => {
    const restockAmount = 20;
    const restockCost = restockAmount * 15; // Average cost per item
    setBusinessStats(prev => ({
      ...prev,
      inventory: prev.inventory + restockAmount,
      expenses: prev.expenses + restockCost
    }));
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Business Dashboard</h1>
        
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
          <StatCard title="Total Profit" value={`$${businessStats.profit.toFixed(2)}`} icon={<FiTrendingUp className="text-blue-500" />} />
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

        {/* Actions Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="card bg-white p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2"><FiPackage /> Inventory Management</h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base text-gray-600">Current Stock: <span className="font-bold text-base sm:text-lg">{businessStats.inventory}</span> units</p>
            <button 
              onClick={restockInventory}
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
              onClick={increaseMarketing}
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
      </main>
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