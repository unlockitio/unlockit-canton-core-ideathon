import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cantonApi } from '../services/cantonApi';
import { TemplateIds } from '../utils/daml';
import type { Contract } from '../types/canton';
import SubmitTransactionModal from '../components/SubmitTransactionModal';
import VerifyTransactionModal from '../components/VerifyTransactionModal';
import type { TransactionData } from '../codegen/unlockit-canton-core-ideathon-0.0.1/lib/RETVN/Transaction/module';
import type { UserRole } from '../codegen/unlockit-canton-core-ideathon-0.0.1/lib/RETVN/Role/module';

// Helper to convert DAML Optional ([] or [value]) to JavaScript optional (null or value)
// Canton API sometimes returns null instead of [] for None
function fromDamlOptional<T>(opt: [] | [T] | null | undefined): T | null {
  if (!opt || !Array.isArray(opt) || opt.length === 0) {
    return null;
  }
  return opt[0];
}

interface UserAccount {
  operator: string;
  user: string;
  role: UserRole;
  verificationWeight: number;
  credentialPresentations: string[];
  registeredAt: string;
  status: string;
}

export default function Transactions() {
  const navigate = useNavigate();
  const { party } = useAuth();
  const [transactions, setTransactions] = useState<Contract<TransactionData>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Contract<TransactionData> | null>(null);
  const [usersByRole, setUsersByRole] = useState<Map<UserRole, Contract<UserAccount>[]>>(new Map());
  const [isAssigningVerifier, setIsAssigningVerifier] = useState(false);
  const [assigningForTransaction, setAssigningForTransaction] = useState<string | null>(null);
  const [assignDropdownState, setAssignDropdownState] = useState<Record<string, {
    show: boolean;
    selectedRole: UserRole | '';
    selectedVerifier: string;
  }>>({});

  const loadTransactions = async () => {
    if (!party) return;

    setIsLoading(true);
    setError(null);

    try {
      const results = await cantonApi.query<TransactionData>(
        TemplateIds.TransactionData
      );

      setTransactions(results);
    } catch (err: any) {
      console.error('Failed to load transactions:', err);
      setError(err.message || 'Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const accounts = await cantonApi.getAllUserAccounts();

      // Group users by role
      const byRole = new Map<UserRole, Contract<UserAccount>[]>();
      accounts.forEach((account) => {
        if (!account.payload || !account.payload.role) {
          console.warn('Account missing payload or role:', account);
          return;
        }
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
      console.error('Failed to load users:', err);
    }
  };

  useEffect(() => {
    loadTransactions();
    loadUsers();
  }, [party]);

  const handleSubmitSuccess = (transactionId: string) => {
    loadTransactions();
  };

  const handleVerifySuccess = () => {
    loadTransactions();
  };

  const handleVerifyClick = (transaction: Contract<TransactionData>) => {
    setSelectedTransaction(transaction);
    setIsVerifyModalOpen(true);
  };

  const handleAssignVerifier = async (transactionContractId: string, role: UserRole, verifierParty: string) => {
    setIsAssigningVerifier(true);
    setAssigningForTransaction(transactionContractId);
    setError(null);

    try {
      if (!verifierParty) {
        throw new Error('Please select a verifier');
      }

      await cantonApi.exercise(
        TemplateIds.TransactionData,
        transactionContractId,
        'AssignVerifier',
        {
          verifier: verifierParty,
        }
      );

      // Reload transactions after successful assignment
      await loadTransactions();
    } catch (err: any) {
      console.error('Failed to assign verifier:', err);
      setError(err.message || 'Failed to assign verifier. Please try again.');
    } finally {
      setIsAssigningVerifier(false);
      setAssigningForTransaction(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getVerificationStatus = (transaction: Contract<TransactionData>) => {
    const verifications = transaction.payload.verifications || [];
    const assignedVerifiers = transaction.payload.assignedVerifiers || [];

    return {
      total: assignedVerifiers.length,
      completed: verifications.length,
      verifications: verifications,
    };
  };

  const getUnassignedRoles = (transaction: Contract<TransactionData>): UserRole[] => {
    const assignedVerifiers = transaction.payload.assignedVerifiers || [];
    const unassignedRoles: UserRole[] = [];

    // Check which roles don't have a verifier assigned yet
    Array.from(usersByRole.keys()).forEach((role) => {
      const roleUsers = usersByRole.get(role) || [];
      const hasAssignedUser = roleUsers.some((user) =>
        assignedVerifiers.includes(user.payload.user)
      );
      if (!hasAssignedUser) {
        unassignedRoles.push(role);
      }
    });

    return unassignedRoles;
  };

  return (
    <div className="container">
      <div className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-xl font-bold">Transactions</h1>
          <p className="text-muted">View and manage real estate transactions</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsSubmitModalOpen(true)}>
          + Submit New Transaction
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="card">
        {isLoading ? (
          <div className="empty-state">
            <div className="empty-state-icon">⏳</div>
            <p>Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h2>No Transactions Yet</h2>
            <p className="text-muted">Submit your first transaction to get started</p>
            <button className="btn btn-primary mt-3" onClick={() => setIsSubmitModalOpen(true)}>
              Submit Transaction
            </button>
          </div>
        ) : (
          <div>
            <div className="card-header">
              <strong>All Transactions</strong>
              <span className="text-muted ml-2">({transactions.length} total)</span>
            </div>

            {transactions.map((transaction) => {
              const verification = getVerificationStatus(transaction);
              const unassignedRoles = getUnassignedRoles(transaction);

              const dropdownState = assignDropdownState[transaction.contractId] || {
                show: false,
                selectedRole: '',
                selectedVerifier: ''
              };

              const setDropdownState = (updates: Partial<typeof dropdownState>) => {
                setAssignDropdownState(prev => ({
                  ...prev,
                  [transaction.contractId]: { ...dropdownState, ...updates }
                }));
              };

              const canVerify = transaction.payload.assignedVerifiers.includes(party || '');
              const hasVerified = verification.verifications.some((v) => v.verifier === party);

              return (
                <div
                  key={transaction.contractId}
                  style={{
                    padding: '1.25rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    background: 'white',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div
                      style={{ flex: 1, cursor: 'pointer' }}
                      onClick={() => navigate(`/transactions/${transaction.contractId}`)}
                    >
                      <div className="font-semibold" style={{ fontSize: '1.1rem' }}>
                        {transaction.payload.propertyAddress}
                      </div>
                      <div className="text-sm text-muted">
                        {transaction.payload.transactionId}
                      </div>
                      <div style={{ marginTop: '0.25rem' }}>
                        <span
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
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
                            marginLeft: '0.5rem',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: '#bee3f8',
                            color: '#2c5282',
                          }}
                        >
                          Trust Score: {transaction.payload.trustScore}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexDirection: 'column' }}>
                      {verification.total > 0 && (
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          {Array.from({ length: verification.total }).map((_, i) => {
                            const v = verification.verifications[i];
                            const isConfirmed = v && (v.decision === 'Confirmed' || v.decision === 'ConfirmedWithNotes');
                            const isDisputed = v && v.decision === 'Disputed';

                            return (
                              <div
                                key={i}
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  border: `2px solid ${
                                    isConfirmed ? '#48bb78' : isDisputed ? '#f56565' : '#cbd5e0'
                                  }`,
                                  background: isConfirmed ? '#48bb78' : isDisputed ? '#f56565' : 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  color: v ? 'white' : '#a0aec0',
                                }}
                                title={
                                  v
                                    ? `${v.verifierRole}: ${v.decision}`
                                    : 'Pending verification'
                                }
                              >
                                {isConfirmed ? '✓' : isDisputed ? '✗' : '?'}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {canVerify && !hasVerified && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleVerifyClick(transaction)}
                            style={{ minWidth: '80px' }}
                          >
                            Verify
                          </button>
                        )}

                        {unassignedRoles.length > 0 && (
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setDropdownState({ show: !dropdownState.show })}
                            disabled={isAssigningVerifier && assigningForTransaction === transaction.contractId}
                            style={{ minWidth: '120px' }}
                          >
                            {isAssigningVerifier && assigningForTransaction === transaction.contractId
                              ? 'Assigning...'
                              : '+ Assign Verifier'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {dropdownState.show && unassignedRoles.length > 0 && (
                    <div
                      style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        background: '#f7fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <div className="form-group">
                        <label className="form-label">Select Role</label>
                        <select
                          className="form-select"
                          value={dropdownState.selectedRole}
                          onChange={(e) => {
                            setDropdownState({
                              selectedRole: e.target.value as UserRole,
                              selectedVerifier: ''
                            });
                          }}
                        >
                          <option value="">-- Select a role --</option>
                          {unassignedRoles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </div>

                      {dropdownState.selectedRole && (
                        <div className="form-group">
                          <label className="form-label">Select Verifier</label>
                          <select
                            className="form-select"
                            value={dropdownState.selectedVerifier}
                            onChange={(e) => setDropdownState({ selectedVerifier: e.target.value })}
                          >
                            <option value="">-- Select a verifier --</option>
                            {(usersByRole.get(dropdownState.selectedRole as UserRole) || []).map((user) => (
                              <option key={user.contractId} value={user.payload.user}>
                                {user.payload.user} (Weight: {user.payload.verificationWeight})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {dropdownState.selectedVerifier && (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() =>
                            handleAssignVerifier(
                              transaction.contractId,
                              dropdownState.selectedRole as UserRole,
                              dropdownState.selectedVerifier
                            ).then(() => {
                              setDropdownState({ show: false, selectedRole: '', selectedVerifier: '' });
                            })
                          }
                          disabled={isAssigningVerifier}
                        >
                          {isAssigningVerifier ? 'Assigning...' : 'Assign Verifier'}
                        </button>
                      )}
                    </div>
                  )}

                  <div className="grid grid-2" style={{ gap: '0.75rem', fontSize: '0.875rem', marginTop: '0.75rem' }}>
                    <div>
                      <strong>Sale Price:</strong>{' '}
                      ${Number(transaction.payload.salePrice).toLocaleString()}
                    </div>
                    <div>
                      <strong>Type:</strong> {transaction.payload.propertyType}
                    </div>
                    <div>
                      <strong>Postal Code:</strong> {transaction.payload.postalCode}
                    </div>
                    <div>
                      <strong>Date:</strong> {formatDate(transaction.payload.transactionDate)}
                    </div>
                    <div>
                      <strong>Submitter:</strong> {transaction.payload.submitterRole}
                    </div>
                    <div>
                      <strong>Verifications:</strong> {verification.completed}/{verification.total}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <SubmitTransactionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSuccess={handleSubmitSuccess}
      />

      <VerifyTransactionModal
        isOpen={isVerifyModalOpen}
        onClose={() => {
          setIsVerifyModalOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction ? {
          contractId: selectedTransaction.contractId,
          transactionId: selectedTransaction.payload.transactionId,
          propertyAddress: selectedTransaction.payload.propertyAddress,
          postalCode: selectedTransaction.payload.postalCode,
          propertyType: selectedTransaction.payload.propertyType,
          salePrice: selectedTransaction.payload.salePrice.toString(),
          transactionDate: selectedTransaction.payload.transactionDate,
          closingDate: fromDamlOptional(selectedTransaction.payload.closingDate),
          submitter: selectedTransaction.payload.submitter,
          submitterRole: selectedTransaction.payload.submitterRole,
          livingAreaSqft: fromDamlOptional(selectedTransaction.payload.livingAreaSqft)?.toString() || null,
          lotSizeSqft: fromDamlOptional(selectedTransaction.payload.lotSizeSqft)?.toString() || null,
          bedroomsTotal: fromDamlOptional(selectedTransaction.payload.bedroomsTotal)?.toString() || null,
          bathroomsTotal: fromDamlOptional(selectedTransaction.payload.bathroomsTotal)?.toString() || null,
          yearBuilt: fromDamlOptional(selectedTransaction.payload.yearBuilt)?.toString() || null,
          financingType: fromDamlOptional(selectedTransaction.payload.financingType),
          daysOnMarket: fromDamlOptional(selectedTransaction.payload.daysOnMarket)?.toString() || null,
        } : null}
        onSuccess={handleVerifySuccess}
      />
    </div>
  );
}
