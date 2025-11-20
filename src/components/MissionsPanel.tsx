'use client';

import { useState, useEffect } from 'react';
import { FiClock, FiDollarSign, FiAlertTriangle, FiCheckCircle, FiXCircle, FiRefreshCw, FiMapPin, FiExternalLink, FiGlobe } from 'react-icons/fi';
import { getAuthHeaders } from '@/lib/auth';

interface Mission {
  id: number;
  title: string;
  description: string;
  mission_type: string;
  deadline: string;
  status: string;
  cost_to_solve: number;
  impact_on_business: any;
  event_source?: string;
  affected_location?: string;
  news_url?: string;
  created_at: string;
}

export default function MissionsPanel() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [solving, setSolving] = useState<number | null>(null);
  const [autoGenerating, setAutoGenerating] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<Record<number, string>>({});

  useEffect(() => {
    fetchMissions();
    
    // Check for expired missions periodically
    const fetchInterval = setInterval(() => {
      fetchMissions();
    }, 60000); // Check every minute

    return () => {
      clearInterval(fetchInterval);
    };
  }, []);

  // Update countdown every second
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      const newTimeRemaining: Record<number, string> = {};
      missions.forEach(mission => {
        if (mission.status === 'active') {
          newTimeRemaining[mission.id] = getTimeRemaining(mission.deadline);
        }
      });
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [missions]);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/missions', {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setMissions(data.missions || []);
      } else {
        console.error('Failed to fetch missions:', data.error);
        setMissions([]);
      }
    } catch (error) {
      console.error('Failed to fetch missions:', error);
      setMissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSolve = async (missionId: number) => {
    setSolving(missionId);
    try {
      const response = await fetch('/api/missions', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ missionId, action: 'solve' }),
      });

      const data = await response.json();
      if (data.success) {
        alert(data.message || 'Mission solved successfully!');
        fetchMissions();
        // Refresh page to update budget display
        window.location.reload();
      } else {
        const errorMsg = data.details 
          ? `${data.error}: ${data.details}` 
          : (data.error || 'Failed to solve mission');
        alert(errorMsg);
      }
    } catch (error) {
      alert('Failed to solve mission. Please try again.');
    } finally {
      setSolving(null);
    }
  };

  const handleAutoGenerate = async () => {
    setAutoGenerating(true);
    try {
      const response = await fetch('/api/missions/auto-generate', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ locations: ['India', 'Delhi', 'Mumbai', 'Bangalore'] }),
      });

      const data = await response.json();
      if (data.success) {
        fetchMissions();
        // Show message even if no missions were created (might be duplicates)
        if (data.missions && data.missions.length > 0) {
          alert(data.message || `Successfully generated ${data.missions.length} new mission(s)!`);
        } else {
          alert(data.message || 'No new missions generated. You may already have similar active missions.');
        }
      } else {
        let errorMsg = data.error || 'Failed to generate missions';
        if (data.details) {
          errorMsg += `: ${data.details}`;
        }
        if (data.hint) {
          errorMsg += `\n\nHint: ${data.hint}`;
        }
        alert(errorMsg);
        
        // If database not initialized, offer to initialize
        if (data.error === 'Database not initialized' || data.details?.includes('does not exist')) {
          if (confirm('Database needs to be initialized. Would you like to initialize it now?')) {
            try {
              const initResponse = await fetch('/api/init-db', {
                method: 'GET',
                headers: getAuthHeaders(),
              });
              const initData = await initResponse.json();
              if (initData.success) {
                alert('Database initialized! Please try auto-generating missions again.');
              } else {
                alert(`Database initialization failed: ${initData.error || initData.details}`);
              }
            } catch (initError: any) {
              alert(`Failed to initialize database: ${initError.message}`);
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Auto-generate error:', error);
      alert(`Failed to generate missions: ${error.message || 'Please try again.'}`);
    } finally {
      setAutoGenerating(false);
    }
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p>Loading missions...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FiClock className="text-orange-500" />
          Time-Bound Missions
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleAutoGenerate}
            disabled={autoGenerating}
            className="text-sm bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            <FiRefreshCw className={autoGenerating ? 'animate-spin' : ''} />
            {autoGenerating ? 'Generating...' : 'Auto-Generate'}
          </button>
          <button
            onClick={async () => {
              const response = await fetch('/api/missions', { 
                method: 'POST', 
                headers: getAuthHeaders(),
                body: JSON.stringify({ autoGenerate: false })
              });
              if (response.ok) {
                fetchMissions();
              }
            }}
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Manual Mission
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Remember: Time is money! Solve these problems quickly to avoid losses.
      </p>

      {missions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No active missions. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {missions.map((mission) => {
            const currentTimeRemaining = timeRemaining[mission.id] || getTimeRemaining(mission.deadline);
            const isExpired = currentTimeRemaining === 'Expired';
            const impact = mission.impact_on_business || {};

            return (
              <div
                key={mission.id}
                className={`border rounded-lg p-4 ${
                  mission.status === 'active' && !isExpired
                    ? 'border-orange-300 bg-orange-50'
                    : mission.status === 'completed'
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{mission.title}</h3>
                      {mission.event_source && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">
                          {mission.event_source === 'news' && <FiGlobe className="inline mr-1" />}
                          {mission.event_source === 'festival' && '🎉'}
                          {mission.event_source === 'labour' && '👷'}
                          {mission.event_source === 'curfew' && '🚫'}
                          {mission.event_source?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          mission.status
                        )}`}
                      >
                        {mission.status.toUpperCase()}
                      </span>
                      {mission.affected_location && (
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                          <FiMapPin />
                          {mission.affected_location}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className={`flex items-center gap-1 text-sm font-bold ${
                      isExpired ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      <FiClock />
                      {currentTimeRemaining}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{mission.description}</p>

                {mission.news_url && (
                  <div className="mb-3">
                    <a
                      href={mission.news_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <FiExternalLink />
                      Read related news article
                    </a>
                  </div>
                )}

                {Object.keys(impact).length > 0 && (
                  <div className="mb-3 p-2 bg-white rounded text-sm">
                    <p className="font-medium mb-1">Impact:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(impact).map(([key, value]: [string, any]) => (
                        <span
                          key={key}
                          className={`px-2 py-1 rounded ${
                            value < 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {key}: {value > 0 ? '+' : ''}
                          {value}%
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {mission.status === 'active' && !isExpired && (
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 text-sm">
                      <FiDollarSign />
                      <span>Cost to solve: ${mission.cost_to_solve}</span>
                    </div>
                    <button
                      onClick={() => handleSolve(mission.id)}
                      disabled={solving === mission.id}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      <FiCheckCircle />
                      {solving === mission.id ? 'Solving...' : 'Solve Now'}
                    </button>
                  </div>
                )}

                {isExpired && mission.status === 'active' && (
                  <div className="mt-3 p-2 bg-red-100 rounded text-sm text-red-700 flex items-center gap-2">
                    <FiAlertTriangle />
                    Mission expired! This will impact your business.
                  </div>
                )}

                {mission.status === 'completed' && (
                  <div className="mt-3 p-2 bg-green-100 rounded text-sm text-green-700 flex items-center gap-2">
                    <FiCheckCircle />
                    Mission completed successfully!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

