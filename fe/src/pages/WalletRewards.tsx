import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cantonApi } from '../services/cantonApi';
import { TemplateIds } from '../utils/daml';

interface Reward {
  id: string;
  contributionCount: number;
  totalAmount: number;
  redeemedAmount: number;
  availableAmount: number;
  createdDate: string;
  transactionCount: number;
}

export default function WalletRewards() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    setLoading(true);
    try {
      // Query ContributorReward contracts
      const contracts = await cantonApi.query(TemplateIds.ContributorReward);

      // Transform to Reward format
      const transformedRewards: Reward[] = contracts.map((contract: any) => {
        const payload = contract.payload;
        const transactionIds = new Set<string>();

        // Extract unique transaction IDs from contributions map
        if (payload.contributions && Array.isArray(payload.contributions)) {
          payload.contributions.forEach((entry: any) => {
            if (entry && entry._1) { // _1 is the transaction ID in the tuple
              transactionIds.add(entry._1);
            }
          });
        }

        return {
          id: contract.contractId,
          contributionCount: payload.contributionCount || 0,
          totalAmount: parseFloat(payload.rewardAmount) || 0,
          redeemedAmount: parseFloat(payload.redeemedAmount) || 0,
          availableAmount: (parseFloat(payload.rewardAmount) || 0) - (parseFloat(payload.redeemedAmount) || 0),
          createdDate: payload.createdAt,
          transactionCount: transactionIds.size,
        };
      });

      setRewards(transformedRewards);
    } catch (error) {
      console.error('Failed to load rewards:', error);
      setRewards([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading rewards...</div>;

  const totalEarned = rewards.reduce((sum, r) => sum + r.totalAmount, 0);
  const totalRedeemed = rewards.reduce((sum, r) => sum + r.redeemedAmount, 0);
  const totalAvailable = rewards.reduce((sum, r) => sum + r.availableAmount, 0);

  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Wallet - Rewards</h1>
        <p className="text-muted">Earnings from your contributed transaction data</p>
      </div>

      <div className="grid grid-2 mb-4">
        <div className="card">
          <div className="text-muted text-sm font-semibold mb-1">Total Earned</div>
          <div className="text-xl font-bold text-success">${totalEarned.toFixed(2)}</div>
          <div className="text-sm text-muted">
            {rewards.length} reward contracts
          </div>
        </div>
        <div className="card">
          <div className="text-muted text-sm font-semibold mb-1">Available to Redeem</div>
          <div className="text-xl font-bold text-primary">${totalAvailable.toFixed(2)}</div>
          <div className="text-sm text-muted">
            Redeemed: ${totalRedeemed.toFixed(2)}
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
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Contract ID</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Contributions</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Transactions</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Total Reward</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Redeemed</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Available</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((reward) => (
                  <tr key={reward.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.75rem' }}>
                      <div className="text-sm text-muted" style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {reward.id.substring(0, 20)}...
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <span className="badge badge-info">
                        {reward.contributionCount}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <span className="badge badge-secondary">
                        {reward.transactionCount}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <span className="font-bold text-success">
                        ${reward.totalAmount.toFixed(2)}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <span className="text-muted">
                        ${reward.redeemedAmount.toFixed(2)}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <span className="font-bold text-primary">
                        ${reward.availableAmount.toFixed(2)}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div className="text-sm">
                        {new Date(reward.createdDate).toLocaleDateString()}
                      </div>
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
