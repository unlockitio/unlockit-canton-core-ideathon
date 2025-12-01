import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { cantonApi } from '../services/cantonApi';
import { TemplateIds } from '../utils/daml';
import VerifyTransactionModal from '../components/VerifyTransactionModal';
import type { Contract } from '../types/canton';
import type { TransactionData, PropertyType } from '../codegen/unlockit-canton-core-ideathon-0.0.1/lib/RETVN/Transaction/module';
import type { UserRole } from '../codegen/unlockit-canton-core-ideathon-0.0.1/lib/RETVN/Role/module';

// Helper to convert DAML Optional ([] or [value]) to JavaScript optional (null or value)
// Canton API sometimes returns null instead of [] for None
function fromDamlOptional<T>(opt: [] | [T] | null | undefined): T | null {
  if (!opt || !Array.isArray(opt) || opt.length === 0) {
    return null;
  }
  return opt[0];
}

// View type for displaying transaction data in the UI
interface TransactionView {
  contractId: string;
  transactionId: string;
  propertyAddress: string;
  postalCode: string;
  propertyType: PropertyType;
  salePrice: string;
  transactionDate: string;
  closingDate?: string | null;
  submitter: string;
  submitterRole: UserRole;
  livingAreaSqft?: string | null;
  lotSizeSqft?: string | null;
  bedroomsTotal?: string | null;
  bathroomsTotal?: string | null;
  yearBuilt?: string | null;
  financingType?: string | null;
  daysOnMarket?: string | null;
  trustScore: number;
  status: string;
  verifications: number;
}

export default function VerifyTransactions() {
  const { party, verificationWeight, userRole } = useAuth();
  const [pendingTransactions, setPendingTransactions] = useState<TransactionView[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionView | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPendingVerifications = async () => {
    if (!party) return;

    setIsLoading(true);
    setError(null);

    try {
      // Query all TransactionData contracts
      const results = await cantonApi.query<TransactionData>(
        TemplateIds.TransactionData
      );

      // Filter to transactions where current user is assigned as verifier but hasn't verified yet
      const pending = results
        .filter(contract => {
          const hasVerified = contract.payload.verifications.some(v => v.verifier === party);
          const isAssignedVerifier = contract.payload.assignedVerifiers.includes(party);
          return isAssignedVerifier && !hasVerified;
        })
        .map(contract => ({
          contractId: contract.contractId,
          transactionId: contract.payload.transactionId,
          propertyAddress: contract.payload.propertyAddress,
          postalCode: contract.payload.postalCode,
          propertyType: contract.payload.propertyType,
          salePrice: contract.payload.salePrice,
          transactionDate: contract.payload.transactionDate,
          closingDate: fromDamlOptional(contract.payload.closingDate),
          submitter: contract.payload.submitter,
          submitterRole: contract.payload.submitterRole,
          livingAreaSqft: fromDamlOptional(contract.payload.livingAreaSqft),
          lotSizeSqft: fromDamlOptional(contract.payload.lotSizeSqft),
          bedroomsTotal: fromDamlOptional(contract.payload.bedroomsTotal),
          bathroomsTotal: fromDamlOptional(contract.payload.bathroomsTotal),
          yearBuilt: fromDamlOptional(contract.payload.yearBuilt),
          financingType: fromDamlOptional(contract.payload.financingType),
          daysOnMarket: fromDamlOptional(contract.payload.daysOnMarket),
          trustScore: parseInt(contract.payload.trustScore, 10),
          status: contract.payload.status,
          verifications: contract.payload.verifications.length,
        }));

      setPendingTransactions(pending);
    } catch (err: any) {
      console.error('Failed to load pending verifications:', err);
      setError(err.message || 'Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPendingVerifications();
  }, [party]);

  const handleVerifyClick = (transaction: TransactionView) => {
    setSelectedTransaction(transaction);
    setIsVerifyModalOpen(true);
  };

  const handleVerifySuccess = () => {
    loadPendingVerifications();
    setIsVerifyModalOpen(false);
    setSelectedTransaction(null);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="mb-4">
          <h1 className="text-xl font-bold">Verify Transactions</h1>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Verify Transactions</h1>
        <p className="text-muted">
          Review and verify real estate transactions assigned to you
          {verificationWeight && userRole && (
            <span> • Your weight: {verificationWeight} points ({userRole})</span>
          )}
        </p>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="card">
        <h2 className="card-header">
          Pending Verifications ({pendingTransactions.length})
        </h2>

        {pendingTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✅</div>
            <p>No pending verifications</p>
            <p className="text-muted">All caught up! You have verified all transactions assigned to you.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingTransactions.map((transaction) => (
              <div
                key={transaction.contractId}
                style={{
                  padding: '1.25rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onClick={() => handleVerifyClick(transaction)}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f7fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <div className="font-semibold">{transaction.propertyAddress}</div>
                    <div className="text-sm text-muted">{transaction.transactionId}</div>
                  </div>
                  <span
                    className={`badge ${
                      transaction.status === 'Unverified'
                        ? 'badge-warning'
                        : transaction.status === 'PartiallyVerified'
                        ? 'badge-info'
                        : transaction.status === 'FullyVerified'
                        ? 'badge-success'
                        : 'badge-error'
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>

                <div className="grid grid-2" style={{ gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div><strong>Sale Price:</strong> ${Number(transaction.salePrice).toLocaleString()}</div>
                  <div><strong>Type:</strong> {transaction.propertyType}</div>
                  <div><strong>Postal Code:</strong> {transaction.postalCode}</div>
                  <div><strong>Trust Score:</strong> {transaction.trustScore}/100</div>
                  <div><strong>Verifications:</strong> {transaction.verifications}</div>
                  <div><strong>Date:</strong> {formatDate(transaction.transactionDate)}</div>
                </div>

                <div style={{ marginTop: '0.75rem' }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVerifyClick(transaction);
                    }}
                  >
                    Verify Transaction
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <VerifyTransactionModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        transaction={selectedTransaction}
        onSuccess={handleVerifySuccess}
      />
    </div>
  );
}
