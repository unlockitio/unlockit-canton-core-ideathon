import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cantonApi } from '../services/cantonApi';
import { TemplateIds } from '../utils/daml';
import type { Contract } from '../types/canton';
import type { TransactionData } from '../codegen/unlockit-canton-core-ideathon-0.0.1/lib/RETVN/Transaction/module';
import VerifyTransactionModal from '../components/VerifyTransactionModal';
import AssignVerifierModal from '../components/AssignVerifierModal';

// Helper to convert DAML Optional ([] or [value]) to JavaScript optional (null or value)
// Canton API sometimes returns null instead of [] for None
function fromDamlOptional<T>(opt: [] | [T] | null | undefined): T | null {
  if (!opt || !Array.isArray(opt) || opt.length === 0) {
    return null;
  }
  return opt[0];
}

export default function TransactionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { party } = useAuth();
  const [transaction, setTransaction] = useState<Contract<TransactionData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isAssignVerifierModalOpen, setIsAssignVerifierModalOpen] = useState(false);

  useEffect(() => {
    loadTransaction();
  }, [id, party]);

  const loadTransaction = async () => {
    if (!party || !id) return;

    setIsLoading(true);
    setError(null);

    try {
      const results = await cantonApi.query<TransactionData>(
        TemplateIds.TransactionData
      );

      const found = results.find(t => t.contractId === id);

      if (!found) {
        setError('Transaction not found');
      } else {
        setTransaction(found);
      }
    } catch (err: any) {
      console.error('Failed to load transaction:', err);
      setError(err.message || 'Failed to load transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleVerifySuccess = () => {
    loadTransaction();
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <p>Loading transaction...</p>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="container">
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">⚠️</div>
            <h2>Transaction Not Found</h2>
            <p className="text-muted">{error || 'The requested transaction could not be found.'}</p>
            <Link to="/transactions" className="btn btn-primary mt-3">
              Back to Transactions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const verification = {
    verifications: transaction.payload.verifications || [],
    assignedVerifiers: transaction.payload.assignedVerifiers || [],
  };

  const canVerify = verification.assignedVerifiers.includes(party || '');
  const hasVerified = verification.verifications.some((v) => v.verifier === party);

  return (
    <div className="container">
      <div className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/transactions" className="text-sm text-muted" style={{ textDecoration: 'none' }}>
            ← Back to Transactions
          </Link>
          <h1 className="text-xl font-bold mt-2">Transaction Details</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={() => setIsAssignVerifierModalOpen(true)}>
            Assign Verifier
          </button>
          {canVerify && !hasVerified && (
            <button className="btn btn-primary" onClick={() => setIsVerifyModalOpen(true)}>
              Verify Transaction
            </button>
          )}
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <strong>Property Information</strong>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">{transaction.payload.propertyAddress}</h2>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
              <span
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  background:
                    transaction.payload.status === 'FullyVerified'
                      ? '#c6f6d5'
                      : transaction.payload.status === 'PartiallyVerified'
                      ? '#fef3c7'
                      : transaction.payload.status === 'DisputedTransaction'
                      ? '#fed7d7'
                      : '#e2e8f0',
                  color:
                    transaction.payload.status === 'FullyVerified'
                      ? '#22543d'
                      : transaction.payload.status === 'PartiallyVerified'
                      ? '#78350f'
                      : transaction.payload.status === 'DisputedTransaction'
                      ? '#742a2a'
                      : '#4a5568',
                }}
              >
                {transaction.payload.status}
              </span>
              <span
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  background: '#bee3f8',
                  color: '#2c5282',
                }}
              >
                Trust Score: {transaction.payload.trustScore}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="text-sm text-muted">Transaction ID</label>
              <p className="font-semibold">{transaction.payload.transactionId}</p>
            </div>
            <div>
              <label className="text-sm text-muted">Sale Price</label>
              <p className="font-semibold">${Number(transaction.payload.salePrice).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm text-muted">Property Type</label>
              <p className="font-semibold">{transaction.payload.propertyType}</p>
            </div>
            <div>
              <label className="text-sm text-muted">Postal Code</label>
              <p className="font-semibold">{transaction.payload.postalCode}</p>
            </div>
            <div>
              <label className="text-sm text-muted">Transaction Date</label>
              <p className="font-semibold">{formatDate(transaction.payload.transactionDate)}</p>
            </div>
            {fromDamlOptional(transaction.payload.closingDate) && (
              <div>
                <label className="text-sm text-muted">Closing Date</label>
                <p className="font-semibold">{formatDate(fromDamlOptional(transaction.payload.closingDate)!)}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <strong>Property Details</strong>
        </div>
        <div style={{ padding: '1.5rem' }}>
          {fromDamlOptional(transaction.payload.livingAreaSqft) && (
            <div className="mb-3">
              <label className="text-sm text-muted">Living Area</label>
              <p className="font-semibold">{fromDamlOptional(transaction.payload.livingAreaSqft)} sqft</p>
            </div>
          )}
          {fromDamlOptional(transaction.payload.lotSizeSqft) && (
            <div className="mb-3">
              <label className="text-sm text-muted">Lot Size</label>
              <p className="font-semibold">{fromDamlOptional(transaction.payload.lotSizeSqft)} sqft</p>
            </div>
          )}
          {fromDamlOptional(transaction.payload.bedroomsTotal) && (
            <div className="mb-3">
              <label className="text-sm text-muted">Bedrooms</label>
              <p className="font-semibold">{fromDamlOptional(transaction.payload.bedroomsTotal)}</p>
            </div>
          )}
          {fromDamlOptional(transaction.payload.bathroomsTotal) && (
            <div className="mb-3">
              <label className="text-sm text-muted">Bathrooms</label>
              <p className="font-semibold">{fromDamlOptional(transaction.payload.bathroomsTotal)}</p>
            </div>
          )}
          {fromDamlOptional(transaction.payload.yearBuilt) && (
            <div className="mb-3">
              <label className="text-sm text-muted">Year Built</label>
              <p className="font-semibold">{fromDamlOptional(transaction.payload.yearBuilt)}</p>
            </div>
          )}
          {fromDamlOptional(transaction.payload.financingType) && (
            <div className="mb-3">
              <label className="text-sm text-muted">Financing Type</label>
              <p className="font-semibold">{fromDamlOptional(transaction.payload.financingType)}</p>
            </div>
          )}
          {fromDamlOptional(transaction.payload.daysOnMarket) && (
            <div>
              <label className="text-sm text-muted">Days on Market</label>
              <p className="font-semibold">{fromDamlOptional(transaction.payload.daysOnMarket)} days</p>
            </div>
          )}
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <strong>Submission Details</strong>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <div className="mb-3">
            <label className="text-sm text-muted">Submitter</label>
            <p className="font-semibold">{transaction.payload.submitter}</p>
          </div>
          <div className="mb-3">
            <label className="text-sm text-muted">Submitter Role</label>
            <p className="font-semibold">{transaction.payload.submitterRole}</p>
          </div>
          <div>
            <label className="text-sm text-muted">Operator</label>
            <p className="font-semibold">{transaction.payload.operator}</p>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <strong>Verification Status</strong>
          <span className="text-muted ml-2">
            ({verification.verifications.length} of {verification.assignedVerifiers.length} completed)
          </span>
        </div>
        <div style={{ padding: '1.5rem' }}>
          {verification.assignedVerifiers.length === 0 ? (
            <p className="text-muted">No verifiers assigned yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {verification.assignedVerifiers.map((verifier, index) => {
                const v = verification.verifications.find(v => v.verifier === verifier);
                const isCompleted = !!v;

                return (
                  <div
                    key={index}
                    style={{
                      padding: '1rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      background: isCompleted ? '#f7fafc' : 'white',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div className="font-semibold">{verifier}</div>
                        {v && (
                          <>
                            <div className="text-sm text-muted mt-1">
                              Role: {v.verifierRole}
                            </div>
                            <div className="text-sm mt-2">
                              <strong>Decision:</strong>{' '}
                              <span
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '4px',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  background:
                                    v.decision === 'Confirmed' || v.decision === 'ConfirmedWithNotes'
                                      ? '#c6f6d5'
                                      : '#fed7d7',
                                  color:
                                    v.decision === 'Confirmed' || v.decision === 'ConfirmedWithNotes'
                                      ? '#22543d'
                                      : '#742a2a',
                                }}
                              >
                                {v.decision}
                              </span>
                            </div>
                            {v.notes && (
                              <div className="text-sm mt-2">
                                <strong>Notes:</strong> {v.notes}
                              </div>
                            )}
                            <div className="text-sm text-muted mt-1">
                              Verified on: {formatDate(v.verifiedAt)}
                            </div>
                          </>
                        )}
                      </div>
                      <div>
                        {isCompleted ? (
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: v.decision === 'Disputed' ? '#f56565' : '#48bb78',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.25rem',
                              fontWeight: 600,
                            }}
                          >
                            {v.decision === 'Disputed' ? '✗' : '✓'}
                          </div>
                        ) : (
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              border: '2px solid #cbd5e0',
                              background: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1rem',
                              color: '#a0aec0',
                            }}
                          >
                            ?
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <VerifyTransactionModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        transaction={{
          contractId: transaction.contractId,
          transactionId: transaction.payload.transactionId,
          propertyAddress: transaction.payload.propertyAddress,
          postalCode: transaction.payload.postalCode,
          propertyType: transaction.payload.propertyType,
          salePrice: transaction.payload.salePrice.toString(),
          transactionDate: transaction.payload.transactionDate,
          closingDate: fromDamlOptional(transaction.payload.closingDate),
          submitter: transaction.payload.submitter,
          submitterRole: transaction.payload.submitterRole,
          livingAreaSqft: fromDamlOptional(transaction.payload.livingAreaSqft)?.toString() || null,
          lotSizeSqft: fromDamlOptional(transaction.payload.lotSizeSqft)?.toString() || null,
          bedroomsTotal: fromDamlOptional(transaction.payload.bedroomsTotal)?.toString() || null,
          bathroomsTotal: fromDamlOptional(transaction.payload.bathroomsTotal)?.toString() || null,
          yearBuilt: fromDamlOptional(transaction.payload.yearBuilt)?.toString() || null,
          financingType: fromDamlOptional(transaction.payload.financingType),
          daysOnMarket: fromDamlOptional(transaction.payload.daysOnMarket)?.toString() || null,
        }}
        onSuccess={handleVerifySuccess}
      />

      <AssignVerifierModal
        isOpen={isAssignVerifierModalOpen}
        onClose={() => setIsAssignVerifierModalOpen(false)}
        transactionContractId={transaction.contractId}
        onSuccess={loadTransaction}
      />
    </div>
  );
}
