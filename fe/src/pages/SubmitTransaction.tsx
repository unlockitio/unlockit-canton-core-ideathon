import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cantonApi } from '../services/cantonApi';
import {
  generateTransactionId,
  isoStringToDamlTime,
  toOptionalInt,
  toOptional,
  TemplateIds
} from '../utils/daml';

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
  const { party, userAccount, userRole, verificationWeight } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    setError(null);

    try {
      if (!party || !userRole) {
        console.log('User not authenticated or role missing: party=', party, ', userRole=', userRole);
        throw new Error('User not authenticated or account not found');
      }

      // Step 1: Query for existing submission rights
      const submissionRights = await cantonApi.query(
        TemplateIds.TransactionSubmissionRight,
        { user: party }
      );

      let submissionRightId: string;

      if (submissionRights.length === 0) {
        // Need to create a submission right first by exercising RequestSubmissionRight
        // Find the user's UserAccount contract
        const userAccounts = await cantonApi.query(
          TemplateIds.UserAccount,
          { user: party }
        );

        if (userAccounts.length === 0) {
          throw new Error('UserAccount not found. Please complete registration first.');
        }

        // Exercise RequestSubmissionRight to create the submission right
        const requestResult = await cantonApi.exercise(
          TemplateIds.UserAccount,
          userAccounts[0].contractId,
          'RequestSubmissionRight',
          {}
        );

        // Extract the created TransactionSubmissionRight contract ID
        // The templateId in the response includes the full package ID, so we match by module:template name
        const submissionRightEvent = requestResult.result?.events?.find(
          (event: any) => {
            const eventTemplateId = event.templateId || event.CreatedEvent?.templateId || '';
            return eventTemplateId.includes('RETVN.Role:TransactionSubmissionRight');
          }
        );

        // Also check for CreatedEvent structure from Canton v3
        const eventAny = submissionRightEvent as any;
        const contractId = eventAny?.contractId || eventAny?.CreatedEvent?.contractId;

        if (!contractId) {
          console.error('RequestSubmissionRight response:', JSON.stringify(requestResult, null, 2));
          throw new Error('Failed to create submission right - no contract ID in response');
        }

        submissionRightId = contractId;
      } else {
        submissionRightId = submissionRights[0].contractId;
      }

      // Step 2: Create TransactionSubmissionProposal
      const transactionId = generateTransactionId();
      const now = new Date();
      const transactionDate = formData.closingDate
        ? new Date(formData.closingDate)
        : now;

      const proposal = {
        operator: userAccount?.operator || 'operator::122...', // TODO: Get from config
        submitter: party,
        submitterRole: userRole,
        submissionRight: submissionRightId,
        transactionId,
        propertyAddress: formData.propertyAddress,
        postalCode: formData.postalCode,
        propertyType: formData.propertyType,
        livingAreaSqft: toOptionalInt(formData.livingAreaSqft),
        lotSizeSqft: toOptionalInt(formData.lotSizeSqft),
        bedroomsTotal: toOptionalInt(formData.bedroomsTotal),
        bathroomsTotal: toOptionalInt(formData.bathroomsTotal),
        yearBuilt: toOptionalInt(formData.yearBuilt),
        salePrice: formData.salePrice || '0',
        transactionDate: isoStringToDamlTime(transactionDate.toISOString()),
        closingDate: formData.closingDate ? isoStringToDamlTime(formData.closingDate) : null,
        financingType: toOptional(formData.financingType),
        daysOnMarket: toOptionalInt(formData.daysOnMarket),
        proposedVerifiers: [],  // TODO: Allow user to select verifiers
        submittedAt: isoStringToDamlTime(now.toISOString()),
      };

      await cantonApi.create(TemplateIds.TransactionSubmissionProposal, proposal);

      navigate('/', {
        state: {
          message: `Transaction ${transactionId} submitted successfully! Waiting for operator approval.`
        }
      });
    } catch (error: any) {
      console.error('Submission failed:', error);
      setError(error.message || 'Failed to submit transaction. Please try again.');
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
        {error && (
          <div className="alert alert-error mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

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
