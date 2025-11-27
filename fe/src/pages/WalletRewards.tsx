import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Reward {
  id: string;
  insightId: string;
  insightPostalCode: string;
  transactionIds: string[];
  baseAmount: number;
  qualityMultiplier: number;
  roleWeight: number;
  usageRatio: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'paid';
  createdDate: string;
  paidDate?: string;
}

const MOCK_REWARDS: Reward[] = [
  {
    id: 'reward-1',
    insightId: 'insight-2',
    insightPostalCode: '94103',
    transactionIds: ['tx-001', 'tx-003'],
    baseAmount: 11.25,
    qualityMultiplier: 1.5,
    roleWeight: 1.2,
    usageRatio: 0.05,
    totalAmount: 1.01,
    status: 'paid',
    createdDate: '2024-11-18T14:15:00.000Z',
    paidDate: '2024-11-20T09:30:00.000Z',
  },
  {
    id: 'reward-2',
    insightId: 'insight-1',
    insightPostalCode: '94102',
    transactionIds: ['tx-002'],
    baseAmount: 65.63,
    qualityMultiplier: 2.0,
    roleWeight: 1.0,
    usageRatio: 0.024,
    totalAmount: 3.15,
    status: 'paid',
    createdDate: '2024-11-20T10:30:00.000Z',
    paidDate: '2024-11-22T11:00:00.000Z',
  },
  {
    id: 'reward-3',
    insightId: 'insight-pending',
    insightPostalCode: '94105',
    transactionIds: ['tx-001', 'tx-002', 'tx-004'],
    baseAmount: 25.0,
    qualityMultiplier: 1.5,
    roleWeight: 1.1,
    usageRatio: 0.071,
    totalAmount: 2.93,
    status: 'processing',
    createdDate: '2024-11-25T16:45:00.000Z',
  },
];

export default function WalletRewards() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('walletRewards');
    if (stored) {
      setRewards(JSON.parse(stored));
    } else {
      setRewards(MOCK_REWARDS);
      localStorage.setItem('walletRewards', JSON.stringify(MOCK_REWARDS));
    }
    setLoading(false);
  }, []);

  if (loading) return <div>Loading rewards...</div>;

  const totalEarned = rewards
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + r.totalAmount, 0);

  const totalPending = rewards
    .filter(r => r.status !== 'paid')
    .reduce((sum, r) => sum + r.totalAmount, 0);

  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Wallet - Rewards</h1>
        <p className="text-muted">Earnings from your contributed transaction data</p>
      </div>

      <div className="grid grid-2 mb-4">
        <div className="card">
          <div className="text-muted text-sm font-semibold mb-1">Total Earned (Paid)</div>
          <div className="text-xl font-bold text-success">${totalEarned.toFixed(2)}</div>
          <div className="text-sm text-muted">
            {rewards.filter(r => r.status === 'paid').length} payments
          </div>
        </div>
        <div className="card">
          <div className="text-muted text-sm font-semibold mb-1">Pending Rewards</div>
          <div className="text-xl font-bold text-warning">${totalPending.toFixed(2)}</div>
          <div className="text-sm text-muted">
            {rewards.filter(r => r.status !== 'paid').length} pending
          </div>
        </div>
      </div>

      {rewards.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 className="font-semibold mb-2">No Rewards Yet</h3>
          <p className="text-muted mb-3">
            Submit verified transactions to earn rewards when your data is used in market insights
          </p>
          <Link to="/submit" className="btn btn-primary">
            Submit Transaction
          </Link>
        </div>
      ) : (
        <div className="card">
          <h2 className="card-header">Reward History</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Insight</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Transactions</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Base</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Quality</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Role</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Usage</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((reward) => (
                  <tr key={reward.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.75rem' }}>
                      <div className="font-semibold">{reward.insightPostalCode}</div>
                      <div className="text-sm text-muted">{reward.insightId}</div>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <span className="badge badge-secondary">
                        {reward.transactionIds.length}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      ${reward.baseAmount.toFixed(2)}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      {reward.qualityMultiplier}x
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      {reward.roleWeight}x
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      {(reward.usageRatio * 100).toFixed(1)}%
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <span className="font-bold text-success">
                        ${reward.totalAmount.toFixed(2)}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <span
                        className={`badge ${
                          reward.status === 'paid'
                            ? 'badge-success'
                            : reward.status === 'processing'
                            ? 'badge-info'
                            : 'badge-warning'
                        }`}
                      >
                        {reward.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div className="text-sm">
                        {new Date(reward.createdDate).toLocaleDateString()}
                      </div>
                      {reward.paidDate && (
                        <div className="text-sm text-muted">
                          Paid: {new Date(reward.paidDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
