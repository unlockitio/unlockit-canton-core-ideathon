import React, { useState } from 'react';

interface MarketDataTier {
  name: string;
  price: string;
  timeRange: string;
  features: string[];
  dataAccess: string;
  badge?: string;
}

const DATA_TIERS: MarketDataTier[] = [
  {
    name: 'Public Access',
    price: 'Free',
    timeRange: '30 days',
    dataAccess: 'Aggregates only',
    features: [
      'Basic market statistics',
      'Postal code aggregates',
      'Average prices',
      'Limited time range',
    ],
  },
  {
    name: 'Basic Report',
    price: '$9.99',
    timeRange: '90 days',
    dataAccess: 'Aggregates only',
    features: [
      'Extended time range',
      'Price trends',
      'Property type distribution',
      'Trust score averages',
    ],
    badge: 'Popular',
  },
  {
    name: 'Professional Report',
    price: '$49.99',
    timeRange: '365 days',
    dataAccess: 'Individual transactions',
    features: [
      'Full year of data',
      'Individual transactions',
      'Detailed property info',
      'Trust score breakdown',
      'Verification details',
    ],
    badge: 'Best Value',
  },
  {
    name: 'Institutional Access',
    price: '$499/mo',
    timeRange: 'Unlimited',
    dataAccess: 'Full API access',
    features: [
      'Unlimited historical data',
      'Full API access',
      'Real-time updates',
      'Custom queries',
      'Bulk downloads',
      'Priority support',
    ],
  },
];

const MOCK_MARKET_DATA = {
  postalCode: '94102',
  transactionCount: 47,
  medianPrice: 875000,
  averagePrice: 920500,
  medianPricePerSqft: 583,
  averageDaysOnMarket: 28,
  averageTrustScore: 76,
  propertyTypeDistribution: [
    { type: 'Single Family', count: 18, percentage: 38 },
    { type: 'Condo', count: 22, percentage: 47 },
    { type: 'Townhouse', count: 5, percentage: 11 },
    { type: 'Multi-Family', count: 2, percentage: 4 },
  ],
};

export default function MarketData() {
  const [postalCode, setPostalCode] = useState('94102');
  const [showPricing, setShowPricing] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Market Data</h1>
        <p className="text-muted">Access real estate transaction data and market insights</p>
      </div>

      <div className="card mb-4">
        <div className="form-group">
          <label className="form-label">Search by Postal Code</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              className="form-control"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Enter postal code (e.g., 94102)"
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" style={{ width: '150px' }}>
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-2 mb-4">
        <div>
          <div className="card">
            <h2 className="card-header">Market Overview - {MOCK_MARKET_DATA.postalCode}</h2>

            <div className="grid grid-2" style={{ gap: '1.5rem' }}>
              <div>
                <div className="text-muted text-sm font-semibold mb-1">Total Transactions</div>
                <div className="text-xl font-bold">{MOCK_MARKET_DATA.transactionCount}</div>
              </div>
              <div>
                <div className="text-muted text-sm font-semibold mb-1">Avg Trust Score</div>
                <div className="text-xl font-bold text-success">{MOCK_MARKET_DATA.averageTrustScore}/100</div>
              </div>
              <div>
                <div className="text-muted text-sm font-semibold mb-1">Median Price</div>
                <div className="text-xl font-bold">${MOCK_MARKET_DATA.medianPrice.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted text-sm font-semibold mb-1">Average Price</div>
                <div className="text-xl font-bold">${MOCK_MARKET_DATA.averagePrice.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted text-sm font-semibold mb-1">Price per Sqft</div>
                <div className="text-xl font-bold">${MOCK_MARKET_DATA.medianPricePerSqft}</div>
              </div>
              <div>
                <div className="text-muted text-sm font-semibold mb-1">Days on Market</div>
                <div className="text-xl font-bold">{MOCK_MARKET_DATA.averageDaysOnMarket}</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <h2 className="card-header">Property Type Distribution</h2>
            {MOCK_MARKET_DATA.propertyTypeDistribution.map((item) => (
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
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="card-header" style={{ marginBottom: 0 }}>Access More Data</h2>
          <button className="btn btn-secondary" onClick={() => setShowPricing(!showPricing)}>
            {showPricing ? 'Hide' : 'View'} Pricing Tiers
          </button>
        </div>

        {showPricing && (
          <div className="grid grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {DATA_TIERS.map((tier) => (
              <div
                key={tier.name}
                style={{
                  border: '2px solid',
                  borderColor: selectedTier === tier.name ? '#5850ec' : '#e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => setSelectedTier(tier.name)}
                onMouseEnter={(e) => {
                  if (selectedTier !== tier.name) {
                    e.currentTarget.style.borderColor = '#cbd5e0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedTier !== tier.name) {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }
                }}
              >
                {tier.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      right: '12px',
                      background: '#5850ec',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {tier.badge}
                  </div>
                )}

                <h3 className="font-bold mb-2">{tier.name}</h3>
                <div className="text-xl font-bold text-primary mb-1">{tier.price}</div>
                <div className="text-sm text-muted mb-3">
                  {tier.timeRange} • {tier.dataAccess}
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {tier.features.map((feature, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      ✓ {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`btn ${selectedTier === tier.name ? 'btn-primary' : 'btn-secondary'} btn-block mt-3`}
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Selected: ${tier.name}`);
                  }}
                >
                  {selectedTier === tier.name ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
