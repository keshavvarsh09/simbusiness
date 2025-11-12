'use client';

import { useState } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiTrendingDown, FiDollarSign } from 'react-icons/fi';
import { getAuthHeaders } from '@/lib/auth';

export default function BankruptcyChecker() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await fetch('/api/bankruptcy/check', {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to check bankruptcy risk');
        return;
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError('Failed to check bankruptcy risk. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-600';
    if (score < 60) return 'text-yellow-600';
    if (score < 80) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRiskLevel = (score: number) => {
    if (score < 30) return 'Low Risk';
    if (score < 60) return 'Moderate Risk';
    if (score < 80) return 'High Risk';
    return 'Critical Risk';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FiAlertTriangle className="text-red-500" />
        Bankruptcy Risk Analysis
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        Get a comprehensive analysis of your business financial health and bankruptcy risk.
      </p>

      <button
        onClick={handleCheck}
        disabled={loading}
        className="w-full bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2 mb-4"
      >
        <FiTrendingDown />
        {loading ? 'Analyzing...' : 'Check Bankruptcy Risk'}
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {analysis && (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border-2 ${
            analysis.riskScore < 30 ? 'bg-green-50 border-green-300' :
            analysis.riskScore < 60 ? 'bg-yellow-50 border-yellow-300' :
            analysis.riskScore < 80 ? 'bg-orange-50 border-orange-300' :
            'bg-red-50 border-red-300'
          }`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Risk Score</h3>
              <span className={`text-3xl font-bold ${getRiskColor(analysis.riskScore || 0)}`}>
                {analysis.riskScore || 0}/100
              </span>
            </div>
            <p className={`text-lg font-medium ${getRiskColor(analysis.riskScore || 0)}`}>
              {getRiskLevel(analysis.riskScore || 0)}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Status: <span className="font-semibold capitalize">{analysis.status || 'Unknown'}</span>
            </p>
          </div>

          {analysis.financialHealth && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FiDollarSign className="text-blue-600" />
                Financial Health
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Cash Flow</p>
                  <p className="text-lg font-bold capitalize">
                    {analysis.financialHealth.cashFlow || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Profitability</p>
                  <p className="text-lg font-bold capitalize">
                    {analysis.financialHealth.profitability || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Liquidity</p>
                  <p className="text-lg font-bold capitalize">
                    {analysis.financialHealth.liquidity || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {analysis.riskFactors && analysis.riskFactors.length > 0 && (
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FiAlertTriangle className="text-red-600" />
                Risk Factors
              </h3>
              <div className="space-y-2">
                {analysis.riskFactors.map((factor: any, idx: number) => (
                  <div key={idx} className="bg-white p-3 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{factor.factor}</p>
                        <p className="text-sm text-gray-600">{factor.impact}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        factor.severity === 'high' ? 'bg-red-100 text-red-700' :
                        factor.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {factor.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.criticalIssues && analysis.criticalIssues.length > 0 && (
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold mb-2">Critical Issues</h3>
              <ul className="list-disc list-inside space-y-1">
                {analysis.criticalIssues.map((issue: string, idx: number) => (
                  <li key={idx} className="text-sm">{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <FiCheckCircle className="text-green-600" />
                Recommendations
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {analysis.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="text-sm">{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {analysis.timeUntilBankruptcy && (
            <div className="p-4 bg-red-100 border-2 border-red-300 rounded-lg">
              <h3 className="font-semibold text-red-700 mb-2">⚠️ Time Until Bankruptcy</h3>
              <p className="text-lg font-bold text-red-800">{analysis.timeUntilBankruptcy}</p>
            </div>
          )}

          {analysis.detailedAnalysis && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Detailed Analysis</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{analysis.detailedAnalysis}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

