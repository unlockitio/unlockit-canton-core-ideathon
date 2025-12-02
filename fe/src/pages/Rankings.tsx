import React, { useEffect, useState } from 'react';
import { config } from '../config';

interface RankingEntry {
  name: string;
  reputation: number;
  reputationCap: number;
  role: string;
}

const roleDisplayNames: Record<string, string> = {
  RealtorAgent: 'Agent',
  RealtorBroker: 'Broker',
  RealtorMaster: 'Master',
  NotaryPublic: 'Notary',
  TaxAuthority: 'Tax Authority'
};

const startingReputation: Record<string, number> = {
  PrivateCitizen: 35,
  RealtorAgent: 42,
  RealtorBroker: 47,
  RealtorMaster: 47,
  NotaryPublic: 47,
  TaxAuthority: 100
};

const isStartingReputation = (role: string, reputation: number): boolean => {
  return startingReputation[role] === reputation;
};

const getReputationColor = (role: string, reputation: number, reputationCap: number): string => {
  if (isStartingReputation(role, reputation)) {
    return '#9ca3af'; // gray-400
  }

  const percentage = (reputation / reputationCap) * 100;

  // Map to emoji-like colors: 🟢 🟡 🟠 🔴
  if (percentage >= 90) return '#16a34a'; // green (🟢)
  if (percentage >= 75) return '#f59e0b'; // yellow (🟡)
  if (percentage >= 50) return '#fb923c'; // orange (🟠)
  if (percentage >= 25) return '#ef4444'; // red (🔴)
};

function Rankings() {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState('All');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${config.backendUrl}/api/rankings`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRankings(data);
    } catch (err) {
      console.error('Error fetching rankings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load rankings');
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return null;
    }
  };

  const filteredRankings = rankings.filter((entry) => {
    const matchesRole = filterRole === 'All' || entry.role === filterRole;
    return matchesRole;
  });

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">⏳</div>
            <p>Loading rankings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">⚠️</div>
            <h2>Error Loading Rankings</h2>
            <p>{error}</p>
            <button onClick={fetchRankings} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="text-xl font-bold">🏆 Reputation Rankings</h1>
        <p className="text-muted">Top verified professionals ranked by reputation</p>
      </div>

      <div className="card mb-4">
        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Filter by Role</label>
            <select
              className="form-select"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="RealtorAgent">Agent</option>
              <option value="RealtorBroker">Broker</option>
              <option value="RealtorMaster">Master</option>
              <option value="NotaryPublic">Notary</option>
              <option value="TaxAuthority">Tax Authority</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>
              <div><strong>{filteredRankings.length}</strong> professionals ranked</div>
              {filteredRankings.length > 0 && (
                <div><strong>Top Score:</strong> {filteredRankings[0]?.reputation}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-header">Leaderboard</h2>

        {filteredRankings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <p>No rankings found for the selected filters</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, width: '80px' }}>Rank</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Professional</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Role</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600, width: '120px' }}>Reputation</th>
                </tr>
              </thead>
              <tbody>
                {filteredRankings.map((entry, index) => {
                  const rank = index + 1;
                  const medal = getMedalEmoji(rank);
                  const reputationColor = getReputationColor(entry.role, entry.reputation, entry.reputationCap);
                  const isStarting = isStartingReputation(entry.role, entry.reputation);

                  return (
                    <tr
                      key={index}
                      style={{
                        borderBottom: '1px solid #e2e8f0',
                        background: rank <= 3 ? '#f7fafc' : 'white',
                      }}
                    >
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        {medal ? (
                          <span style={{ fontSize: '1.5rem' }}>{medal}</span>
                        ) : (
                          <span style={{ fontSize: '1.125rem', fontWeight: 600, color: '#718096' }}>#{rank}</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div className="font-semibold">{entry.name}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className="badge badge-info">{roleDisplayNames[entry.role] || entry.role}</span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', position: 'relative' }}>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: reputationColor,
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease-in-out',
                            transform: hoveredIndex === index ? 'scale(1.1)' : 'scale(1)',
                          }}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        >
                          <span style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>
                            {isStarting ? '◇' : '◆'}
                          </span>
                        </div>
                        {hoveredIndex === index && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '-40px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              backgroundColor: '#1a202c',
                              color: 'white',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              whiteSpace: 'nowrap',
                              zIndex: 1000,
                              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            }}
                          >
                            {entry.reputation} / {entry.reputationCap}
                            {isStarting && <span style={{ color: '#9ca3af', marginLeft: '0.5rem' }}>(Starting)</span>}
                            <div
                              style={{
                                position: 'absolute',
                                bottom: '-4px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 0,
                                height: 0,
                                borderLeft: '4px solid transparent',
                                borderRight: '4px solid transparent',
                                borderTop: '4px solid #1a202c',
                              }}
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Rankings;
