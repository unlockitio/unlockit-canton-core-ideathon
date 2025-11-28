import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface SegmentCombination {
  bedroom?: string;
  livingArea?: string;
  yearBuilt?: string;
  propertyType?: string;
  minPrice: number;
  avgPrice: number;
  maxPrice: number;
  minDaysOnMarket?: number;
  avgDaysOnMarket?: number;
  maxDaysOnMarket?: number;
  transactionCount: number;
  transactions?: Array<{
    address: string;
    price: number;
    bedrooms: number;
    sqft: number;
    trustScoreRange: string;
    date: string;
  }>;
}

interface ReportResult {
  combinations: SegmentCombination[];
  totalTransactionCount: number;
}

interface Insight {
  id: string;
  postalCode: string;
  qualityLevel: string;
  dataScope: string;
  timeRange: string;
  price: number;
  purchaseDate: string;
  status: string;
  segment: {
    bedrooms: string[];
    livingArea: string[];
    yearBuilt: string[];
    propertyType: string[];
  };
  reportData?: ReportResult; // The snapshot data from when it was purchased
}

export default function InsightDetail() {
  const { id } = useParams<{ id: string }>();
  const [insight, setInsight] = useState<Insight | null>(null);
  const [reportResult, setReportResult] = useState<ReportResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInsightData = () => {
      const insights = JSON.parse(localStorage.getItem('insights') || '[]');
      const found = insights.find((i: Insight) => i.id === id);

      if (!found) {
        setLoading(false);
        return;
      }

      setInsight(found);

      // Load the snapshot data that was captured at purchase time
      if (found.reportData) {
        setReportResult(found.reportData);
      } else {
        // Legacy insights without reportData - show error
        setError('This insight was purchased before data snapshots were implemented. Please purchase a new insight.');
      }

      setLoading(false);
    };

    loadInsightData();
  }, [id]);

  if (loading) return <div>Loading insight...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!insight || !reportResult) return <div>Insight not found</div>;

  return (
    <div className="container">
      <div className="mb-4">
        <Link to="/insights" className="text-primary" style={{ textDecoration: 'none' }}>
          ← Back to Insights
        </Link>
      </div>

      <div className="card mb-4">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
          <div>
            <h1 className="text-xl font-bold mb-2">Market Data Report - {insight.postalCode}</h1>
            <div className="text-muted text-sm">
              Purchased on {new Date(insight.purchaseDate).toLocaleDateString()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-muted text-sm">Total Paid</div>
            <div className="text-xl font-bold text-success">${insight.price?.toFixed(2)}</div>
          </div>
        </div>

        <div style={{ background: '#f7fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <h3 className="font-semibold mb-2">Report Configuration</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
            <div>
              <div className="text-muted text-sm">Quality Level</div>
              <div className="font-semibold">{insight.qualityLevel}</div>
            </div>
            <div>
              <div className="text-muted text-sm">Data Scope</div>
              <div className="font-semibold">{insight.dataScope}</div>
            </div>
            <div>
              <div className="text-muted text-sm">Time Range</div>
              <div className="font-semibold">{insight.timeRange}</div>
            </div>
          </div>

          {(insight.segment.bedrooms.length > 0 || insight.segment.livingArea.length > 0 ||
            insight.segment.yearBuilt.length > 0 || insight.segment.propertyType.length > 0) && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <div className="text-muted text-sm mb-2">Market Segment</div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
                {insight.segment.bedrooms.length > 0 && (
                  <span className="badge badge-secondary">
                    Bedrooms: {insight.segment.bedrooms.join(', ')}
                  </span>
                )}
                {insight.segment.livingArea.length > 0 && (
                  <span className="badge badge-secondary">
                    Living Area: {insight.segment.livingArea.join(', ')} sqft
                  </span>
                )}
                {insight.segment.yearBuilt.length > 0 && (
                  <span className="badge badge-secondary">
                    Year Built: {insight.segment.yearBuilt.join(', ')}
                  </span>
                )}
                {insight.segment.propertyType.length > 0 && (
                  <span className="badge badge-secondary">
                    Property Type: {insight.segment.propertyType.join(', ')}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h2 className="font-semibold mb-2">Overview</h2>
          <div className="text-muted text-sm">
            Total Transactions: <span className="font-bold text-lg">{reportResult.totalTransactionCount}</span>
          </div>
          <div className="text-muted text-sm">
            Segment Combinations: <span className="font-bold">{reportResult.combinations.length}</span>
          </div>
        </div>

        <h2 className="font-semibold mb-3">Market Segment Analysis</h2>
        {reportResult.combinations.map((combo, index) => {
          const segmentParts = [];
          if (combo.bedroom) segmentParts.push(`${combo.bedroom} BR`);
          if (combo.propertyType) segmentParts.push(combo.propertyType);
          if (combo.livingArea) segmentParts.push(`${combo.livingArea} sqft`);
          if (combo.yearBuilt) segmentParts.push(`Built ${combo.yearBuilt}`);

          const segmentTitle = segmentParts.length > 0
            ? segmentParts.join(' | ')
            : 'All Properties';

          return (
            <div
              key={index}
              style={{
                background: '#f7fafc',
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                border: '1px solid #e2e8f0',
              }}
            >
              <h3 className="font-bold mb-3" style={{ color: '#5850ec' }}>
                {segmentTitle}
              </h3>

              <div style={{ marginBottom: '1.5rem' }}>
                <div className="text-muted text-sm font-semibold mb-2">Price Statistics</div>
                <div className="grid grid-3" style={{ gap: '1rem' }}>
                  <div>
                    <div className="text-muted text-sm mb-1">Min Price</div>
                    <div className="font-bold">${combo.minPrice.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted text-sm mb-1">Average Price</div>
                    <div className="font-bold text-primary">${combo.avgPrice.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted text-sm mb-1">Max Price</div>
                    <div className="font-bold">${combo.maxPrice.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div className="text-muted text-sm">Transaction Count</div>
                <div className="font-bold">{combo.transactionCount}</div>
              </div>

              {combo.avgDaysOnMarket && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div className="text-muted text-sm font-semibold mb-2">Days on Market</div>
                  <div className="grid grid-3" style={{ gap: '1rem' }}>
                    <div>
                      <div className="text-muted text-sm mb-1">Min</div>
                      <div className="font-bold">{combo.minDaysOnMarket} days</div>
                    </div>
                    <div>
                      <div className="text-muted text-sm mb-1">Average</div>
                      <div className="font-bold text-primary">{combo.avgDaysOnMarket} days</div>
                    </div>
                    <div>
                      <div className="text-muted text-sm mb-1">Max</div>
                      <div className="font-bold">{combo.maxDaysOnMarket} days</div>
                    </div>
                  </div>
                </div>
              )}

              {combo.transactions && combo.transactions.length > 0 && (
                <div>
                  <div className="text-muted text-sm font-semibold mb-2">Sample Transactions</div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                          <th style={{ padding: '0.5rem', textAlign: 'left' }}>Address</th>
                          <th style={{ padding: '0.5rem', textAlign: 'right' }}>Price</th>
                          <th style={{ padding: '0.5rem', textAlign: 'center' }}>BR</th>
                          <th style={{ padding: '0.5rem', textAlign: 'right' }}>Sqft</th>
                          <th style={{ padding: '0.5rem', textAlign: 'center' }}>Trust</th>
                          <th style={{ padding: '0.5rem', textAlign: 'left' }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {combo.transactions.map((tx, txIndex) => (
                          <tr key={txIndex} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '0.5rem' }}>{tx.address}</td>
                            <td style={{ padding: '0.5rem', textAlign: 'right' }}>${tx.price.toLocaleString()}</td>
                            <td style={{ padding: '0.5rem', textAlign: 'center' }}>{tx.bedrooms}</td>
                            <td style={{ padding: '0.5rem', textAlign: 'right' }}>{tx.sqft.toLocaleString()}</td>
                            <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                              <span className="badge badge-secondary">
                                {tx.trustScoreRange}
                              </span>
                            </td>
                            <td style={{ padding: '0.5rem' }}>{tx.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
