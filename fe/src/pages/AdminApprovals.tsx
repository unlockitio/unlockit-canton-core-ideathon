import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cantonApi } from '../services/cantonApi';
import { useAuth } from '../context/AuthContext';
import { Contract } from '../types/canton';
import { TemplateIds } from '../utils/daml';

interface RegistrationRequestData {
  operator: string;
  user: string;
  requestedRole: { tag: string } | string;
  credentialPresentations: string[];
  requestedAt: string;
}

interface PresentationReceiptData {
  credentialId: string;
  holder: string;
  verifier: string;
  presentedAt: string;
  challenge: string;
  presentationProof: string;
}

interface VerifiableCredentialData {
  credentialId: string;
  credentialType: string[];
  issuer: string;
  issuanceDate: string;
  expirationDate: any; // Optional in Daml - [] or [value]
  subject: {
    id: string;
    claims: Array<{ _1: string; _2: string }>; // Daml Tuple2
  };
  proof: any;
  status: { tag: string } | string;
  holder: string;
  verifiers: string[];
  credentialSchema: any;
  credentialContext: string[];
}

interface CredentialDisplay {
  credentialId: string;
  type: string[];
  title: string;
  issuer: string;
  status: string;
  claims: Record<string, string>;
}

interface RegistrationRequestDisplay {
  contractId: string;
  contract: Contract<RegistrationRequestData>;
  user: string;
  userDisplayName: string;
  requestedRole: string;
  credentialCount: number;
  presentations: Contract<PresentationReceiptData>[];
  credentials: CredentialDisplay[];
  requestedAt: string;
}

export default function AdminApprovals() {
  const { party, isAuthenticated } = useAuth();
  const [requests, setRequests] = useState<RegistrationRequestDisplay[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequestDisplay | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejection, setShowRejection] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch registration requests from Canton
  useEffect(() => {
    const fetchRequests = async () => {
      if (!isAuthenticated || !party) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');

        // Query for RegistrationRequest contracts
        const registrationContracts = await cantonApi.query<RegistrationRequestData>(
          TemplateIds.RegistrationRequest
        );

        console.log('Found registration requests:', registrationContracts);

        // Query for all PresentationReceipt contracts to get credential details
        const presentationContracts = await cantonApi.query<PresentationReceiptData>(
          TemplateIds.PresentationReceipt
        );

        console.log('Found presentation receipts:', presentationContracts);

        // Query for all VerifiableCredential contracts to get full credential details
        const vcContracts = await cantonApi.query<VerifiableCredentialData>(
          TemplateIds.VerifiableCredential
        );

        console.log('Found verifiable credentials:', vcContracts);

        // Transform to display format
        const displayRequests: RegistrationRequestDisplay[] = registrationContracts.map(contract => {
          const requestedRole = typeof contract.payload.requestedRole === 'object'
            ? contract.payload.requestedRole.tag
            : contract.payload.requestedRole;

          // Extract user display name from party ID (format: "alice-9b3970be::...")
          const userDisplayName = contract.payload.user.split('::')[0].split('-')[0] || contract.payload.user;

          // Find presentation receipts that match this request's credential IDs
          const presentations = presentationContracts.filter(p =>
            contract.payload.credentialPresentations.includes(p.contractId)
          );

          // For each presentation, find the actual VerifiableCredential
          const credentials: CredentialDisplay[] = presentations.map(presentation => {
            const vc = vcContracts.find(v => v.payload.credentialId === presentation.payload.credentialId);

            if (!vc) {
              return {
                credentialId: presentation.payload.credentialId,
                type: ['Unknown'],
                title: 'Credential not found',
                issuer: 'Unknown',
                status: 'Unknown',
                claims: {}
              };
            }

            // Extract claims from Daml Tuple2 array
            const claims: Record<string, string> = {};
            if (vc.payload.subject?.claims && Array.isArray(vc.payload.subject.claims)) {
              vc.payload.subject.claims.forEach((tuple: any) => {
                claims[tuple._1] = tuple._2;
              });
            }

            // Determine title based on credential type
            let title = vc.payload.credentialType.join(', ');
            if (vc.payload.credentialType.includes('GovernmentIDCredential')) {
              title = claims.state ? `${claims.state} Driver's License` : 'Government ID';
            } else if (vc.payload.credentialType.includes('RealEstateLicenseCredential')) {
              title = 'Real Estate Agent License';
            } else if (vc.payload.credentialType.includes('RealEstateBrokerLicenseCredential')) {
              title = 'Real Estate Broker License';
            } else if (vc.payload.credentialType.includes('BrokerageAffiliationCredential')) {
              title = claims.brokerageName || 'Brokerage Affiliation';
            } else if (vc.payload.credentialType.includes('BrokerageOwnershipCredential')) {
              title = claims.brokerageName || 'Brokerage Ownership';
            } else if (vc.payload.credentialType.includes('MortgageLenderLicenseCredential')) {
              title = 'Mortgage Lender License';
            }

            // Format issuer for display
            const issuerDisplay = vc.payload.issuer.split('::')[0].split('-')[0] || vc.payload.issuer;

            // Extract status
            const status = typeof vc.payload.status === 'object'
              ? vc.payload.status.tag
              : vc.payload.status;

            return {
              credentialId: vc.payload.credentialId,
              type: vc.payload.credentialType,
              title,
              issuer: issuerDisplay,
              status,
              claims
            };
          });

          return {
            contractId: contract.contractId,
            contract: contract,
            user: contract.payload.user,
            userDisplayName: userDisplayName,
            requestedRole: requestedRole,
            credentialCount: contract.payload.credentialPresentations.length,
            presentations: presentations,
            credentials: credentials,
            requestedAt: contract.payload.requestedAt
          };
        });

        setRequests(displayRequests);
      } catch (err) {
        console.error('Error fetching registration requests:', err);
        setError('Failed to load registration requests');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [isAuthenticated, party]);

  const handleApprove = async (request: RegistrationRequestDisplay) => {
    if (!confirm(`Approve registration for ${request.userDisplayName} as ${request.requestedRole}?`)) {
      return;
    }

    setIsProcessing(true);
    try {
      // Exercise ApproveRegistration choice
      await cantonApi.exercise(
        TemplateIds.RegistrationRequest,
        request.contractId,
        'ApproveRegistration',
        {}
      );

      alert(`Approved: ${request.userDisplayName}`);
      setSelectedRequest(null);

      // Refresh the list
      const updatedRequests = requests.filter(r => r.contractId !== request.contractId);
      setRequests(updatedRequests);
    } catch (error) {
      console.error('Approval failed:', error);
      alert(`Failed to approve registration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (request: RegistrationRequestDisplay) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setIsProcessing(true);
    try {
      // Exercise RejectRegistration choice
      await cantonApi.exercise(
        TemplateIds.RegistrationRequest,
        request.contractId,
        'RejectRegistration',
        { reason: rejectionReason }
      );

      alert(`Rejected: ${request.userDisplayName}\nReason: ${rejectionReason}`);
      setShowRejection(false);
      setRejectionReason('');
      setSelectedRequest(null);

      // Refresh the list
      const updatedRequests = requests.filter(r => r.contractId !== request.contractId);
      setRequests(updatedRequests);
    } catch (error) {
      console.error('Rejection failed:', error);
      alert(`Failed to reject registration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Admin - Registration Approvals</h1>
        <p className="text-muted">Review and approve user registrations</p>
        <div className="mt-2">
          <Link to="/admin/users" className="btn btn-secondary">
            View All Users
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {isLoading ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">⏳</div>
            <p>Loading registration requests...</p>
          </div>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: selectedRequest ? '1fr 1fr' : '1fr' }}>
          <div>
            <div className="card">
              <h2 className="card-header">Pending Approvals ({requests.length})</h2>

              {requests.map((request) => (
                <div
                  key={request.contractId}
                  style={{
                    padding: '1.25rem',
                    border: '2px solid',
                    borderColor: selectedRequest?.contractId === request.contractId ? '#5850ec' : '#e2e8f0',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    cursor: 'pointer',
                    background: selectedRequest?.contractId === request.contractId ? '#f0f4ff' : 'white',
                  }}
                  onClick={() => setSelectedRequest(request)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div>
                      <div className="font-bold">{request.userDisplayName}</div>
                      <div className="text-sm text-muted">{request.user.substring(0, 20)}...</div>
                    </div>
                    <span className="badge badge-warning">Pending</span>
                  </div>

                  <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <strong>Requested Role:</strong> {request.requestedRole}
                  </div>
                  <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <strong>Credentials:</strong> {request.credentialCount}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                    {new Date(request.requestedAt).toLocaleString()}
                  </div>
                </div>
              ))}

              {requests.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">✓</div>
                <p>No pending approvals</p>
              </div>
            )}
          </div>
        </div>

          {selectedRequest && (
            <div>
              <div className="card">
                <h2 className="card-header">Review Registration</h2>

                <div style={{ background: '#f7fafc', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  <h3 className="font-semibold mb-2">User Information</h3>
                  <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                    <div><strong>User:</strong> {selectedRequest.userDisplayName}</div>
                    <div><strong>Party ID:</strong> <span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{selectedRequest.user}</span></div>
                    <div><strong>Requested Role:</strong> {selectedRequest.requestedRole}</div>
                    <div><strong>Requested At:</strong> {new Date(selectedRequest.requestedAt).toLocaleString()}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold mb-3">Presented Credentials ({selectedRequest.credentials.length})</h3>
                  {selectedRequest.credentials.map((credential, index) => (
                    <div
                      key={credential.credentialId}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span className="font-semibold">{credential.title}</span>
                        <span className="badge badge-success">✓ {credential.status}</span>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                        <div><strong>Type:</strong> {credential.type.filter(t => t !== 'VerifiableCredential').join(', ')}</div>
                        <div><strong>Issuer:</strong> {credential.issuer}</div>
                        <div><strong>Credential ID:</strong> <span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{credential.credentialId}</span></div>
                        {Object.keys(credential.claims).length > 0 && (
                          <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
                            <strong>Claims:</strong>
                            {Object.entries(credential.claims).map(([key, value]) => (
                              <div key={key} style={{ marginLeft: '1rem' }}>• {key}: {value}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {!showRejection ? (
                  <div className="grid grid-2" style={{ gap: '1rem' }}>
                    <button
                      className="btn btn-danger"
                      onClick={() => setShowRejection(true)}
                      disabled={isProcessing}
                    >
                      Reject
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => handleApprove(selectedRequest)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Approve'}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="form-group">
                      <label className="form-label">Reason for Rejection</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Provide a reason for rejecting this registration..."
                        style={{ resize: 'vertical' }}
                      />
                    </div>
                    <div className="grid grid-2" style={{ gap: '1rem' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setShowRejection(false);
                          setRejectionReason('');
                        }}
                        disabled={isProcessing}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleReject(selectedRequest)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Processing...' : 'Confirm Rejection'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
