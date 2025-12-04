import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cantonApi } from '../services/cantonApi';
import { TemplateIds } from '../utils/daml';
import type { Contract } from '../types/canton';
import type { TransactionData } from '../codegen/unlockit-canton-core-ideathon-0.0.1/lib/RETVN/Transaction/module';
import VerifyTransactionModal from '../components/VerifyTransactionModal';
import AssignVerifierModal from '../components/AssignVerifierModal';

// Helper to handle Canton JSON API Optional values
// Canton returns Optional as either null or the direct value (not wrapped in an array)
// However, TypeScript codegen types still declare them as [] | [T], so we handle both formats
function fromDamlOptional<T>(opt: [] | [T] | T | null | undefined): T | null {
  if (opt === null || opt === undefined) {
    return null;
  }
  if (Array.isArray(opt)) {
    return opt.length > 0 ? opt[0] : null;
  }
  return opt;
}

// Helper to get role-specific SVG icon
function getRoleIcon(role: string | null | undefined) {
  const iconColor = '#5850ec'; // Purple color like RETVN title

  if (!role) {
    // Question mark for unknown role
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    );
  }

  switch (role) {
    case 'RealtorAgent':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      );
    case 'PrivateCitizen':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      );
    case 'RealtorBroker':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
          <path d="M9 22v-6h6v6"/>
          <line x1="8" y1="6" x2="16" y2="6"/>
          <line x1="8" y1="10" x2="16" y2="10"/>
        </svg>
      );
    case 'RealtorMaster':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      );
    case 'NotaryPublic':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
          <path d="M3 19h18M5 19V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14"/>
          <path d="M9 3v16"/>
          <circle cx="12" cy="11" r="2" fill={iconColor}/>
        </svg>
      );
    case 'TaxAuthority':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          <line x1="7" y1="11" x2="7" y2="11.01"/>
          <line x1="12" y1="11" x2="12" y2="11.01"/>
          <line x1="17" y1="11" x2="17" y2="11.01"/>
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      );
  }
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {fromDamlOptional(transaction.payload.livingAreaSqft) && (
              <div>
                <label className="text-sm text-muted">Living Area</label>
                <p className="font-semibold">{fromDamlOptional(transaction.payload.livingAreaSqft)} sqft</p>
              </div>
            )}
            {fromDamlOptional(transaction.payload.lotSizeSqft) && (
              <div>
                <label className="text-sm text-muted">Lot Size</label>
                <p className="font-semibold">{fromDamlOptional(transaction.payload.lotSizeSqft)} sqft</p>
              </div>
            )}
            {fromDamlOptional(transaction.payload.bedroomsTotal) && (
              <div>
                <label className="text-sm text-muted">Bedrooms</label>
                <p className="font-semibold">{fromDamlOptional(transaction.payload.bedroomsTotal)}</p>
              </div>
            )}
            {fromDamlOptional(transaction.payload.bathroomsTotal) && (
              <div>
                <label className="text-sm text-muted">Bathrooms</label>
                <p className="font-semibold">{fromDamlOptional(transaction.payload.bathroomsTotal)}</p>
              </div>
            )}
            {fromDamlOptional(transaction.payload.yearBuilt) && (
              <div>
                <label className="text-sm text-muted">Year Built</label>
                <p className="font-semibold">{fromDamlOptional(transaction.payload.yearBuilt)}</p>
              </div>
            )}
            {fromDamlOptional(transaction.payload.financingType) && (
              <div>
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
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <strong>Submission Details</strong>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div>
              <label className="text-sm text-muted">Submitter</label>
              <p className="font-semibold">{transaction.payload.submitter.split(':')[0]}</p>
            </div>
            <div>
              <label className="text-sm text-muted">Submitter Role</label>
              <p className="font-semibold">{transaction.payload.submitterRole}</p>
            </div>
            <div>
              <label className="text-sm text-muted">Operator</label>
              <p className="font-semibold">{transaction.payload.operator.split(':')[0]}</p>
            </div>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
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
                        <div className="font-semibold">{verifier.split(':')[0]}</div>
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
                        <div
                          title={isCompleted && v ? `${v.verifierRole} - ${v.verifier.split(':')[0]}` : `${verifier.split(':')[0]} (pending)`}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: `3px solid ${
                              isCompleted && v
                                ? v.decision === 'Disputed'
                                  ? '#f56565'
                                  : '#48bb78'
                                : '#cbd5e0'
                            }`,
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'help',
                          }}
                        >
                          {getRoleIcon(isCompleted && v ? v.verifierRole : null)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add Verifier Card */}
              <div
                onClick={() => setIsAssignVerifierModalOpen(true)}
                title="Assign new verifier"
                style={{
                  padding: '1rem',
                  border: '2px dashed #cbd5e0',
                  borderRadius: '8px',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  color: '#5850ec',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minHeight: '100px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#5850ec';
                  e.currentTarget.style.background = '#f7fafc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e0';
                  e.currentTarget.style.background = 'white';
                }}
              >
                +
              </div>
            </div>
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
