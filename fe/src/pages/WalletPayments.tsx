import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Payment {
  id: string;
  insightId: string;
  postalCode: string;
  qualityLevel: string;
  dataScope: string;
  timeRange: string;
  amount: number;
  date: string;
}

export default function WalletPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const insights = JSON.parse(localStorage.getItem('insights') || '[]');

    const paymentRecords: Payment[] = insights.map((insight: any) => ({
      id: `payment-${insight.id}`,
      insightId: insight.id,
      postalCode: insight.postalCode,
      qualityLevel: insight.qualityLevel,
      dataScope: insight.dataScope,
      timeRange: insight.timeRange,
      amount: insight.price,
      date: insight.purchaseDate,
    }));

    setPayments(paymentRecords);
    setLoading(false);
  }, []);

  if (loading) return <div>Loading payments...</div>;

  const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Wallet - Payments</h1>
        <p className="text-muted">Your market insight purchases</p>
      </div>

      <div className="card mb-4">
        <div className="text-muted text-sm font-semibold mb-1">Total Spent</div>
        <div className="text-xl font-bold text-primary">${totalSpent.toFixed(2)}</div>
        <div className="text-sm text-muted">
          {payments.length} {payments.length === 1 ? 'purchase' : 'purchases'}
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 className="font-semibold mb-2">No Payments Yet</h3>
          <p className="text-muted mb-3">
            Purchase market insights to see your payment history
          </p>
          <Link to="/insights" className="btn btn-primary">
            Browse Insights
          </Link>
        </div>
      ) : (
        <div className="card">
          <h2 className="card-header">Payment History</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {payments.map((payment) => (
              <Link
                key={payment.id}
                to={`/insights/${payment.insightId}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={{
                    padding: '1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f7fafc';
                    e.currentTarget.style.borderColor = '#cbd5e0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <div className="font-bold mb-2">
                        Market Report - {payment.postalCode}
                      </div>
                      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        <div>
                          <span className="text-muted">Quality: </span>
                          <span>{payment.qualityLevel}</span>
                        </div>
                        <div>
                          <span className="text-muted">Scope: </span>
                          <span>{payment.dataScope}</span>
                        </div>
                        <div>
                          <span className="text-muted">Time: </span>
                          <span>{payment.timeRange}</span>
                        </div>
                      </div>
                      <div className="text-sm text-muted">
                        {new Date(payment.date).toLocaleDateString()} at{' '}
                        {new Date(payment.date).toLocaleTimeString()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', marginLeft: '2rem' }}>
                      <div className="text-xl font-bold text-primary">
                        ${payment.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
