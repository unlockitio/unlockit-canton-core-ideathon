import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cantonApi } from '../services/cantonApi';
import { TemplateIds } from '../utils/daml';

interface Payment {
  id: string;
  insightId: string | null;
  postalCode: string;
  qualityLevel: string;
  dataScope: string;
  timeRange: string;
  amount: number;
  date: string;
  status: 'success' | 'failed';
  failureReason?: string;
}

export default function WalletPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      // Query both PaidMarketInsightOrder and FailedPaymentOrder contracts
      const [paidOrders, failedOrders] = await Promise.all([
        cantonApi.query(TemplateIds.PaidMarketInsightOrder),
        cantonApi.query(TemplateIds.FailedPaymentOrder),
      ]);

      const calculatePrice = (params: any) => {
        const qualityMultipliers: Record<string, number> = {
          'basic': 1.0,
          'verified': 1.5,
          'premium': 2.0,
        };
        const scopePrices: Record<string, number> = {
          'basic': 5,
          'standard': 15,
          'detailed': 35,
        };
        const timeMultipliers: Record<string, number> = {
          'recent': 1.0,
          'year': 1.5,
          'historic': 2.5,
        };

        const segmentSelections =
          (params.bedrooms?.length || 0) +
          (params.livingArea?.length || 0) +
          (params.yearBuilt?.length || 0) +
          (params.propertyType?.length || 0);
        const segmentComplexity = 1.0 + (0.05 * segmentSelections);

        return Math.round(
          (scopePrices[params.dataScope] || 5) *
          (qualityMultipliers[params.qualityLevel] || 1.0) *
          (timeMultipliers[params.timeRange] || 1.0) *
          segmentComplexity *
          100
        ) / 100;
      };

      // Transform paid orders
      const paidPayments: Payment[] = paidOrders.map((contract: any) => {
        const params = contract.payload.queryParams;
        return {
          id: contract.contractId,
          insightId: contract.contractId,
          postalCode: params.postalCode || 'N/A',
          qualityLevel: params.qualityLevel,
          dataScope: params.dataScope,
          timeRange: params.timeRange,
          amount: parseFloat(contract.payload.paidAmount) || calculatePrice(params),
          date: contract.payload.paymentConfirmedAt,
          status: 'success' as const,
        };
      });

      // Transform failed orders
      const failedPayments: Payment[] = failedOrders.map((contract: any) => {
        const params = contract.payload.queryParams;
        return {
          id: contract.contractId,
          insightId: null,
          postalCode: params.postalCode || 'N/A',
          qualityLevel: params.qualityLevel,
          dataScope: params.dataScope,
          timeRange: params.timeRange,
          amount: parseFloat(contract.payload.paymentAmount) || calculatePrice(params),
          date: contract.payload.paymentRejectedAt,
          status: 'failed' as const,
          failureReason: contract.payload.failureReason,
        };
      });

      // Combine and sort by date (most recent first)
      const allPayments = [...paidPayments, ...failedPayments].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setPayments(allPayments);
    } catch (error) {
      console.error('Failed to load payments:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading payments...</div>;

  const totalSpent = payments.filter(p => p.status === 'success').reduce((sum, p) => sum + p.amount, 0);
  const totalFailed = payments.filter(p => p.status === 'failed').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Wallet - Payments</h1>
        <p className="text-muted">Your market insight purchases</p>
      </div>

      <div className="grid grid-2 mb-4">
        <div className="card">
          <div className="text-muted text-sm font-semibold mb-1">Total Spent (Success)</div>
          <div className="text-xl font-bold text-success">${totalSpent.toFixed(2)}</div>
          <div className="text-sm text-muted">
            {payments.filter(p => p.status === 'success').length} successful
          </div>
        </div>
        <div className="card">
          <div className="text-muted text-sm font-semibold mb-1">Failed Payments</div>
          <div className="text-xl font-bold text-danger">${totalFailed.toFixed(2)}</div>
          <div className="text-sm text-muted">
            {payments.filter(p => p.status === 'failed').length} failed
          </div>
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
            {payments.map((payment) => {
              const PaymentWrapper = payment.insightId ? Link : 'div';
              const wrapperProps = payment.insightId
                ? { to: `/insights/${payment.insightId}`, style: { textDecoration: 'none', color: 'inherit' } }
                : { style: { textDecoration: 'none', color: 'inherit' } };

              return (
                <PaymentWrapper key={payment.id} {...wrapperProps as any}>
                  <div
                    style={{
                      padding: '1rem',
                      border: `2px solid ${payment.status === 'failed' ? '#f56565' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      cursor: payment.insightId ? 'pointer' : 'default',
                      transition: 'all 0.2s',
                      backgroundColor: payment.status === 'failed' ? '#fff5f5' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (payment.insightId) {
                        e.currentTarget.style.backgroundColor = payment.status === 'failed' ? '#fed7d7' : '#f7fafc';
                        e.currentTarget.style.borderColor = payment.status === 'failed' ? '#fc8181' : '#cbd5e0';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = payment.status === 'failed' ? '#fff5f5' : 'transparent';
                      e.currentTarget.style.borderColor = payment.status === 'failed' ? '#f56565' : '#e2e8f0';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <div className="font-bold">
                            Market Report - {payment.postalCode}
                          </div>
                          <span className={`badge ${payment.status === 'success' ? 'badge-success' : 'badge-danger'}`}>
                            {payment.status}
                          </span>
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
                        {payment.failureReason && (
                          <div className="text-sm text-danger mb-2">
                            <strong>Failure Reason:</strong> {payment.failureReason}
                          </div>
                        )}
                        <div className="text-sm text-muted">
                          {new Date(payment.date).toLocaleDateString()} at{' '}
                          {new Date(payment.date).toLocaleTimeString()}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', marginLeft: '2rem' }}>
                        <div className={`text-xl font-bold ${payment.status === 'success' ? 'text-success' : 'text-danger'}`}>
                          ${payment.amount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </PaymentWrapper>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
