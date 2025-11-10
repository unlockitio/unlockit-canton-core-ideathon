import React, { useState } from 'react';

interface Transaction {
  id: string;
  propertyAddress: string;
  postalCode: string;
  propertyType: string;
  salePrice: number;
  transactionDate: string;
  submitter: string;
  submitterRole: string;
  trustScore: number;
  status: string;
  verifications: number;
  livingAreaSqft?: number;
  bedroomsTotal?: number;
  bathroomsTotal?: number;
  yearBuilt?: number;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-2024-001',
    propertyAddress: '123 Main St, San Francisco, CA',
    postalCode: '94102',
    propertyType: 'Single Family',
    salePrice: 850000,
    transactionDate: '2024-12-15',
    submitter: 'Maria Rodriguez',
    submitterRole: 'Realtor Agent',
    trustScore: 8,
    status: 'Unverified',
    verifications: 0,
    livingAreaSqft: 1500,
    bedroomsTotal: 3,
    bathroomsTotal: 2,
    yearBuilt: 1995,
  },
  {
    id: 'TXN-2024-002',
    propertyAddress: '456 Oak Ave, Oakland, CA',
    postalCode: '94601',
    propertyType: 'Condo',
    salePrice: 620000,
    transactionDate: '2024-12-14',
    submitter: 'John Doe',
    submitterRole: 'Realtor Agent',
    trustScore: 16,
    status: 'Partially Verified',
    verifications: 1,
    livingAreaSqft: 1200,
    bedroomsTotal: 2,
    bathroomsTotal: 2,
  },
];

export default function VerifyTransactions() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [verificationDecision, setVerificationDecision] = useState('Confirmed');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Verification submitted successfully!');
      setSelectedTransaction(null);
      setNotes('');
      setVerificationDecision('Confirmed');
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Verify Transactions</h1>
        <p className="text-muted">Review and verify real estate transactions</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: selectedTransaction ? '1fr 1fr' : '1fr' }}>
        <div>
          <div className="card">
            <h2 className="card-header">Pending Verifications</h2>

            {MOCK_TRANSACTIONS.map((transaction) => (
              <div
                key={transaction.id}
                style={{
                  padding: '1.25rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  cursor: 'pointer',
                  background: selectedTransaction?.id === transaction.id ? '#f0f4ff' : 'white',
                }}
                onClick={() => setSelectedTransaction(transaction)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <div className="font-semibold">{transaction.propertyAddress}</div>
                    <div className="text-sm text-muted">{transaction.id}</div>
                  </div>
                  <span
                    className={`badge ${
                      transaction.status === 'Unverified'
                        ? 'badge-warning'
                        : transaction.status === 'Partially Verified'
                        ? 'badge-info'
                        : 'badge-success'
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>

                <div className="grid grid-2" style={{ gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div><strong>Sale Price:</strong> ${transaction.salePrice.toLocaleString()}</div>
                  <div><strong>Type:</strong> {transaction.propertyType}</div>
                  <div><strong>Submitter:</strong> {transaction.submitter}</div>
                  <div><strong>Trust Score:</strong> {transaction.trustScore}/100</div>
                  <div><strong>Verifications:</strong> {transaction.verifications}</div>
                  <div><strong>Date:</strong> {transaction.transactionDate}</div>
                </div>
              </div>
            ))}

            {MOCK_TRANSACTIONS.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <p>No pending verifications</p>
              </div>
            )}
          </div>
        </div>

        {selectedTransaction && (
          <div>
            <div className="card">
              <h2 className="card-header">Transaction Details</h2>

              <div style={{ background: '#f7fafc', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <h3 className="font-semibold mb-2">Property Information</h3>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                  <div><strong>Address:</strong> {selectedTransaction.propertyAddress}</div>
                  <div><strong>Postal Code:</strong> {selectedTransaction.postalCode}</div>
                  <div><strong>Type:</strong> {selectedTransaction.propertyType}</div>
                  {selectedTransaction.livingAreaSqft && (
                    <div><strong>Living Area:</strong> {selectedTransaction.livingAreaSqft} sqft</div>
                  )}
                  {selectedTransaction.bedroomsTotal && (
                    <div><strong>Bedrooms:</strong> {selectedTransaction.bedroomsTotal}</div>
                  )}
                  {selectedTransaction.bathroomsTotal && (
                    <div><strong>Bathrooms:</strong> {selectedTransaction.bathroomsTotal}</div>
                  )}
                  {selectedTransaction.yearBuilt && (
                    <div><strong>Year Built:</strong> {selectedTransaction.yearBuilt}</div>
                  )}
                </div>

                <h3 className="font-semibold mb-2 mt-3">Transaction Details</h3>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                  <div><strong>Sale Price:</strong> ${selectedTransaction.salePrice.toLocaleString()}</div>
                  <div><strong>Transaction Date:</strong> {selectedTransaction.transactionDate}</div>
                  <div><strong>Submitted By:</strong> {selectedTransaction.submitter} ({selectedTransaction.submitterRole})</div>
                  <div><strong>Current Trust Score:</strong> {selectedTransaction.trustScore}/100</div>
                  <div><strong>Status:</strong> {selectedTransaction.status}</div>
                </div>
              </div>

              <form onSubmit={handleSubmitVerification}>
                <div className="form-group">
                  <label className="form-label">Verification Decision</label>
                  <select
                    className="form-select"
                    value={verificationDecision}
                    onChange={(e) => setVerificationDecision(e.target.value)}
                    required
                  >
                    <option value="Confirmed">Confirmed - All data accurate</option>
                    <option value="ConfirmedWithNotes">Confirmed with Notes - Accurate but with context</option>
                    <option value="Disputed">Disputed - Data is incorrect</option>
                    <option value="RequestClarification">Request Clarification - Need more info</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Notes (Optional)</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional context or clarification..."
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div className="alert alert-info mb-3">
                  <strong>Your Verification Weight:</strong> 8 points (Realtor Agent)
                  <br />
                  Your verification will contribute to the overall trust score of this transaction.
                </div>

                <button type="submit" className="btn btn-success btn-block" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting Verification...' : 'Submit Verification'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
