import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TransactionForm {
  propertyAddress: string;
  postalCode: string;
  propertyType: string;
  livingAreaSqft: string;
  lotSizeSqft: string;
  bedroomsTotal: string;
  bathroomsTotal: string;
  yearBuilt: string;
  salePrice: string;
  closingDate: string;
  financingType: string;
  daysOnMarket: string;
}

export default function SubmitTransaction() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TransactionForm>({
    propertyAddress: '',
    postalCode: '',
    propertyType: 'SingleFamily',
    livingAreaSqft: '',
    lotSizeSqft: '',
    bedroomsTotal: '',
    bathroomsTotal: '',
    yearBuilt: '',
    salePrice: '',
    closingDate: '',
    financingType: 'Conventional',
    daysOnMarket: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/', { state: { message: 'Transaction submitted successfully!' } });
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Submit Transaction</h1>
        <p className="text-muted">Submit a new real estate transaction for verification</p>
      </div>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="step-indicator mb-4">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">{step > 1 ? '✓' : '1'}</div>
            <div className="step-label">Property Info</div>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">{step > 2 ? '✓' : '2'}</div>
            <div className="step-label">Transaction Details</div>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Review & Submit</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="form-group">
                <label className="form-label">Property Address *</label>
                <input
                  type="text"
                  name="propertyAddress"
                  className="form-control"
                  value={formData.propertyAddress}
                  onChange={handleChange}
                  placeholder="123 Main Street, City, State"
                  required
                />
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    className="form-control"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="94102"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Property Type *</label>
                  <select
                    name="propertyType"
                    className="form-select"
                    value={formData.propertyType}
                    onChange={handleChange}
                    required
                  >
                    <option value="SingleFamily">Single Family</option>
                    <option value="Condo">Condo</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="MultiFamily">Multi-Family</option>
                    <option value="Land">Land</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Living Area (sqft)</label>
                  <input
                    type="number"
                    name="livingAreaSqft"
                    className="form-control"
                    value={formData.livingAreaSqft}
                    onChange={handleChange}
                    placeholder="1500"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Lot Size (sqft)</label>
                  <input
                    type="number"
                    name="lotSizeSqft"
                    className="form-control"
                    value={formData.lotSizeSqft}
                    onChange={handleChange}
                    placeholder="3000"
                  />
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Bedrooms</label>
                  <input
                    type="number"
                    name="bedroomsTotal"
                    className="form-control"
                    value={formData.bedroomsTotal}
                    onChange={handleChange}
                    placeholder="3"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Bathrooms</label>
                  <input
                    type="number"
                    name="bathroomsTotal"
                    className="form-control"
                    value={formData.bathroomsTotal}
                    onChange={handleChange}
                    placeholder="2"
                    step="0.5"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Year Built</label>
                <input
                  type="number"
                  name="yearBuilt"
                  className="form-control"
                  value={formData.yearBuilt}
                  onChange={handleChange}
                  placeholder="1995"
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </div>

              <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
                Next: Transaction Details
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-group">
                <label className="form-label">Sale Price *</label>
                <input
                  type="number"
                  name="salePrice"
                  className="form-control"
                  value={formData.salePrice}
                  onChange={handleChange}
                  placeholder="850000"
                  min="0"
                  step="1000"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Closing Date *</label>
                <input
                  type="date"
                  name="closingDate"
                  className="form-control"
                  value={formData.closingDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Financing Type</label>
                <select
                  name="financingType"
                  className="form-select"
                  value={formData.financingType}
                  onChange={handleChange}
                >
                  <option value="Conventional">Conventional</option>
                  <option value="FHA">FHA</option>
                  <option value="VA">VA</option>
                  <option value="Cash">Cash</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Days on Market</label>
                <input
                  type="number"
                  name="daysOnMarket"
                  className="form-control"
                  value={formData.daysOnMarket}
                  onChange={handleChange}
                  placeholder="30"
                  min="0"
                />
              </div>

              <div className="grid grid-2" style={{ gap: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                  Back
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
                  Next: Review
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="mb-3 font-bold">Review Your Submission</h3>

              <div className="mb-4" style={{ background: '#f7fafc', padding: '1.5rem', borderRadius: '8px' }}>
                <h4 className="font-semibold mb-2">Property Information</h4>
                <div className="grid grid-2" style={{ gap: '0.5rem', fontSize: '0.9rem' }}>
                  <div><strong>Address:</strong> {formData.propertyAddress}</div>
                  <div><strong>Postal Code:</strong> {formData.postalCode}</div>
                  <div><strong>Type:</strong> {formData.propertyType}</div>
                  <div><strong>Living Area:</strong> {formData.livingAreaSqft || 'N/A'} sqft</div>
                  <div><strong>Lot Size:</strong> {formData.lotSizeSqft || 'N/A'} sqft</div>
                  <div><strong>Bedrooms:</strong> {formData.bedroomsTotal || 'N/A'}</div>
                  <div><strong>Bathrooms:</strong> {formData.bathroomsTotal || 'N/A'}</div>
                  <div><strong>Year Built:</strong> {formData.yearBuilt || 'N/A'}</div>
                </div>

                <h4 className="font-semibold mb-2 mt-3">Transaction Details</h4>
                <div className="grid grid-2" style={{ gap: '0.5rem', fontSize: '0.9rem' }}>
                  <div><strong>Sale Price:</strong> ${Number(formData.salePrice).toLocaleString()}</div>
                  <div><strong>Closing Date:</strong> {formData.closingDate}</div>
                  <div><strong>Financing:</strong> {formData.financingType}</div>
                  <div><strong>Days on Market:</strong> {formData.daysOnMarket || 'N/A'}</div>
                </div>
              </div>

              <div className="alert alert-info mb-4">
                By submitting this transaction, you confirm that all information provided is accurate to the best of your knowledge. This transaction will be assigned to verifiers for review.
              </div>

              <div className="grid grid-2" style={{ gap: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setStep(2)} disabled={isLoading}>
                  Back
                </button>
                <button type="submit" className="btn btn-success" disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Submit Transaction'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
