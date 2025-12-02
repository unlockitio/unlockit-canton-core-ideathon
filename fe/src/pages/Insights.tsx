import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RequestInsightModal from '../components/RequestInsightModal';
import { cantonApi } from '../services/cantonApi';
import { TemplateIds } from '../utils/daml';

interface Insight {
  id: string;
  postalCode: string;
  qualityLevel: string;
  dataScope: string;
  timeRange: string;
  price: number;
  purchaseDate: string;
  status: 'completed';
  segment: {
    bedrooms: string[];
    livingArea: string[];
    yearBuilt: string[];
    propertyType: string[];
  };
  reportData?: {
    combinations: Array<{
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
    }>;
    totalTransactionCount: number;
  };
}

export default function Insights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [existingOrder, setExistingOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      // Query MarketInsight contracts from Canton
      const contracts = await cantonApi.query(TemplateIds.MarketInsight);

      // Transform Canton contracts to Insight format
      const transformedInsights: Insight[] = contracts.map((contract: any) => {
        const params = contract.payload.queryParams;

        // Calculate price (same logic as in basket)
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

        const price = Math.round(
          (scopePrices[params.dataScope] || 5) *
          (qualityMultipliers[params.qualityLevel] || 1.0) *
          (timeMultipliers[params.timeRange] || 1.0) *
          segmentComplexity *
          100
        ) / 100;

        // Transform insightData to reportData format
        const insightData = contract.payload.insightData;
        const reportData = insightData ? {
          totalTransactionCount: insightData.totalTransactionCount,
          combinations: insightData.segments.map((seg: any) => ({
            bedroom: seg.bedroom || undefined,
            livingArea: seg.livingArea || undefined,
            yearBuilt: seg.yearBuilt || undefined,
            propertyType: seg.propertyType || undefined,
            minPrice: parseFloat(seg.minPrice),
            avgPrice: parseFloat(seg.avgPrice),
            maxPrice: parseFloat(seg.maxPrice),
            transactionCount: seg.transactionCount,
            minDaysOnMarket: seg.minDaysOnMarket || undefined,
            avgDaysOnMarket: seg.avgDaysOnMarket || undefined,
            maxDaysOnMarket: seg.maxDaysOnMarket || undefined,
            transactions: seg.transactions?.map((tx: any) => ({
              address: tx.address,
              price: parseFloat(tx.price),
              bedrooms: tx.bedrooms,
              sqft: tx.sqft,
              trustScoreRange: `${tx.trustScore}%`,
              date: tx.date,
            })) || [],
          })),
        } : undefined;

        return {
          id: contract.contractId,
          postalCode: params.postalCode || 'N/A',
          qualityLevel: params.qualityLevel,
          dataScope: params.dataScope,
          timeRange: params.timeRange,
          price: price,
          purchaseDate: contract.payload.fulfilledAt,
          status: 'completed',
          segment: {
            bedrooms: params.bedrooms || [],
            livingArea: params.livingArea || [],
            yearBuilt: params.yearBuilt || [],
            propertyType: params.propertyType || [],
          },
          reportData: reportData,
        };
      });

      setInsights(transformedInsights);
      // Save to localStorage so InsightDetail can access the data
      localStorage.setItem('insights', JSON.stringify(transformedInsights));
    } catch (error) {
      console.error('Failed to load insights:', error);
      setInsights([]);
      localStorage.setItem('insights', JSON.stringify([]));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Listen for basket order selection
    const handleBasketOrder = (event: Event) => {
      const customEvent = event as CustomEvent;
      const order = customEvent.detail;

      const params = order.payload.queryParams;

      // Calculate price matching RequestInsightModal logic
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

      const calculatedPrice = Math.round(
        (scopePrices[params.dataScope] || 5) *
        (qualityMultipliers[params.qualityLevel] || 1.0) *
        (timeMultipliers[params.timeRange] || 1.0) *
        segmentComplexity *
        100
      ) / 100;

      setExistingOrder({
        contractId: order.contractId,
        queryParams: {
          postalCode: params.postalCode || '',
          bedrooms: params.bedrooms || [],
          livingArea: params.livingArea || [],
          yearBuilt: params.yearBuilt || [],
          propertyType: params.propertyType || [],
          qualityLevel: params.qualityLevel,
          dataScope: params.dataScope,
          timeRange: params.timeRange,
        },
        calculatedPrice,
      });
      setIsRequestModalOpen(true);
    };

    window.addEventListener('openBasketOrder', handleBasketOrder);
    return () => {
      window.removeEventListener('openBasketOrder', handleBasketOrder);
    };
  }, []);

  const handleInsightCreated = () => {
    // Reload insights from Canton after payment is completed
    loadInsights();
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

      {isLoading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading insights...</p>
        </div>
      ) : insights.length === 0 ? (
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
        onClose={() => {
          setIsRequestModalOpen(false);
          setExistingOrder(null);
        }}
        onSuccess={handleInsightCreated}
        existingOrder={existingOrder}
      />
    </div>
  );
}
