'use client';

import { useState } from 'react';
import { FiLink, FiSearch, FiTrendingUp, FiAlertCircle, FiCheckCircle, FiDollarSign, FiUsers, FiActivity } from 'react-icons/fi';
import { getAuthHeaders } from '@/lib/auth';
import { motion } from 'framer-motion';

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
        const errorMsg = data.details || data.error || 'Failed to analyze product';
        setError(errorMsg);
        console.error('Analysis error:', data);
        return;
      }

      if (data.analysis) {
        setAnalysis(data.analysis);
      } else {
        setError('Invalid response from server');
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to analyze product. Please check your connection and try again.';
      setError(errorMsg);
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center">
            <FiSearch className="text-primary-600 text-xl" />
          </div>
          <div>
            <h2 className="text-title-1 font-bold text-gray-900">Product Analysis</h2>
            <p className="text-body text-gray-500">Analyze any product URL for dropshipping potential</p>
          </div>
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
            Product URL (Amazon, Myntra, or personal website)
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLink className="text-gray-400" />
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.amazon.com/product/..."
                className="input pl-10"
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="btn btn-primary whitespace-nowrap flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <FiSearch /> Analyze
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 flex items-center gap-3"
        >
          <FiAlertCircle className="text-xl flex-shrink-0" />
          <p>{error}</p>
        </motion.div>
      )}

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="card">
            <h3 className="text-title-2 font-bold text-gray-900 mb-6">{analysis.productName || 'Analysis Results'}</h3>

            {analysis.feasibility && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <FiTrendingUp className="text-primary-600" />
                  <span className="text-title-3 font-semibold text-gray-900">Feasibility Assessment</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Score</p>
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-bold text-gray-900">{analysis.feasibility.score || 'N/A'}</span>
                      <span className="text-sm text-gray-400 mb-1">/100</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Demand</p>
                    <p className="text-lg font-bold text-gray-900 capitalize">{analysis.feasibility.demand || 'N/A'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Profit Potential</p>
                    <p className="text-lg font-bold text-gray-900 capitalize">{analysis.feasibility.profitPotential || 'N/A'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Recommendation</p>
                    <p className={`text-lg font-bold capitalize ${analysis.feasibility.recommendation?.includes('highly') ? 'text-green-600' :
                        analysis.feasibility.recommendation?.includes('avoid') ? 'text-red-600' : 'text-blue-600'
                      }`}>
                      {analysis.feasibility.recommendation?.replace('_', ' ') || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.competition && (
                <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100">
                  <div className="flex items-center gap-2 mb-4">
                    <FiActivity className="text-orange-600" />
                    <h4 className="font-semibold text-gray-900">Competition</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Similar Products</span>
                      <span className="font-medium">{analysis.competition.similarProducts || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Price</span>
                      <span className="font-medium">${analysis.competition.averagePrice || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturation</span>
                      <span className="font-medium capitalize">{analysis.competition.marketSaturation || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {analysis.vendors && analysis.vendors.length > 0 && (
                <div className="p-5 rounded-2xl bg-green-50/50 border border-green-100">
                  <div className="flex items-center gap-2 mb-4">
                    <FiUsers className="text-green-600" />
                    <h4 className="font-semibold text-gray-900">Vendor Options</h4>
                  </div>
                  <div className="space-y-3">
                    {analysis.vendors.slice(0, 3).map((vendor: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-white/60 p-2 rounded-lg">
                        <div>
                          <p className="font-medium capitalize text-sm">{vendor.platform}</p>
                          <p className="text-xs text-gray-500">MOQ: {vendor.estimatedMOQ || 'N/A'}</p>
                        </div>
                        <p className="font-bold text-green-700">${vendor.estimatedPrice || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {analysis.riskFactors && analysis.riskFactors.length > 0 && (
              <div className="mt-6 p-5 rounded-2xl bg-red-50/50 border border-red-100">
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-900">
                  <FiAlertCircle className="text-red-600" />
                  Risk Factors
                </h4>
                <ul className="space-y-2">
                  {analysis.riskFactors.map((risk: string, idx: number) => (
                    <li key={idx} className="text-sm text-red-800 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"></span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.overallAssessment && (
              <div className="mt-6 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <h4 className="font-semibold mb-2 text-gray-900">Overall Assessment</h4>
                <p className="text-body text-gray-600 leading-relaxed">{analysis.overallAssessment}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
