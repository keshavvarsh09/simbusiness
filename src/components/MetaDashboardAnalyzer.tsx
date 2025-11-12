'use client';

import { useState, useRef } from 'react';
import { FiUpload, FiImage, FiTrendingUp, FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import { getAuthHeaders } from '@/lib/auth';

export default function MetaDashboardAnalyzer() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setError('');
      } else {
        setError('Please select an image file');
      }
    }
  };

  const handleAnalyze = async () => {
    if (!image) {
      setError('Please upload an image first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const mimeType = image.type;

        try {
          const response = await fetch('/api/analytics/meta-dashboard', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
              imageBase64: base64String,
              mimeType: mimeType,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            setError(data.error || 'Failed to analyze dashboard');
            return;
          }

          setAnalysis(data.analysis);
        } catch (err) {
          setError('Failed to analyze dashboard. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(image);
    } catch (err) {
      setError('Failed to process image');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FiImage className="text-purple-500" />
        Meta Dashboard Analysis
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Meta (Facebook) Dashboard Screenshot
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {imagePreview ? (
            <div className="space-y-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg"
              />
              <button
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                  setAnalysis(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Remove Image
              </button>
            </div>
          ) : (
            <div>
              <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Click to upload or drag and drop
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="dashboard-upload"
              />
              <label
                htmlFor="dashboard-upload"
                className="cursor-pointer inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Select Image
              </label>
            </div>
          )}
        </div>
      </div>

      {image && !analysis && (
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <FiImage />
          {loading ? 'Analyzing...' : 'Analyze Dashboard'}
        </button>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center gap-2">
          <FiAlertCircle />
          {error}
        </div>
      )}

      {analysis && (
        <div className="mt-6 space-y-4">
          <div className="border-t pt-4">
            {analysis.metrics && (
              <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FiTrendingUp className="text-purple-600" />
                  Performance Metrics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Impressions</p>
                    <p className="text-xl font-bold">{analysis.metrics.impressions?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Clicks</p>
                    <p className="text-xl font-bold">{analysis.metrics.clicks?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">CTR</p>
                    <p className="text-xl font-bold">{analysis.metrics.ctr ? `${analysis.metrics.ctr}%` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">CPC</p>
                    <p className="text-xl font-bold">${analysis.metrics.cpc || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">CPM</p>
                    <p className="text-xl font-bold">${analysis.metrics.cpm || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Conversions</p>
                    <p className="text-xl font-bold">{analysis.metrics.conversions || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ROAS</p>
                    <p className="text-xl font-bold">{analysis.metrics.roas || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ad Spend</p>
                    <p className="text-xl font-bold">${analysis.metrics.adSpend?.toLocaleString() || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {analysis.performance && (
              <div className="mb-4 p-4 bg-green-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FiDollarSign className="text-green-600" />
                  Performance Status
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-xl font-bold capitalize">{analysis.performance.status || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Profitability</p>
                    <p className="text-xl font-bold">
                      {analysis.performance.profitability ? `${analysis.performance.profitability}%` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Trend</p>
                    <p className="text-xl font-bold capitalize">{analysis.performance.trend || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="text-sm">{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.assessment && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">AI Assessment</h3>
                <p className="text-sm text-gray-700">{analysis.assessment}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

