'use client';

import { useState, useEffect } from 'react';
import { FiClock, FiDollarSign, FiAlertTriangle, FiCheckCircle, FiXCircle, FiRefreshCw, FiMapPin, FiExternalLink, FiGlobe } from 'react-icons/fi';
import { getAuthHeaders } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';

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
        // Parse impact_on_business if it's a string
        const missions = (data.missions || []).map((mission: any) => {
          let impact = mission.impact_on_business;
          try {
            if (typeof impact === 'string') {
              impact = JSON.parse(impact);
            }
          } catch (e) {
            console.warn('Failed to parse impact_on_business:', e);
            impact = {};
          }
          return {
            ...mission,
            impact_on_business: impact || {}
          };
        });
        setMissions(missions);
        console.log(`Loaded ${missions.length} missions`);
      } else {
        console.error('Failed to fetch missions:', data.error);
        setMissions([]);
      }
    } catch (error: any) {
      console.error('Failed to fetch missions:', error);
      setMissions([]);
      // Show error to user if it's a network error
      if (error.message?.includes('fetch')) {
        alert('Failed to connect to server. Please check your connection.');
      }
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
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-title-2 font-bold text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <FiClock className="text-orange-500 text-xl" />
          </div>
          Time-Bound Missions
        </h2>
        <div className="flex gap-3">
          <button
            onClick={handleAutoGenerate}
            disabled={autoGenerating}
            className="btn btn-accent text-sm flex items-center gap-2"
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
            className="btn btn-primary text-sm"
          >
            Manual Mission
          </button>
        </div>
      </div>

      <p className="text-body text-gray-500 mb-6">
        Remember: Time is money! Solve these problems quickly to avoid losses.
      </p>

      {missions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <FiClock className="text-gray-400 text-2xl" />
          </div>
          <h3 className="text-title-3 font-bold text-gray-900 mb-2">No missions found</h3>
          <p className="text-body text-gray-500 mb-6">Generate time-bound missions to test your skills</p>
          <button
            onClick={handleAutoGenerate}
            disabled={autoGenerating}
            className="btn btn-primary flex items-center gap-2 mx-auto"
          >
            <FiRefreshCw className={autoGenerating ? 'animate-spin' : ''} />
            {autoGenerating ? 'Generating...' : 'Generate Missions Now'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {missions.map((mission) => {
              const currentTimeRemaining = timeRemaining[mission.id] || getTimeRemaining(mission.deadline);
              const isExpired = currentTimeRemaining === 'Expired';
              const impact = mission.impact_on_business || {};

              return (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`border rounded-2xl p-5 transition-all ${mission.status === 'active' && !isExpired
                      ? 'border-orange-200 bg-orange-50/30 hover:shadow-md'
                      : mission.status === 'completed'
                        ? 'border-green-200 bg-green-50/30'
                        : 'border-gray-200 bg-gray-50/30'
                    }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{mission.title}</h3>
                        {mission.event_source && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
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
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            mission.status
                          )}`}
                        >
                          {mission.status.toUpperCase()}
                        </span>
                        {mission.affected_location && (
                          <span className="flex items-center gap-1 text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                            <FiMapPin />
                            {mission.affected_location}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-lg ${isExpired ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                        <FiClock />
                        {currentTimeRemaining}
                      </div>
                    </div>
                  </div>

                  <p className="text-body text-gray-600 mb-4">{mission.description}</p>

                  {mission.news_url && (
                    <div className="mb-4">
                      <a
                        href={mission.news_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 hover:underline"
                      >
                        <FiExternalLink />
                        Read related news article
                      </a>
                    </div>
                  )}

                  {Object.keys(impact).length > 0 && (
                    <div className="mb-4 p-3 bg-white/80 rounded-xl border border-gray-100 text-sm">
                      <p className="font-medium text-gray-700 mb-2">Business Impact:</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(impact).map(([key, value]: [string, any]) => (
                          <span
                            key={key}
                            className={`px-2.5 py-1 rounded-lg font-medium ${value < 0 ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'
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
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                          <FiDollarSign />
                        </div>
                        <span>Cost: ${mission.cost_to_solve}</span>
                      </div>
                      <button
                        onClick={() => handleSolve(mission.id)}
                        disabled={solving === mission.id}
                        className="btn btn-primary py-2 px-4 text-sm flex items-center gap-2"
                      >
                        {solving === mission.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Solving...
                          </>
                        ) : (
                          <>
                            <FiCheckCircle /> Solve Now
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {isExpired && mission.status === 'active' && (
                    <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100 text-sm text-red-700 flex items-center gap-2 font-medium">
                      <FiAlertTriangle className="text-lg" />
                      Mission expired! This will impact your business.
                    </div>
                  )}

                  {mission.status === 'completed' && (
                    <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-100 text-sm text-green-700 flex items-center gap-2 font-medium">
                      <FiCheckCircle className="text-lg" />
                      Mission completed successfully!
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
