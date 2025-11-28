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
  segment: {
    bedrooms: string[];
    livingArea: string[];
    yearBuilt: string[];
    propertyType: string[];
  };
}

// Mock insights removed - all insights now use real Canton data

export default function Insights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('insights');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Filter out any insights without reportData (old mock insights)
      const validInsights = parsed.filter((insight: any) => insight.reportData);
      setInsights(validInsights);
      // Update localStorage to remove invalid insights
      localStorage.setItem('insights', JSON.stringify(validInsights));
    } else {
      // Start with empty list - user must purchase insights
      setInsights([]);
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

                    {(insight.segment.bedrooms.length > 0 ||
                      insight.segment.livingArea.length > 0 ||
                      insight.segment.yearBuilt.length > 0 ||
                      insight.segment.propertyType.length > 0) && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span className="text-muted text-sm">Segment:</span>
                        {insight.segment.bedrooms.length > 0 && (
                          <span className="badge badge-secondary text-sm">
                            Bedrooms: {insight.segment.bedrooms.join(', ')}
                          </span>
                        )}
                        {insight.segment.livingArea.length > 0 && (
                          <span className="badge badge-secondary text-sm">
                            Area: {insight.segment.livingArea.join(', ')} sqft
                          </span>
                        )}
                        {insight.segment.yearBuilt.length > 0 && (
                          <span className="badge badge-secondary text-sm">
                            Built: {insight.segment.yearBuilt.join(', ')}
                          </span>
                        )}
                        {insight.segment.propertyType.length > 0 && (
                          <span className="badge badge-secondary text-sm">
                            Type: {insight.segment.propertyType.join(', ')}
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
