'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiInstagram, FiYoutube, FiTiktok, FiTrendingUp, FiBarChart, FiLink } from 'react-icons/fi';
import { getAuthHeaders, isAuthenticated } from '@/lib/auth';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function BrandBuildingPage() {
  const router = useRouter();
  const [platform, setPlatform] = useState<'instagram' | 'tiktok' | 'youtube'>('instagram');
  const [contentUrl, setContentUrl] = useState('');
  const [engagementMetrics, setEngagementMetrics] = useState({
    views: '',
    likes: '',
    comments: '',
    shares: '',
    followers: ''
  });
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
      return;
    }
  }, [router]);

  const handleAnalyze = async () => {
    if (!contentUrl) {
      setError('Please provide a content URL');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const metrics = {
        views: engagementMetrics.views ? parseInt(engagementMetrics.views) : undefined,
        likes: engagementMetrics.likes ? parseInt(engagementMetrics.likes) : undefined,
        comments: engagementMetrics.comments ? parseInt(engagementMetrics.comments) : undefined,
        shares: engagementMetrics.shares ? parseInt(engagementMetrics.shares) : undefined,
        followers: engagementMetrics.followers ? parseInt(engagementMetrics.followers) : undefined
      };

      const response = await fetch('/api/brand-building/analyze', {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentUrl,
          platform,
          engagementMetrics: Object.keys(metrics).reduce((acc: any, key) => {
            if (metrics[key as keyof typeof metrics] !== undefined) {
              acc[key] = metrics[key as keyof typeof metrics];
            }
            return acc;
          }, {})
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Ensure analysis is properly formatted
        let formattedAnalysis = data.analysis;
        if (typeof formattedAnalysis === 'string') {
          formattedAnalysis = { 
            performance: 'needs_improvement',
            detailedAnalysis: formattedAnalysis,
            strengths: [],
            weaknesses: [],
            recommendations: [],
            tools: []
          };
        }
        setAnalysis(formattedAnalysis);
      } else {
        const errorMsg = data.details 
          ? `${data.error}: ${data.details}` 
          : (data.error || 'Failed to analyze content');
        setError(errorMsg);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to analyze content');
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = () => {
    switch (platform) {
      case 'instagram':
        return <FiInstagram className="text-pink-600" />;
      case 'tiktok':
        return <FiTiktok className="text-black" />;
      case 'youtube':
        return <FiYoutube className="text-red-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <FiTrendingUp className="text-purple-600" />
          Brand Building & Content Analysis
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Analyze Content</h2>

              {/* Platform Selection */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Platform
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setPlatform('instagram')}
                    className={`w-full px-4 py-2 rounded-md font-medium flex items-center justify-center gap-2 ${
                      platform === 'instagram'
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FiInstagram />
                    Instagram
                  </button>
                  <button
                    onClick={() => setPlatform('tiktok')}
                    className={`w-full px-4 py-2 rounded-md font-medium flex items-center justify-center gap-2 ${
                      platform === 'tiktok'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FiTiktok />
                    TikTok
                  </button>
                  <button
                    onClick={() => setPlatform('youtube')}
                    className={`w-full px-4 py-2 rounded-md font-medium flex items-center justify-center gap-2 ${
                      platform === 'youtube'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FiYoutube />
                    YouTube
                  </button>
                </div>
              </div>

              {/* Content URL */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content URL
                </label>
                <div className="relative">
                  <FiLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    value={contentUrl}
                    onChange={(e) => setContentUrl(e.target.value)}
                    placeholder="https://instagram.com/p/..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Engagement Metrics (Optional) */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Engagement Metrics (Optional)
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={engagementMetrics.views}
                    onChange={(e) => setEngagementMetrics({ ...engagementMetrics, views: e.target.value })}
                    placeholder="Views"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  />
                  <input
                    type="number"
                    value={engagementMetrics.likes}
                    onChange={(e) => setEngagementMetrics({ ...engagementMetrics, likes: e.target.value })}
                    placeholder="Likes"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  />
                  <input
                    type="number"
                    value={engagementMetrics.comments}
                    onChange={(e) => setEngagementMetrics({ ...engagementMetrics, comments: e.target.value })}
                    placeholder="Comments"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  />
                  <input
                    type="number"
                    value={engagementMetrics.shares}
                    onChange={(e) => setEngagementMetrics({ ...engagementMetrics, shares: e.target.value })}
                    placeholder="Shares"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  />
                  <input
                    type="number"
                    value={engagementMetrics.followers}
                    onChange={(e) => setEngagementMetrics({ ...engagementMetrics, followers: e.target.value })}
                    placeholder="Total Followers"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Providing metrics helps generate more accurate analysis
                </p>
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={loading || !contentUrl}
                className="w-full bg-purple-600 text-white px-4 py-3 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FiBarChart />
                    Analyze Content
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-2">
            {analysis ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  {getPlatformIcon()}
                  Content Performance Analysis
                </h2>

                <div className="space-y-4">
                  {/* Performance Status */}
                  {analysis.performance && (
                    <div className={`p-4 rounded-lg border-2 ${
                      analysis.performance === 'excellent' ? 'bg-green-50 border-green-200' :
                      analysis.performance === 'good' ? 'bg-blue-50 border-blue-200' :
                      analysis.performance === 'needs_improvement' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800">Performance Status</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          analysis.performance === 'excellent' ? 'bg-green-600 text-white' :
                          analysis.performance === 'good' ? 'bg-blue-600 text-white' :
                          analysis.performance === 'needs_improvement' ? 'bg-yellow-600 text-white' :
                          'bg-red-600 text-white'
                        }`}>
                          {analysis.performance.toUpperCase().replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Strengths */}
                  {analysis.strengths && analysis.strengths.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <FiTrendingUp className="text-green-600" />
                        Strengths
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 bg-green-50 p-4 rounded-lg">
                        {analysis.strengths.map((strength: string, idx: number) => (
                          <li key={idx}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Weaknesses */}
                  {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <FiBarChart className="text-red-600" />
                        Areas for Improvement
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 bg-red-50 p-4 rounded-lg">
                        {analysis.weaknesses.map((weakness: string, idx: number) => (
                          <li key={idx}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {analysis.recommendations && analysis.recommendations.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Recommendations</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700 bg-blue-50 p-4 rounded-lg">
                        {analysis.recommendations.map((rec: string, idx: number) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tools */}
                  {analysis.tools && analysis.tools.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Recommended Tools</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.tools.map((tool: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Detailed Analysis */}
                  {analysis.detailedAnalysis && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Detailed Analysis</h3>
                      <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                        {analysis.detailedAnalysis}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FiTrendingUp className="mx-auto text-gray-400 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Analysis Yet</h3>
                <p className="text-gray-500">
                  Enter a content URL and click "Analyze Content" to get AI-powered performance insights and recommendations.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

