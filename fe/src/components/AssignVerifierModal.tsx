import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { cantonApi } from '../services/cantonApi';
import { TemplateIds } from '../utils/daml';
import type { Contract } from '../types/canton';
import type { UserRole } from '../codegen/unlockit-canton-core-ideathon-0.0.1/lib/RETVN/Role/module';

interface UserAccount {
  operator: string;
  user: string;
  role: UserRole;
  verificationWeight: number;
  credentialPresentations: string[];
  registeredAt: string;
  status: string;
}

interface AssignVerifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionContractId: string;
  onSuccess?: () => void;
}

export default function AssignVerifierModal({ isOpen, onClose, transactionContractId, onSuccess }: AssignVerifierModalProps) {
  const { party } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usersByRole, setUsersByRole] = useState<Map<UserRole, Contract<UserAccount>[]>>(new Map());
  const [selectedVerifiers, setSelectedVerifiers] = useState<Map<UserRole, string>>(new Map());

  useEffect(() => {
    if (isOpen) {
      fetchAvailableUsers();
    }
  }, [isOpen]);

  const fetchAvailableUsers = async () => {
    try {
      const accounts = await cantonApi.getAllUserAccounts();

      const byRole = new Map<UserRole, Contract<UserAccount>[]>();
      accounts.forEach((account) => {
        if (!account.payload || !account.payload.role) {
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
      console.error('Failed to fetch available users:', err);
    }
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
    setSelectedVerifiers(new Map());
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedVerifiers.size === 0) {
      setError('Please select at least one verifier');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!party) {
        throw new Error('User not authenticated');
      }

      for (const verifierParty of selectedVerifiers.values()) {
        await cantonApi.exercise(
          TemplateIds.TransactionData,
          transactionContractId,
          'AssignVerifier',
          { verifier: verifierParty }
        );
      }

      if (onSuccess) {
        onSuccess();
      }
      handleClose();
    } catch (error: any) {
      console.error('Failed to assign verifiers:', error);
      setError(error.message || 'Failed to assign verifiers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Assign Verifiers" size="large">
      {error && (
        <div className="alert alert-error mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4" style={{ background: '#f7fafc', padding: '1.5rem', borderRadius: '8px' }}>
          <h4 className="font-semibold mb-2">Assign Verifiers</h4>
          <p className="text-sm text-muted mb-3">
            Select one user per role to verify this transaction.
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
              <strong>Selected Verifiers:</strong> {selectedVerifiers.size}
            </div>
          )}
        </div>

        <div className="grid grid-2" style={{ gap: '1rem' }}>
          <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={isLoading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Assigning...' : 'Assign Verifiers'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
