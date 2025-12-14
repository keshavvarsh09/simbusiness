import { useState } from 'react';
import { FiTrendingUp, FiAlertTriangle, FiBook, FiAward, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function BusinessInsights() {
  const [activeInsight, setActiveInsight] = useState<number | null>(null);

  // Real-world dropshipping educational content
  const businessInsights = [
    {
      title: "Starting Costs",
      icon: <FiTrendingUp className="text-blue-500" />,
      content: "Typical dropshipping startup costs range from $150-$1,500. This includes website hosting ($29/month), premium theme ($60-180), apps/plugins ($50-100/month), and initial marketing ($100-1,000)."
    },
    {
      title: "Profit Margins",
      icon: <FiTrendingUp className="text-green-500" />,
      content: "Most successful dropshipping stores maintain a 15-40% profit margin. Products priced below $20 typically need at least 30% margin to be sustainable when accounting for returns and marketing costs."
    },
    {
      title: "Shipping Times",
      icon: <FiAlertTriangle className="text-yellow-500" />,
      content: "Shipping time is a major factor in customer satisfaction. 38% of customers will not return after a negative delivery experience. Consider suppliers that offer 7-14 day shipping or faster."
    },
    {
      title: "Market Research",
      icon: <FiBook className="text-purple-500" />,
      content: "Successful dropshippers spend 60% of their initial time on market research. Before launching products, analyze at least 5 competitors, review their feedback, shipping policies, and pricing strategies."
    },
    {
      title: "Return Rates",
      icon: <FiAlertTriangle className="text-red-500" />,
      content: "The average return rate for e-commerce is 20-30%. Physical products that customers can't try before buying (like clothing) have higher return rates. Factor this into your pricing strategy."
    },
    {
      title: "Success Rate",
      icon: <FiAward className="text-amber-500" />,
      content: "Only about 10% of dropshipping stores achieve sustainable success. The majority of successes come from entrepreneurs who tested multiple products before finding profitable ones and who maintained consistent marketing."
    }
  ];

  const toggleInsight = (index: number) => {
    setActiveInsight(activeInsight === index ? null : index);
  };

  return (
    <div className="card bg-white/50 backdrop-blur-sm border-white/60">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
          <FiBook size={20} />
        </div>
        <div>
          <h2 className="text-title-2 font-bold text-gray-900">Real-World Insights</h2>
          <p className="text-caption text-gray-500">Learn from industry data</p>
        </div>
      </div>

      <div className="space-y-3">
        {businessInsights.map((insight, index) => (
          <motion.div
            key={index}
            className={`border rounded-xl overflow-hidden transition-colors duration-200 ${activeInsight === index ? 'bg-white border-blue-100 shadow-sm' : 'bg-white/50 border-transparent hover:bg-white'
              }`}
          >
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleInsight(index)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${activeInsight === index ? 'bg-blue-50' : 'bg-gray-50'}`}>
                  {insight.icon}
                </div>
                <span className={`font-medium ${activeInsight === index ? 'text-blue-700' : 'text-gray-700'}`}>
                  {insight.title}
                </span>
              </div>
              <span className="text-gray-400">
                {activeInsight === index ? <FiChevronUp /> : <FiChevronDown />}
              </span>
            </div>

            <AnimatePresence>
              {activeInsight === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-4 pb-4 pt-0">
                    <p className="text-sm text-gray-600 leading-relaxed pl-[3.25rem]">
                      {insight.content}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}