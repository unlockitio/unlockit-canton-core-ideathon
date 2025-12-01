import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { cantonApi } from '../services/cantonApi';
import { TemplateIds } from '../utils/daml';
import type { Contract } from '../types/canton';

interface TransactionSubmissionProposal {
  operator: string;
  submitter: string;
  submitterRole: string;
  submissionRight: string;
  transactionId: string;
  propertyAddress: string;
  postalCode: string;
  propertyType: string;
  livingAreaSqft: [] | [string];
  lotSizeSqft: [] | [string];
  bedroomsTotal: [] | [string];
  bathroomsTotal: [] | [string];
  yearBuilt: [] | [string];
  salePrice: string;
  transactionDate: string;
  closingDate: [] | [string];
  financingType: [] | [string];
  daysOnMarket: [] | [string];
  proposedVerifiers: string[];
  submittedAt: string;
}

// Helper to convert DAML Optional ([] or [value]) to JavaScript optional (null or value)
// Canton API sometimes returns null instead of [] for None
function fromDamlOptional<T>(opt: [] | [T] | null | undefined): T | null {
  if (!opt || !Array.isArray(opt) || opt.length === 0) {
    return null;
  }
  return opt[0];
}

export default function AdminTransactionProposals() {
  const { party } = useAuth();
  const [proposals, setProposals] = useState<Contract<TransactionSubmissionProposal>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  useEffect(() => {
    loadProposals();
  }, [party]);

  const loadProposals = async () => {
    if (!party) return;

    setIsLoading(true);
    setError(null);

    try {
      const results = await cantonApi.query<TransactionSubmissionProposal>(
        TemplateIds.TransactionSubmissionProposal
      );
      setProposals(results);
    } catch (err: any) {
      console.error('Failed to load proposals:', err);
      setError(err.message || 'Failed to load proposals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (contractId: string) => {
    setProcessingId(contractId);
    setError(null);

    try {
      await cantonApi.exercise(
        TemplateIds.TransactionSubmissionProposal,
        contractId,
        'AcceptSubmission',
        {}
      );

      await loadProposals();
    } catch (err: any) {
      console.error('Failed to accept proposal:', err);
      setError(err.message || 'Failed to accept proposal');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (contractId: string) => {
    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    setProcessingId(contractId);
    setError(null);

    try {
      await cantonApi.exercise(
        TemplateIds.TransactionSubmissionProposal,
        contractId,
        'RejectSubmission',
        { reason: rejectionReason }
      );

      setRejectionReason('');
      setRejectingId(null);
      await loadProposals();
    } catch (err: any) {
      console.error('Failed to reject proposal:', err);
      setError(err.message || 'Failed to reject proposal');
    } finally {
      setProcessingId(null);
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

  if (isLoading) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <p>Loading transaction proposals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Transaction Proposals</h1>
        <p className="text-muted">Review and approve submitted transactions</p>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="card">
        {proposals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h2>No Pending Proposals</h2>
            <p className="text-muted">All transaction submissions have been reviewed</p>
          </div>
        ) : (
          <div>
            <div className="card-header">
              <strong>Pending Proposals</strong>
              <span className="text-muted ml-2">({proposals.length} total)</span>
            </div>

            {proposals.map((proposal) => (
              <div
                key={proposal.contractId}
                style={{
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  background: 'white',
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <h3 className="font-bold text-lg">{proposal.payload.propertyAddress}</h3>
                  <p className="text-sm text-muted">Transaction ID: {proposal.payload.transactionId}</p>
                </div>

                <div className="grid grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="text-sm text-muted">Submitted By</label>
                    <p className="font-semibold">{proposal.payload.submitter}</p>
                    <p className="text-sm text-muted">{proposal.payload.submitterRole}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted">Submitted At</label>
                    <p className="font-semibold">{formatDate(proposal.payload.submittedAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted">Sale Price</label>
                    <p className="font-semibold">${Number(proposal.payload.salePrice).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted">Property Type</label>
                    <p className="font-semibold">{proposal.payload.propertyType}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted">Postal Code</label>
                    <p className="font-semibold">{proposal.payload.postalCode}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted">Transaction Date</label>
                    <p className="font-semibold">{formatDate(proposal.payload.transactionDate)}</p>
                  </div>
                </div>

                {proposal.payload.proposedVerifiers.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="text-sm text-muted">Proposed Verifiers</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                      <div className="text-sm">
                        <strong>Submitter (auto-assigned):</strong> {proposal.payload.submitter}
                      </div>
                      {proposal.payload.proposedVerifiers.map((verifier, idx) => (
                        <div key={idx} className="text-sm">
                          <strong>Verifier {idx + 1}:</strong> {verifier}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {rejectingId === proposal.contractId ? (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff5f5', borderRadius: '8px' }}>
                    <div className="form-group">
                      <label className="form-label">Rejection Reason *</label>
                      <textarea
                        className="form-control"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Provide a reason for rejecting this proposal..."
                        rows={3}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleReject(proposal.contractId)}
                        disabled={processingId === proposal.contractId || !rejectionReason.trim()}
                      >
                        {processingId === proposal.contractId ? 'Rejecting...' : 'Confirm Rejection'}
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => {
                          setRejectingId(null);
                          setRejectionReason('');
                        }}
                        disabled={processingId === proposal.contractId}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button
                      className="btn btn-success"
                      onClick={() => handleAccept(proposal.contractId)}
                      disabled={processingId === proposal.contractId}
                    >
                      {processingId === proposal.contractId ? 'Accepting...' : 'Accept'}
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => setRejectingId(proposal.contractId)}
                      disabled={processingId === proposal.contractId}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
