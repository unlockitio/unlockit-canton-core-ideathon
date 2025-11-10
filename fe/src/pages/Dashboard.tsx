import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { userId } = useAuth();

  const stats = [
    { label: 'Transactions Submitted', value: '3', change: '+2 this month' },
    { label: 'Verifications Given', value: '12', change: '+5 this month' },
    { label: 'Trust Score', value: '85', change: 'Excellent' },
    { label: 'Pending Verifications', value: '4', change: 'Awaiting your review' },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'submission',
      title: '123 Main St, San Francisco, CA',
      status: 'Verified',
      trustScore: 85,
      date: '2024-12-10',
    },
    {
      id: 2,
      type: 'verification',
      title: '456 Oak Ave, Oakland, CA',
      status: 'Pending',
      trustScore: 62,
      date: '2024-12-09',
    },
    {
      id: 3,
      type: 'submission',
      title: '789 Pine St, Berkeley, CA',
      status: 'Partially Verified',
      trustScore: 45,
      date: '2024-12-08',
    },
  ];

  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-muted">Welcome back, {userId}</p>
      </div>

      <div className="grid grid-2 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="text-muted text-sm font-semibold mb-1">{stat.label}</div>
            <div className="text-xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-success">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-2">
        <div>
          <div className="card">
            <h2 className="card-header">Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link to="/submit" className="btn btn-primary">
                Submit New Transaction
              </Link>
              <Link to="/verify" className="btn btn-secondary">
                Verify Transactions
              </Link>
              <Link to="/market-data" className="btn btn-secondary">
                View Market Data
              </Link>
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <h2 className="card-header">Recent Activity</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  style={{
                    padding: '1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="font-semibold">{activity.title}</span>
                    <span
                      className={`badge ${
                        activity.status === 'Verified'
                          ? 'badge-success'
                          : activity.status === 'Pending'
                          ? 'badge-warning'
                          : 'badge-info'
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span className="text-muted">Trust Score: {activity.trustScore}</span>
                    <span className="text-muted">{activity.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
