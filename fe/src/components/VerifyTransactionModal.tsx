import React, { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { cantonApi } from '../services/cantonApi';
import { TemplateIds, isoStringToDamlTime } from '../utils/daml';
import type { TransactionData, PropertyType, VerificationDecision } from '../codegen/unlockit-canton-core-ideathon-0.0.1/lib/RETVN/Transaction/module';
import type { UserRole } from '../codegen/unlockit-canton-core-ideathon-0.0.1/lib/RETVN/Role/module';

// View type for displaying transaction data in the UI (with serialized DAML types)
// Note: DAML Int/Numeric types are serialized as strings for precision
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
  livingAreaSqft?: string | null;  // DAML Int serialized as string
  lotSizeSqft?: string | null;      // DAML Int serialized as string
  bedroomsTotal?: string | null;    // DAML Int serialized as string
  bathroomsTotal?: string | null;   // DAML Int serialized as string
  yearBuilt?: string | null;        // DAML Int serialized as string
  financingType?: string | null;
  daysOnMarket?: string | null;     // DAML Int serialized as string
}

interface VerifyTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionView | null;
  onSuccess?: () => void;
}

export default function VerifyTransactionModal({ isOpen, onClose, transaction, onSuccess }: VerifyTransactionModalProps) {
  const { party, verificationWeight, userRole, userAccountContractId } = useAuth();
  const [verificationDecision, setVerificationDecision] = useState<VerificationDecision>('Confirmed');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setVerificationDecision('Confirmed');
    setNotes('');
    setError(null);
    onClose();
  };

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!party || !userAccountContractId) {
        throw new Error('User not authenticated or account not found');
      }

      if (!transaction) {
        throw new Error('No transaction selected');
      }

      // Query for the submitter's UserAccount contract ID using backend API
      // (Backend queries as operator, so it can see all UserAccounts)
      console.log('[VerifyTransactionModal] Looking for submitter UserAccount for party:', transaction.submitter);
      const userAccounts = await cantonApi.getAllUserAccounts();
      console.log('[VerifyTransactionModal] UserAccounts:', JSON.stringify(userAccounts, null, 2));
      const submitterAccount = userAccounts.find((acc: any) => acc.payload.user === transaction.submitter);
      
      if (!submitterAccount) {
        throw new Error(`Could not find UserAccount for submitter: ${transaction.submitter}`);
      }

      console.log('[VerifyTransactionModal] Found submitter account:', submitterAccount.contractId);

      // Get operator party from the submitter's account
      const operatorParty = submitterAccount.payload.operator;
      console.log('[VerifyTransactionModal] Using operator party:', operatorParty);

      // Exercise with both verifier and operator as authorizers (choice requires both controllers)
      await cantonApi.exerciseWithParties(
        TemplateIds.TransactionData,
        transaction.contractId,
        'SubmitVerification',
        {
          verifier: party,
          verifierAccount: userAccountContractId,
          submitterAccount: submitterAccount.contractId,
          decision: verificationDecision,
          notes: notes.trim() === '' ? null : notes,
          verifiedAt: isoStringToDamlTime(new Date().toISOString()),
        },
        [party, operatorParty]  // Both verifier and operator must authorize
      );

      if (onSuccess) {
        onSuccess();
      }
      handleClose();
    } catch (error: any) {
      console.error('Verification failed:', error);
      setError(error.message || 'Failed to submit verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!transaction) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Verify Transaction" size="large">
      {error && (
        <div className="alert alert-error mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ background: '#f7fafc', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
        <h3 className="font-semibold mb-2">Property Information</h3>
        <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
          <div><strong>Transaction ID:</strong> {transaction.transactionId}</div>
          <div><strong>Address:</strong> {transaction.propertyAddress}</div>
          <div><strong>Postal Code:</strong> {transaction.postalCode}</div>
          <div><strong>Type:</strong> {transaction.propertyType}</div>
          {transaction.livingAreaSqft && (
            <div><strong>Living Area:</strong> {Number(transaction.livingAreaSqft).toLocaleString()} sqft</div>
          )}
          {transaction.lotSizeSqft && (
            <div><strong>Lot Size:</strong> {Number(transaction.lotSizeSqft).toLocaleString()} sqft</div>
          )}
          {transaction.bedroomsTotal && (
            <div><strong>Bedrooms:</strong> {transaction.bedroomsTotal}</div>
          )}
          {transaction.bathroomsTotal && (
            <div><strong>Bathrooms:</strong> {transaction.bathroomsTotal}</div>
          )}
          {transaction.yearBuilt && (
            <div><strong>Year Built:</strong> {transaction.yearBuilt}</div>
          )}
        </div>

        <h3 className="font-semibold mb-2 mt-3">Transaction Details</h3>
        <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
          <div><strong>Sale Price:</strong> ${Number(transaction.salePrice).toLocaleString()}</div>
          <div><strong>Transaction Date:</strong> {transaction.transactionDate}</div>
          {transaction.closingDate && (
            <div><strong>Closing Date:</strong> {transaction.closingDate}</div>
          )}
          {transaction.financingType && (
            <div><strong>Financing Type:</strong> {transaction.financingType}</div>
          )}
          {transaction.daysOnMarket && (
            <div><strong>Days on Market:</strong> {transaction.daysOnMarket}</div>
          )}
          <div><strong>Submitted By:</strong> {transaction.submitter}</div>
          <div><strong>Submitter Role:</strong> {transaction.submitterRole}</div>
        </div>
      </div>

      <form onSubmit={handleSubmitVerification}>
        <div className="form-group">
          <label className="form-label">Verification Decision</label>
          <select
            className="form-select"
            value={verificationDecision}
            onChange={(e) => setVerificationDecision(e.target.value as VerificationDecision)}
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
          <strong>Your Verification Weight:</strong> {verificationWeight} points ({userRole})
          <br />
          Your verification will contribute to the overall trust score of this transaction.
        </div>

        <button type="submit" className="btn btn-success btn-block" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting Verification...' : 'Submit Verification'}
        </button>
      </form>
    </Modal>
  );
}
