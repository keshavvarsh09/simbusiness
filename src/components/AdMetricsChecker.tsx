/**
 * Ad Metrics Checker Component
 * Checks if user has uploaded Meta/Google ads or Instagram organic metrics
 */

'use client';

import { useState, useEffect } from 'react';
import { FiBarChart, FiImage, FiUpload, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { getAuthHeaders } from '@/lib/auth';

interface AdMetricsStatus {
  hasMetaAds: boolean;
  hasGoogleAds: boolean;
  hasInstagramOrganic: boolean;
  lastMetaUpload?: string;
  lastGoogleUpload?: string;
  lastInstagramUpload?: string;
}

export default function AdMetricsChecker() {
  const [status, setStatus] = useState<AdMetricsStatus>({
    hasMetaAds: false,
    hasGoogleAds: false,
    hasInstagramOrganic: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdMetrics();
  }, []);

  const checkAdMetrics = async () => {
    try {
      const response = await fetch('/api/analytics/status', {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Error checking ad metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="animate-pulse flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    );
  }

  const hasAnyMetrics = status.hasMetaAds || status.hasGoogleAds || status.hasInstagramOrganic;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2">
          <FiBarChart className="text-blue-500" />
          Ad Metrics Status
        </h3>
        <button
          onClick={checkAdMetrics}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-2">
        <div className={`flex items-center justify-between p-2 rounded ${status.hasMetaAds ? 'bg-green-50' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2">
            {status.hasMetaAds ? (
              <FiCheckCircle className="text-green-600" />
            ) : (
              <FiAlertCircle className="text-gray-400" />
            )}
            <span className="text-sm">Meta Ads</span>
          </div>
          {status.hasMetaAds && status.lastMetaUpload && (
            <span className="text-xs text-gray-500">{new Date(status.lastMetaUpload).toLocaleDateString()}</span>
          )}
        </div>

        <div className={`flex items-center justify-between p-2 rounded ${status.hasGoogleAds ? 'bg-green-50' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2">
            {status.hasGoogleAds ? (
              <FiCheckCircle className="text-green-600" />
            ) : (
              <FiAlertCircle className="text-gray-400" />
            )}
            <span className="text-sm">Google Ads</span>
          </div>
          {status.hasGoogleAds && status.lastGoogleUpload && (
            <span className="text-xs text-gray-500">{new Date(status.lastGoogleUpload).toLocaleDateString()}</span>
          )}
        </div>

        <div className={`flex items-center justify-between p-2 rounded ${status.hasInstagramOrganic ? 'bg-green-50' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2">
            {status.hasInstagramOrganic ? (
              <FiCheckCircle className="text-green-600" />
            ) : (
              <FiAlertCircle className="text-gray-400" />
            )}
            <span className="text-sm">Instagram Organic</span>
          </div>
          {status.hasInstagramOrganic && status.lastInstagramUpload && (
            <span className="text-xs text-gray-500">{new Date(status.lastInstagramUpload).toLocaleDateString()}</span>
          )}
        </div>
      </div>

      {!hasAnyMetrics && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800 mb-2">
            Upload ad metrics to improve simulation accuracy
          </p>
          <div className="flex gap-2">
            <a
              href="/analytics/meta"
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
              <FiUpload size={12} />
              Upload Metrics
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

