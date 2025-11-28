import React, { useState } from 'react';
import { config } from '../config';

interface DataQualityLevel {
  id: string;
  name: string;
  minTrustScore: number;
  description: string;
  multiplier: number;
}

interface DataScope {
  id: string;
  name: string;
  fields: string[];
  description: string;
  basePrice: number;
}

interface TimeRange {
  id: string;
  name: string;
  description: string;
  multiplier: number;
}

interface MarketDataRequest {
  postalCode: string;
  bedrooms: string[];
  livingArea: string[];
  yearBuilt: string[];
  propertyType: string[];
  qualityLevel: string;
  dataScope: string;
  timeRange: string;
}

const BEDROOM_OPTIONS = ['Studio', '1', '2', '3', '4', '5+'];
const LIVING_AREA_OPTIONS = ['<800', '800-1200', '1200-1600', '1600-2000', '2000-2500', '2500+'];
const YEAR_BUILT_OPTIONS = ['Pre-1950', '1950s-1970s', '1980s-1990s', '2000s-2010s', '2020+'];
const PROPERTY_TYPE_OPTIONS = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family'];

const QUALITY_LEVELS: DataQualityLevel[] = [
  {
    id: 'basic',
    name: 'Basic Quality',
    minTrustScore: 0,
    description: 'All transactions, regardless of verification status',
    multiplier: 1.0,
  },
  {
    id: 'verified',
    name: 'Verified Only',
    minTrustScore: 50,
    description: 'Transactions with at least 50% trust score',
    multiplier: 1.5,
  },
  {
    id: 'premium',
    name: 'Premium Quality',
    minTrustScore: 80,
    description: 'Highly verified transactions (80%+ trust score)',
    multiplier: 2.0,
  },
];

const DATA_SCOPES: DataScope[] = [
  {
    id: 'basic',
    name: 'Basic Data',
    fields: ['Min Price', 'Avg Price', 'Max Price'],
    description: 'Essential price statistics only',
    basePrice: 5,
  },
  {
    id: 'standard',
    name: 'Standard Data',
    fields: ['Prices', 'Days on Market', 'Property Types'],
    description: 'Price data plus market timing and property distribution',
    basePrice: 15,
  },
  {
    id: 'detailed',
    name: 'Detailed Data',
    fields: ['All Stats', 'Individual Transactions', 'Trust Scores'],
    description: 'Complete market analysis with transaction-level details',
    basePrice: 35,
  },
];

const TIME_RANGES: TimeRange[] = [
  {
    id: 'recent',
    name: 'Most Recent',
    description: 'Last 30 days of data',
    multiplier: 1.0,
  },
  {
    id: 'year',
    name: 'Last Year',
    description: 'Past 12 months',
    multiplier: 1.5,
  },
  {
    id: 'historic',
    name: 'Historic Data',
    description: 'All available data',
    multiplier: 2.5,
  },
];

interface PaymentInfo {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

interface RequestInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (insight: any) => void;
}

export default function RequestInsightModal({
  isOpen,
  onClose,
  onSuccess,
}: RequestInsightModalProps) {
  const [step, setStep] = useState(1);
  const [request, setRequest] = useState<MarketDataRequest>({
    postalCode: '',
    bedrooms: [],
    livingArea: [],
    yearBuilt: [],
    propertyType: [],
    qualityLevel: '',
    dataScope: '',
    timeRange: '',
  });
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePostalCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (request.postalCode.length >= 5) {
      setStep(2);
    }
  };

  const handleSegmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const toggleSelection = (category: keyof Pick<MarketDataRequest, 'bedrooms' | 'livingArea' | 'yearBuilt' | 'propertyType'>, value: string) => {
    const current = request[category];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setRequest({ ...request, [category]: updated });
  };

  const handleQualitySelect = (qualityId: string) => {
    setRequest({ ...request, qualityLevel: qualityId });
    setStep(4);
  };

  const handleScopeSelect = (scopeId: string) => {
    setRequest({ ...request, dataScope: scopeId });
    setStep(5);
  };

  const handleTimeRangeSelect = async (timeRangeId: string) => {
    setRequest({ ...request, timeRange: timeRangeId });
    setIsCalculating(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.backendUrl}/api/calculate-price`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...request,
          timeRange: timeRangeId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCalculatedPrice(data.price);
      } else {
        calculatePrice(timeRangeId);
      }
    } catch (error) {
      console.error('Failed to calculate price:', error);
      calculatePrice(timeRangeId);
    } finally {
      setIsCalculating(false);
      setStep(6);
    }
  };

  const calculatePrice = (timeRangeId: string) => {
    const quality = QUALITY_LEVELS.find(q => q.id === request.qualityLevel);
    const scope = DATA_SCOPES.find(s => s.id === request.dataScope);
    const timeRange = TIME_RANGES.find(t => t.id === timeRangeId);

    if (quality && scope && timeRange) {
      const segmentSelections =
        request.bedrooms.length +
        request.livingArea.length +
        request.yearBuilt.length +
        request.propertyType.length;

      const segmentComplexity = 1.0 + (0.05 * segmentSelections);

      const price = scope.basePrice * quality.multiplier * timeRange.multiplier * segmentComplexity;
      setCalculatedPrice(Math.round(price * 100) / 100);
    }
  };

  const handlePurchase = () => {
    setStep(7);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const quality = QUALITY_LEVELS.find(q => q.id === request.qualityLevel);
      const scope = DATA_SCOPES.find(s => s.id === request.dataScope);
      const timeRange = TIME_RANGES.find(t => t.id === request.timeRange);

      // Fetch the actual data snapshot from backend at purchase time
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.backendUrl}/api/market-insights`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postalCode: request.postalCode,
          qualityLevel: request.qualityLevel,
          dataScope: request.dataScope,
          timeRange: request.timeRange,
          bedrooms: request.bedrooms,
          livingArea: request.livingArea,
          yearBuilt: request.yearBuilt,
          propertyType: request.propertyType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }

      const reportData = await response.json();

      // Store the insight with the data snapshot
      const newInsight = {
        id: `insight-${Date.now()}`,
        postalCode: request.postalCode,
        qualityLevel: quality?.name || '',
        dataScope: scope?.name || '',
        timeRange: timeRange?.name || '',
        price: calculatedPrice,
        purchaseDate: new Date().toISOString(),
        status: 'completed',
        segment: {
          bedrooms: request.bedrooms,
          livingArea: request.livingArea,
          yearBuilt: request.yearBuilt,
          propertyType: request.propertyType,
        },
        // Store the actual data snapshot
        reportData: reportData,
      };

      setIsProcessing(false);
      onSuccess?.(newInsight);
      handleReset();
      onClose();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Failed to purchase insight. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setRequest({
      postalCode: '',
      bedrooms: [],
      livingArea: [],
      yearBuilt: [],
      propertyType: [],
      qualityLevel: '',
      dataScope: '',
      timeRange: '',
    });
    setCalculatedPrice(null);
    setPaymentInfo({
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Request Market Insight</h2>
          <button className="modal-close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="step-indicator mb-4">
            <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="step-number">{step > 1 ? '✓' : '1'}</div>
              <div className="step-label">Postal Code</div>
            </div>
            <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="step-number">{step > 2 ? '✓' : '2'}</div>
              <div className="step-label">Segment</div>
            </div>
            <div className={`step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
              <div className="step-number">{step > 3 ? '✓' : '3'}</div>
              <div className="step-label">Quality</div>
            </div>
            <div className={`step ${step >= 4 ? 'active' : ''} ${step > 4 ? 'completed' : ''}`}>
              <div className="step-number">{step > 4 ? '✓' : '4'}</div>
              <div className="step-label">Scope</div>
            </div>
            <div className={`step ${step >= 5 ? 'active' : ''} ${step > 5 ? 'completed' : ''}`}>
              <div className="step-number">{step > 5 ? '✓' : '5'}</div>
              <div className="step-label">Time</div>
            </div>
            <div className={`step ${step >= 6 ? 'active' : ''} ${step > 6 ? 'completed' : ''}`}>
              <div className="step-number">{step > 6 ? '✓' : '6'}</div>
              <div className="step-label">Confirm</div>
            </div>
            <div className={`step ${step >= 7 ? 'active' : ''}`}>
              <div className="step-number">7</div>
              <div className="step-label">Checkout</div>
            </div>
          </div>

          {step === 1 && (
            <form onSubmit={handlePostalCodeSubmit}>
              <h3 className="mb-3 font-bold">Enter Postal Code</h3>
              <div className="form-group">
                <label className="form-label">Postal Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={request.postalCode}
                  onChange={(e) => setRequest({ ...request, postalCode: e.target.value })}
                  placeholder="e.g., 94102"
                  required
                  minLength={5}
                />
                <small className="text-muted">Enter the postal code for the area you want to analyze</small>
              </div>
              <button type="submit" className="btn btn-primary">
                Continue
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSegmentSubmit}>
              <h3 className="mb-3 font-bold">Define Market Segment</h3>
              <p className="text-muted mb-3">
                Select the property characteristics you want to analyze. More specific segments may increase cost.
              </p>

              <div className="form-group mb-4">
                <label className="form-label font-semibold">Bedrooms</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {BEDROOM_OPTIONS.map((option) => (
                    <label
                      key={option}
                      style={{
                        padding: '0.5rem 1rem',
                        border: '2px solid',
                        borderColor: request.bedrooms.includes(option) ? '#5850ec' : '#e2e8f0',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        backgroundColor: request.bedrooms.includes(option) ? '#f0f0ff' : 'transparent',
                        transition: 'all 0.2s',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={request.bedrooms.includes(option)}
                        onChange={() => toggleSelection('bedrooms', option)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="form-label font-semibold">Living Area (sqft)</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {LIVING_AREA_OPTIONS.map((option) => (
                    <label
                      key={option}
                      style={{
                        padding: '0.5rem 1rem',
                        border: '2px solid',
                        borderColor: request.livingArea.includes(option) ? '#5850ec' : '#e2e8f0',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        backgroundColor: request.livingArea.includes(option) ? '#f0f0ff' : 'transparent',
                        transition: 'all 0.2s',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={request.livingArea.includes(option)}
                        onChange={() => toggleSelection('livingArea', option)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="form-label font-semibold">Year Built</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {YEAR_BUILT_OPTIONS.map((option) => (
                    <label
                      key={option}
                      style={{
                        padding: '0.5rem 1rem',
                        border: '2px solid',
                        borderColor: request.yearBuilt.includes(option) ? '#5850ec' : '#e2e8f0',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        backgroundColor: request.yearBuilt.includes(option) ? '#f0f0ff' : 'transparent',
                        transition: 'all 0.2s',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={request.yearBuilt.includes(option)}
                        onChange={() => toggleSelection('yearBuilt', option)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="form-label font-semibold">Property Type</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {PROPERTY_TYPE_OPTIONS.map((option) => (
                    <label
                      key={option}
                      style={{
                        padding: '0.5rem 1rem',
                        border: '2px solid',
                        borderColor: request.propertyType.includes(option) ? '#5850ec' : '#e2e8f0',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        backgroundColor: request.propertyType.includes(option) ? '#f0f0ff' : 'transparent',
                        transition: 'all 0.2s',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={request.propertyType.includes(option)}
                        onChange={() => toggleSelection('propertyType', option)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-2" style={{ gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                  Back
                </button>
                <button type="submit" className="btn btn-primary">
                  Continue
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div>
              <h3 className="mb-3 font-bold">Select Data Quality Level</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {QUALITY_LEVELS.map((quality) => (
                  <div
                    key={quality.id}
                    className="card"
                    style={{
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: request.qualityLevel === quality.id ? '#5850ec' : '#e2e8f0',
                    }}
                    onClick={() => handleQualitySelect(quality.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 className="font-bold">{quality.name}</h4>
                        <p className="text-sm text-muted">{quality.description}</p>
                        <p className="text-sm">Min Trust Score: <strong>{quality.minTrustScore}%</strong></p>
                      </div>
                      <div className="badge badge-info">
                        {quality.multiplier}x pricing
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary mt-3" onClick={() => setStep(2)}>
                Back
              </button>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="mb-3 font-bold">Select Data Scope</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {DATA_SCOPES.map((scope) => (
                  <div
                    key={scope.id}
                    className="card"
                    style={{
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: request.dataScope === scope.id ? '#5850ec' : '#e2e8f0',
                    }}
                    onClick={() => handleScopeSelect(scope.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 className="font-bold">{scope.name}</h4>
                        <p className="text-sm text-muted mb-2">{scope.description}</p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {scope.fields.map((field) => (
                            <span key={field} className="badge badge-secondary">
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="badge badge-primary">
                        ${scope.basePrice} base
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary mt-3" onClick={() => setStep(3)}>
                Back
              </button>
            </div>
          )}

          {step === 5 && (
            <div>
              <h3 className="mb-3 font-bold">Select Time Range</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {TIME_RANGES.map((timeRange) => (
                  <div
                    key={timeRange.id}
                    className="card"
                    style={{
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: request.timeRange === timeRange.id ? '#5850ec' : '#e2e8f0',
                    }}
                    onClick={() => handleTimeRangeSelect(timeRange.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 className="font-bold">{timeRange.name}</h4>
                        <p className="text-sm text-muted">{timeRange.description}</p>
                      </div>
                      <div className="badge badge-info">
                        {timeRange.multiplier}x pricing
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary mt-3" onClick={() => setStep(4)}>
                Back
              </button>
            </div>
          )}

          {step === 6 && (
            <div>
              <h3 className="mb-3 font-bold">Confirm Your Purchase</h3>
              {isCalculating ? (
                <div className="text-center" style={{ padding: '2rem' }}>
                  <p>Calculating price...</p>
                </div>
              ) : (
                <>
                  <div style={{ background: '#f7fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    <h4 className="font-semibold mb-3">Your Selection</h4>
                    <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.9rem' }}>
                      <div><strong>Postal Code:</strong> {request.postalCode}</div>

                      {request.bedrooms.length > 0 && (
                        <div><strong>Bedrooms:</strong> {request.bedrooms.join(', ')}</div>
                      )}
                      {request.livingArea.length > 0 && (
                        <div><strong>Living Area:</strong> {request.livingArea.join(', ')} sqft</div>
                      )}
                      {request.yearBuilt.length > 0 && (
                        <div><strong>Year Built:</strong> {request.yearBuilt.join(', ')}</div>
                      )}
                      {request.propertyType.length > 0 && (
                        <div><strong>Property Type:</strong> {request.propertyType.join(', ')}</div>
                      )}

                      <div><strong>Quality Level:</strong> {QUALITY_LEVELS.find(q => q.id === request.qualityLevel)?.name}</div>
                      <div><strong>Data Scope:</strong> {DATA_SCOPES.find(s => s.id === request.dataScope)?.name}</div>
                      <div><strong>Time Range:</strong> {TIME_RANGES.find(t => t.id === request.timeRange)?.name}</div>
                    </div>

                    {(() => {
                      const combinations =
                        (request.bedrooms.length || 1) *
                        (request.livingArea.length || 1) *
                        (request.yearBuilt.length || 1) *
                        (request.propertyType.length || 1);

                      if (combinations > 1) {
                        return (
                          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                            <div className="text-primary font-semibold">
                              Analyzing {combinations} segment combinations
                            </div>
                            <div className="text-sm text-muted">
                              You will receive separate statistics for each market segment combination
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>

                  <div className="alert alert-success mb-4" style={{ fontSize: '1.5rem', textAlign: 'center', padding: '2rem' }}>
                    <div className="text-muted" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Total Price</div>
                    <div className="font-bold">${calculatedPrice?.toFixed(2)}</div>
                  </div>

                  <div className="grid grid-2" style={{ gap: '1rem' }}>
                    <button className="btn btn-secondary" onClick={handleReset}>
                      Start Over
                    </button>
                    <button className="btn btn-success" onClick={handlePurchase}>
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {step === 7 && (
            <div>
              <h3 className="mb-3 font-bold">Checkout</h3>
              <div style={{ background: '#f7fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <h4 className="font-semibold mb-2">Order Summary</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span>Market Data Report - {request.postalCode}</span>
                  <span className="font-bold">${calculatedPrice?.toFixed(2)}</span>
                </div>
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', fontSize: '0.875rem' }}>
                  <div>{QUALITY_LEVELS.find(q => q.id === request.qualityLevel)?.name}</div>
                  <div>{DATA_SCOPES.find(s => s.id === request.dataScope)?.name}</div>
                  <div>{TIME_RANGES.find(t => t.id === request.timeRange)?.name}</div>
                </div>
              </div>

              <form onSubmit={handlePayment}>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                      setPaymentInfo({ ...paymentInfo, cardNumber: value });
                    }}
                    placeholder="1234 5678 9012 3456"
                    required
                    pattern="\d{16}"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cardholder Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={paymentInfo.cardName}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="grid grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="text"
                      className="form-control"
                      value={paymentInfo.expiryDate}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        const formatted = value.length >= 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
                        setPaymentInfo({ ...paymentInfo, expiryDate: formatted });
                      }}
                      placeholder="MM/YY"
                      required
                      pattern="\d{2}/\d{2}"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input
                      type="text"
                      className="form-control"
                      value={paymentInfo.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                        setPaymentInfo({ ...paymentInfo, cvv: value });
                      }}
                      placeholder="123"
                      required
                      pattern="\d{3}"
                    />
                  </div>
                </div>

                <div className="alert alert-info mb-4">
                  This is a mock checkout. No actual payment will be processed.
                </div>

                <div className="grid grid-2" style={{ gap: '1rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setStep(6)} disabled={isProcessing}>
                    Back
                  </button>
                  <button type="submit" className="btn btn-success" disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : `Pay $${calculatedPrice?.toFixed(2)}`}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
