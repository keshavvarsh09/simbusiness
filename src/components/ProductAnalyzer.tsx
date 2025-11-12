'use client';

import { useState } from 'react';
import { FiLink, FiSearch, FiTrendingUp, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { getAuthHeaders } from '@/lib/auth';

export default function ProductAnalyzer() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!url) {
      setError('Please enter a product URL');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await fetch('/api/products/analyze', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to analyze product');
        return;
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError('Failed to analyze product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FiSearch className="text-blue-500" />
        Product Analysis
      </h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product URL (Amazon, Myntra, or personal website)
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.amazon.com/product/..."
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <FiLink />
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center gap-2">
          <FiAlertCircle />
          {error}
        </div>
      )}

      {analysis && (
        <div className="space-y-4">
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">{analysis.productName || 'Product Analysis'}</h3>
            
            {analysis.feasibility && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FiTrendingUp className="text-blue-600" />
                  <span className="font-semibold">Feasibility Assessment</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                  <div>
                    <p className="text-sm text-gray-600">Score</p>
                    <p className="text-xl font-bold">{analysis.feasibility.score || 'N/A'}/100</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Demand</p>
                    <p className="text-xl font-bold capitalize">{analysis.feasibility.demand || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Profit Potential</p>
                    <p className="text-xl font-bold capitalize">{analysis.feasibility.profitPotential || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Recommendation</p>
                    <p className="text-xl font-bold capitalize">
                      {analysis.feasibility.recommendation?.replace('_', ' ') || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {analysis.competition && (
              <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold mb-2">Competition Analysis</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Similar Products</p>
                    <p className="text-lg font-bold">{analysis.competition.similarProducts || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Price</p>
                    <p className="text-lg font-bold">${analysis.competition.averagePrice || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Market Saturation</p>
                    <p className="text-lg font-bold capitalize">{analysis.competition.marketSaturation || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {analysis.vendors && analysis.vendors.length > 0 && (
              <div className="mb-4 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold mb-2">Vendor Options</h4>
                <div className="space-y-2">
                  {analysis.vendors.map((vendor: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-white rounded">
                      <div>
                        <p className="font-medium capitalize">{vendor.platform}</p>
                        <p className="text-sm text-gray-600">MOQ: {vendor.estimatedMOQ || 'N/A'}</p>
                      </div>
                      <p className="font-bold">${vendor.estimatedPrice || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.riskFactors && analysis.riskFactors.length > 0 && (
              <div className="mb-4 p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FiAlertCircle className="text-red-600" />
                  Risk Factors
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.riskFactors.map((risk: string, idx: number) => (
                    <li key={idx} className="text-sm">{risk}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.overallAssessment && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Overall Assessment</h4>
                <p className="text-sm text-gray-700">{analysis.overallAssessment}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

