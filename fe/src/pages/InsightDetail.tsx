import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface ReportResult {
  minPrice: number;
  avgPrice: number;
  maxPrice: number;
  minDaysOnMarket?: number;
  avgDaysOnMarket?: number;
  maxDaysOnMarket?: number;
  transactionCount: number;
  propertyTypeDistribution?: Array<{ type: string; count: number; percentage: number }>;
  transactions?: Array<{
    address: string;
    price: number;
    bedrooms: number;
    sqft: number;
    trustScore: number;
    date: string;
  }>;
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
  filters: any;
}

export default function InsightDetail() {
  const { id } = useParams<{ id: string }>();
  const [insight, setInsight] = useState<Insight | null>(null);
  const [reportResult, setReportResult] = useState<ReportResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const insights = JSON.parse(localStorage.getItem('insights') || '[]');
    const found = insights.find((i: Insight) => i.id === id);

    if (found) {
      setInsight(found);

      const mockResult: ReportResult = {
        minPrice: 650000,
        avgPrice: 875000,
        maxPrice: 1250000,
        transactionCount: 42,
      };

      if (found.dataScope !== 'Basic Data') {
        mockResult.minDaysOnMarket = 12;
        mockResult.avgDaysOnMarket = 28;
        mockResult.maxDaysOnMarket = 67;
        mockResult.propertyTypeDistribution = [
          { type: 'Single Family', count: 18, percentage: 43 },
          { type: 'Condo', count: 16, percentage: 38 },
          { type: 'Townhouse', count: 6, percentage: 14 },
          { type: 'Multi-Family', count: 2, percentage: 5 },
        ];
      }

      if (found.dataScope === 'Detailed Data') {
        mockResult.transactions = [
          { address: '1234 Market St', price: 925000, bedrooms: 3, sqft: 1800, trustScore: 92, date: '2024-11-15' },
          { address: '5678 Oak Ave', price: 1150000, bedrooms: 4, sqft: 2200, trustScore: 88, date: '2024-11-10' },
          { address: '910 Pine St', price: 750000, bedrooms: 2, sqft: 1200, trustScore: 95, date: '2024-11-05' },
          { address: '234 Elm Rd', price: 890000, bedrooms: 3, sqft: 1650, trustScore: 85, date: '2024-10-28' },
          { address: '567 Cedar Ln', price: 1050000, bedrooms: 3, sqft: 1900, trustScore: 90, date: '2024-10-20' },
        ];
      }

      setReportResult(mockResult);
    }

    setLoading(false);
  }, [id]);

  if (loading) return <div>Loading insight...</div>;
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

          {(insight.filters.bedroomsMin || insight.filters.bedroomsMax || insight.filters.livingAreaMin ||
            insight.filters.livingAreaMax || insight.filters.salePriceMin || insight.filters.salePriceMax) && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <div className="text-muted text-sm mb-2">Applied Filters</div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
                {(insight.filters.bedroomsMin || insight.filters.bedroomsMax) && (
                  <span className="badge badge-secondary">
                    Bedrooms: {insight.filters.bedroomsMin || 'Any'} - {insight.filters.bedroomsMax || 'Any'}
                  </span>
                )}
                {(insight.filters.livingAreaMin || insight.filters.livingAreaMax) && (
                  <span className="badge badge-secondary">
                    Living Area: {insight.filters.livingAreaMin || 'Any'} - {insight.filters.livingAreaMax || 'Any'} sqft
                  </span>
                )}
                {(insight.filters.salePriceMin || insight.filters.salePriceMax) && (
                  <span className="badge badge-secondary">
                    Price: ${insight.filters.salePriceMin?.toLocaleString() || 'Any'} - ${insight.filters.salePriceMax?.toLocaleString() || 'Any'}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <h2 className="font-semibold mb-3">Price Statistics</h2>
        <div className="grid grid-3" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <div className="text-muted text-sm font-semibold mb-1">Min Price</div>
            <div className="text-xl font-bold">${reportResult.minPrice.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-muted text-sm font-semibold mb-1">Average Price</div>
            <div className="text-xl font-bold text-primary">${reportResult.avgPrice.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-muted text-sm font-semibold mb-1">Max Price</div>
            <div className="text-xl font-bold">${reportResult.maxPrice.toLocaleString()}</div>
          </div>
        </div>

        <div className="mb-3">
          <div className="text-muted text-sm font-semibold mb-1">Total Transactions</div>
          <div className="text-lg font-bold">{reportResult.transactionCount}</div>
        </div>

        {reportResult.avgDaysOnMarket && (
          <>
            <h3 className="font-semibold mb-3 mt-4">Days on Market</h3>
            <div className="grid grid-3" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <div className="text-muted text-sm mb-1">Min</div>
                <div className="font-bold">{reportResult.minDaysOnMarket} days</div>
              </div>
              <div>
                <div className="text-muted text-sm mb-1">Average</div>
                <div className="font-bold text-primary">{reportResult.avgDaysOnMarket} days</div>
              </div>
              <div>
                <div className="text-muted text-sm mb-1">Max</div>
                <div className="font-bold">{reportResult.maxDaysOnMarket} days</div>
              </div>
            </div>
          </>
        )}

        {reportResult.propertyTypeDistribution && (
          <>
            <h3 className="font-semibold mb-3 mt-4">Property Type Distribution</h3>
            {reportResult.propertyTypeDistribution.map((item) => (
              <div key={item.type} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="font-semibold">{item.type}</span>
                  <span className="text-muted">{item.count} transactions ({item.percentage}%)</span>
                </div>
                <div style={{ background: '#e2e8f0', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                  <div
                    style={{
                      background: '#5850ec',
                      height: '100%',
                      width: `${item.percentage}%`,
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
              </div>
            ))}
          </>
        )}

        {reportResult.transactions && (
          <>
            <h3 className="font-semibold mb-3 mt-4">Individual Transactions</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Address</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Price</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Bedrooms</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Sqft</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Trust Score</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reportResult.transactions.map((tx, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.75rem' }}>{tx.address}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>${tx.price.toLocaleString()}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>{tx.bedrooms}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>{tx.sqft.toLocaleString()}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <span className={`badge ${tx.trustScore >= 90 ? 'badge-success' : tx.trustScore >= 80 ? 'badge-info' : 'badge-warning'}`}>
                          {tx.trustScore}%
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
