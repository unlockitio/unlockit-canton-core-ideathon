import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RequestInsightModal from '../components/RequestInsightModal';

interface Insight {
  id: string;
  postalCode: string;
  qualityLevel: string;
  dataScope: string;
  timeRange: string;
  price: number;
  purchaseDate: string;
  status: 'completed' | 'pending' | 'processing';
  filters: {
    bedroomsMin?: number;
    bedroomsMax?: number;
    livingAreaMin?: number;
    livingAreaMax?: number;
    salePriceMin?: number;
    salePriceMax?: number;
  };
}

const MOCK_INSIGHTS: Insight[] = [
  {
    id: 'insight-1',
    postalCode: '94102',
    qualityLevel: 'Premium Quality',
    dataScope: 'Detailed Data',
    timeRange: 'Last Year',
    price: 131.25,
    purchaseDate: '2024-11-20T10:30:00.000Z',
    status: 'completed',
    filters: {
      bedroomsMin: 2,
      bedroomsMax: 4,
    },
  },
  {
    id: 'insight-2',
    postalCode: '94103',
    qualityLevel: 'Verified Only',
    dataScope: 'Standard Data',
    timeRange: 'Most Recent',
    price: 22.5,
    purchaseDate: '2024-11-18T14:15:00.000Z',
    status: 'completed',
    filters: {
      salePriceMin: 500000,
      salePriceMax: 1000000,
    },
  },
  {
    id: 'insight-3',
    postalCode: '94110',
    qualityLevel: 'Basic Quality',
    dataScope: 'Basic Data',
    timeRange: 'Historic Data',
    price: 12.5,
    purchaseDate: '2024-11-15T09:00:00.000Z',
    status: 'completed',
    filters: {},
  },
];

export default function Insights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('insights');
    if (stored) {
      setInsights(JSON.parse(stored));
    } else {
      setInsights(MOCK_INSIGHTS);
      localStorage.setItem('insights', JSON.stringify(MOCK_INSIGHTS));
    }
  }, []);

  const handleInsightCreated = (newInsight: Insight) => {
    const updated = [newInsight, ...insights];
    setInsights(updated);
    localStorage.setItem('insights', JSON.stringify(updated));
  };

  return (
    <div className="container">
      <div className="mb-4">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="text-xl font-bold">Market Insights</h1>
            <p className="text-muted">Your purchased market data reports</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setIsRequestModalOpen(true)}
          >
            Request New Insight
          </button>
        </div>
      </div>

      {insights.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 className="font-semibold mb-2">No Insights Yet</h3>
          <p className="text-muted mb-3">
            Request your first market insight to get started analyzing real estate data
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setIsRequestModalOpen(true)}
          >
            Request Your First Insight
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {insights.map((insight) => (
            <Link
              key={insight.id}
              to={`/insights/${insight.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                className="card"
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                      <h3 className="font-bold text-lg">
                        Market Report - {insight.postalCode}
                      </h3>
                      <span
                        className={`badge ${
                          insight.status === 'completed'
                            ? 'badge-success'
                            : insight.status === 'processing'
                            ? 'badge-info'
                            : 'badge-warning'
                        }`}
                      >
                        {insight.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                      <div>
                        <span className="text-muted">Quality: </span>
                        <span className="font-semibold">{insight.qualityLevel}</span>
                      </div>
                      <div>
                        <span className="text-muted">Scope: </span>
                        <span className="font-semibold">{insight.dataScope}</span>
                      </div>
                      <div>
                        <span className="text-muted">Time Range: </span>
                        <span className="font-semibold">{insight.timeRange}</span>
                      </div>
                    </div>

                    {(insight.filters.bedroomsMin || insight.filters.bedroomsMax ||
                      insight.filters.livingAreaMin || insight.filters.livingAreaMax ||
                      insight.filters.salePriceMin || insight.filters.salePriceMax) && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span className="text-muted text-sm">Filters:</span>
                        {(insight.filters.bedroomsMin || insight.filters.bedroomsMax) && (
                          <span className="badge badge-secondary text-sm">
                            Bedrooms: {insight.filters.bedroomsMin || 'Any'} - {insight.filters.bedroomsMax || 'Any'}
                          </span>
                        )}
                        {(insight.filters.livingAreaMin || insight.filters.livingAreaMax) && (
                          <span className="badge badge-secondary text-sm">
                            Area: {insight.filters.livingAreaMin || 'Any'} - {insight.filters.livingAreaMax || 'Any'} sqft
                          </span>
                        )}
                        {(insight.filters.salePriceMin || insight.filters.salePriceMax) && (
                          <span className="badge badge-secondary text-sm">
                            Price: ${insight.filters.salePriceMin?.toLocaleString() || 'Any'} - ${insight.filters.salePriceMax?.toLocaleString() || 'Any'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right', marginLeft: '2rem' }}>
                    <div className="text-muted text-sm">Paid</div>
                    <div className="text-xl font-bold text-success mb-2">
                      ${insight.price.toFixed(2)}
                    </div>
                    <div className="text-muted text-sm">
                      {new Date(insight.purchaseDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <RequestInsightModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={handleInsightCreated}
      />
    </div>
  );
}
