'use client';

import { useState, useEffect } from 'react';
import { FiClock, FiDollarSign, FiAlertTriangle, FiCheckCircle, FiXCircle } from 'react-icons/fi';
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
  created_at: string;
}

export default function MissionsPanel() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [solving, setSolving] = useState<number | null>(null);

  useEffect(() => {
    fetchMissions();
    // Check for expired missions periodically
    const interval = setInterval(() => {
      fetchMissions();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const fetchMissions = async () => {
    try {
      const response = await fetch('/api/missions', {
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      if (data.success) {
        setMissions(data.missions);
      }
    } catch (error) {
      console.error('Failed to fetch missions:', error);
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
        fetchMissions();
      } else {
        alert(data.error || 'Failed to solve mission');
      }
    } catch (error) {
      alert('Failed to solve mission. Please try again.');
    } finally {
      setSolving(null);
    }
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
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
        <button
          onClick={() => fetch('/api/missions', { method: 'POST', headers: getAuthHeaders() })}
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Trigger Mission
        </button>
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
            const timeRemaining = getTimeRemaining(mission.deadline);
            const isExpired = timeRemaining === 'Expired';
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
                  <div>
                    <h3 className="font-semibold text-lg">{mission.title}</h3>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        mission.status
                      )}`}
                    >
                      {mission.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <FiClock />
                      {timeRemaining}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{mission.description}</p>

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

