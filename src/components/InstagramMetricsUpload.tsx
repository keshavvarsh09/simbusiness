/**
 * Instagram Organic Metrics Upload Component
 * Allows users to upload Instagram analytics screenshots
 */

'use client';

import { useState } from 'react';
import { FiUpload, FiImage, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { getAuthHeaders } from '@/lib/auth';

interface InstagramMetrics {
  organicReach?: number;
  linkClicks?: number;
  profileVisits?: number;
  engagementRate?: number;
  impressions?: number;
  followersChange?: number;
  dateRange?: string;
  insights?: string;
}

export default function InstagramMetricsUpload() {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [metrics, setMetrics] = useState<InstagramMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('Image size must be less than 10MB');
      return;
    }

    setImageFile(file);
    setError(null);
    setMetrics(null);

    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!imageFile || !image) {
      setError('Please select an image first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Convert image to base64
      const base64 = image.split(',')[1]; // Remove data:image/png;base64, prefix
      const mimeType = imageFile.type;

      const response = await fetch('/api/analytics/instagram-organic', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          imageBase64: base64,
          mimeType,
          metricType: 'organic'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze metrics');
      }

      if (data.success && data.analysis) {
        setMetrics(data.analysis);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload and analyze metrics');
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setImageFile(null);
    setMetrics(null);
    setError(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FiImage className="text-pink-500" />
        Instagram Organic Metrics
      </h2>

      <p className="text-gray-600 mb-6">
        Upload a screenshot of your Instagram analytics to analyze organic reach, link clicks, engagement, and more.
      </p>

      {!image ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            id="instagram-upload"
          />
          <label
            htmlFor="instagram-upload"
            className="cursor-pointer flex flex-col items-center gap-4"
          >
            <FiUpload className="text-gray-400" size={48} />
            <div>
              <p className="text-gray-700 font-medium">Click to upload Instagram analytics screenshot</p>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
            </div>
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Image Preview */}
          <div className="relative border rounded-lg overflow-hidden">
            <img
              src={image}
              alt="Instagram analytics"
              className="w-full h-auto max-h-96 object-contain bg-gray-50"
            />
            <button
              onClick={handleReset}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
            >
              <FiX />
            </button>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-pink-600 text-white py-3 px-4 rounded-md hover:bg-pink-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Analyzing...
              </>
            ) : (
              <>
                <FiUpload />
                Analyze Metrics
              </>
            )}
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Metrics Results */}
      {metrics && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <FiCheckCircle className="text-green-600" />
            <h3 className="font-bold text-green-800">Analysis Complete</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {metrics.organicReach !== undefined && (
              <div>
                <p className="text-sm text-gray-600">Organic Reach</p>
                <p className="text-2xl font-bold text-green-700">{metrics.organicReach.toLocaleString()}</p>
              </div>
            )}
            {metrics.linkClicks !== undefined && (
              <div>
                <p className="text-sm text-gray-600">Link Clicks</p>
                <p className="text-2xl font-bold text-green-700">{metrics.linkClicks.toLocaleString()}</p>
              </div>
            )}
            {metrics.profileVisits !== undefined && (
              <div>
                <p className="text-sm text-gray-600">Profile Visits</p>
                <p className="text-2xl font-bold text-green-700">{metrics.profileVisits.toLocaleString()}</p>
              </div>
            )}
            {metrics.engagementRate !== undefined && (
              <div>
                <p className="text-sm text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold text-green-700">{metrics.engagementRate.toFixed(1)}%</p>
              </div>
            )}
            {metrics.impressions !== undefined && (
              <div>
                <p className="text-sm text-gray-600">Impressions</p>
                <p className="text-2xl font-bold text-green-700">{metrics.impressions.toLocaleString()}</p>
              </div>
            )}
            {metrics.followersChange !== undefined && (
              <div>
                <p className="text-sm text-gray-600">Followers Change</p>
                <p className={`text-2xl font-bold ${metrics.followersChange >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {metrics.followersChange >= 0 ? '+' : ''}{metrics.followersChange.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {metrics.dateRange && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-sm text-gray-600">Date Range: <span className="font-medium">{metrics.dateRange}</span></p>
            </div>
          )}

          {metrics.insights && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-sm font-medium text-gray-700 mb-1">Insights:</p>
              <p className="text-sm text-gray-600">{metrics.insights}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

