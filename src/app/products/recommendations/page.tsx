'use client';

import { useState, useEffect } from 'react';
import { FiTrendingUp, FiDollarSign, FiPackage } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getAuthHeaders } from '@/lib/auth';

export default function ProductRecommendationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
      return;
    }
    fetchRecommendations();
  }, [router]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/products/recommendations', {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch recommendations');
        return;
      }

      const recs = Array.isArray(data.recommendations) 
        ? data.recommendations 
        : (data.recommendations?.recommendations || []);
      
      setRecommendations(recs);
    } catch (err) {
      setError('Failed to fetch recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-green-500" />
            Product Recommendations
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <p>Loading recommendations...</p>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-lg mb-2">{rec.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 capitalize">{rec.category}</p>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Cost:</span>
                      <span className="font-bold">${rec.estimatedCost || rec.cost || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Selling Price:</span>
                      <span className="font-bold">${rec.sellingPrice || rec.price || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Profit Margin:</span>
                      <span className="font-bold text-green-600">
                        {rec.profitMargin ? `${rec.profitMargin}%` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">MOQ:</span>
                      <span className="font-bold">{rec.recommendedMOQ || rec.moq || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs capitalize ${
                      rec.demand === 'high' ? 'bg-green-100 text-green-700' :
                      rec.demand === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      Demand: {rec.demand || 'N/A'}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs capitalize ${
                      rec.competition === 'low' ? 'bg-green-100 text-green-700' :
                      rec.competition === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      Competition: {rec.competition || 'N/A'}
                    </span>
                  </div>

                  {rec.reason && (
                    <p className="text-sm text-gray-600 mt-2">{rec.reason}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recommendations available. Please set your budget and product genre in settings.</p>
          )}
        </div>
      </div>
    </div>
  );
}

