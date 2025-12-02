import React, { useState, useEffect } from 'react';
import { cantonApi } from '../services/cantonApi';
import { TemplateIds } from '../utils/daml';

interface MarketInsightOrder {
  contractId: string;
  payload: {
    operator: string;
    buyer: string;
    queryParams: {
      postalCode: string | null;
      qualityLevel: string;
      dataScope: string;
      timeRange: string;
      bedrooms: string[];
      livingArea: string[];
      yearBuilt: string[];
      propertyType: string[];
    };
    orderedAt: string;
  };
}

interface BasketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrder: (order: MarketInsightOrder) => void;
}

export default function BasketModal({ isOpen, onClose, onSelectOrder }: BasketModalProps) {
  const [orders, setOrders] = useState<MarketInsightOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPendingOrders();
    }
  }, [isOpen]);

  const loadPendingOrders = async () => {
    setIsLoading(true);
    try {
      const result = await cantonApi.query(TemplateIds.MarketInsightOrder);
      const parsedOrders = result.map((item: any) => ({
        contractId: item.contractId,
        payload: item.payload,
      }));
      setOrders(parsedOrders);
    } catch (error) {
      console.error('Failed to load pending orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Pending Orders</h2>
          <button className="modal-close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {isLoading ? (
            <div className="text-center" style={{ padding: '2rem' }}>
              <p>Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center" style={{ padding: '2rem' }}>
              <p className="text-muted">No pending orders</p>
              <small>Orders you confirm but haven't paid for will appear here</small>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map((order) => {
                const params = order.payload.queryParams;
                const postalCode = params.postalCode || 'N/A';

                return (
                  <div
                    key={order.contractId}
                    className="card"
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      border: '2px solid #e2e8f0',
                    }}
                    onClick={() => {
                      onSelectOrder(order);
                      onClose();
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#5850ec';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(88, 80, 236, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <h4 className="font-bold mb-2">Market Insight - {postalCode}</h4>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                          <div><strong>Quality:</strong> {params.qualityLevel}</div>
                          <div><strong>Scope:</strong> {params.dataScope}</div>
                          <div><strong>Time Range:</strong> {params.timeRange}</div>
                          {params.bedrooms.length > 0 && (
                            <div><strong>Bedrooms:</strong> {params.bedrooms.join(', ')}</div>
                          )}
                        </div>
                        <div className="badge badge-warning mt-2">
                          Awaiting Payment
                        </div>
                      </div>
                      <div style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#5850ec',
                        color: 'white',
                        borderRadius: '6px',
                        fontWeight: '600',
                        fontSize: '0.875rem'
                      }}>
                        Complete →
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
