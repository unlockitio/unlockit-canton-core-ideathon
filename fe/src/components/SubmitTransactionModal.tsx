import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { cantonApi } from '../services/cantonApi';
import type { Contract } from '../types/canton';
import type { UserRole } from '../codegen/unlockit-canton-core-ideathon-0.0.1/lib/RETVN/Role/module';
import {
  generateTransactionId,
  isoStringToDamlTime,
  toOptionalInt,
  toOptional,
  TemplateIds
} from '../utils/daml';

interface UserAccount {
  operator: string;
  user: string;
  role: UserRole;
  verificationWeight: number;
  credentialPresentations: string[];
  registeredAt: string;
  status: string;
}

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

interface SubmitTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (transactionId: string) => void;
}

export default function SubmitTransactionModal({ isOpen, onClose, onSuccess }: SubmitTransactionModalProps) {
  const { party, userAccount, userRole } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usersByRole, setUsersByRole] = useState<Map<UserRole, Contract<UserAccount>[]>>(new Map());
  const [selectedVerifiers, setSelectedVerifiers] = useState<Map<UserRole, string>>(new Map());
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

  // Fetch available users when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAvailableUsers();
    }
  }, [isOpen]);

  const fetchAvailableUsers = async () => {
    try {
      const accounts = await cantonApi.getAllUserAccounts();

      // Group users by role (one per role constraint)
      const byRole = new Map<UserRole, Contract<UserAccount>[]>();
      accounts.forEach((account) => {
        const role = account.payload.role as UserRole;
        const typedAccount: Contract<UserAccount> = {
          ...account,
          payload: {
            ...account.payload,
            role: role,
          },
        };
        if (!byRole.has(role)) {
          byRole.set(role, []);
        }
        byRole.get(role)!.push(typedAccount);
      });

      setUsersByRole(byRole);
    } catch (err) {
      console.error('Failed to fetch available users:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleVerifierSelect = (role: UserRole, party: string) => {
    setSelectedVerifiers(prev => {
      const newMap = new Map(prev);
      if (party === '') {
        newMap.delete(role);
      } else {
        newMap.set(role, party);
      }
      return newMap;
    });
  };

  const handleClose = () => {
    setStep(1);
    setError(null);
    setSelectedVerifiers(new Map());
    setFormData({
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
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!party || !userRole) {
        throw new Error('User not authenticated or account not found');
      }

      const submissionRights = await cantonApi.query(
        TemplateIds.TransactionSubmissionRight,
        { user: party }
      );

      let submissionRightId: string;

      if (submissionRights.length === 0) {
        const userAccounts = await cantonApi.query(
          TemplateIds.UserAccount,
          { user: party }
        );

        if (userAccounts.length === 0) {
          throw new Error('UserAccount not found. Please complete registration first.');
        }

        const requestResult = await cantonApi.exercise(
          TemplateIds.UserAccount,
          userAccounts[0].contractId,
          'RequestSubmissionRight',
          {}
        );

        const submissionRightEvent = requestResult.result?.events?.find(
          (event: any) => {
            const eventTemplateId = event.templateId || event.CreatedEvent?.templateId || '';
            return eventTemplateId.includes('RETVN.Role:TransactionSubmissionRight');
          }
        );

        const eventAny = submissionRightEvent as any;
        const contractId = eventAny?.contractId || eventAny?.CreatedEvent?.contractId;

        if (!contractId) {
          throw new Error('Failed to create submission right - no contract ID in response');
        }

        submissionRightId = contractId;
      } else {
        submissionRightId = submissionRights[0].contractId;
      }

      const transactionId = generateTransactionId();
      const now = new Date();
      const transactionDate = formData.closingDate
        ? new Date(formData.closingDate)
        : now;

      // Convert selected verifiers Map to array of party strings
      const proposedVerifiers = Array.from(selectedVerifiers.values());

      const proposal = {
        operator: userAccount?.operator || 'operator::122...',
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
        proposedVerifiers: proposedVerifiers,
        submittedAt: isoStringToDamlTime(now.toISOString()),
      };

      await cantonApi.create(TemplateIds.TransactionSubmissionProposal, proposal);

      if (onSuccess) {
        onSuccess(transactionId);
      }
      handleClose();
    } catch (error: any) {
      console.error('Submission failed:', error);
      setError(error.message || 'Failed to submit transaction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Submit Transaction" size="large">
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

            <div className="mb-4" style={{ background: '#f7fafc', padding: '1.5rem', borderRadius: '8px' }}>
              <h4 className="font-semibold mb-2">Assign Verifiers (Optional)</h4>
              <p className="text-sm text-muted mb-3">
                Select one user per role to verify this transaction. You will be automatically assigned as a verifier.
              </p>

              {Array.from(usersByRole.entries()).map(([role, users]) => (
                <div key={role} className="form-group">
                  <label className="form-label">{role}</label>
                  <select
                    className="form-select"
                    value={selectedVerifiers.get(role) || ''}
                    onChange={(e) => handleVerifierSelect(role, e.target.value)}
                  >
                    <option value="">-- No verifier selected --</option>
                    {users.map((user) => (
                      <option key={user.contractId} value={user.payload.user}>
                        {user.payload.user} (Weight: {user.payload.verificationWeight})
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {selectedVerifiers.size > 0 && (
                <div className="alert alert-info mt-3" style={{ fontSize: '0.875rem' }}>
                  <strong>Selected Verifiers:</strong> {selectedVerifiers.size} + You (submitter)
                </div>
              )}
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
    </Modal>
  );
}
