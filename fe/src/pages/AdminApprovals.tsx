import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface RegistrationRequest {
  id: string;
  user: string;
  requestedRole: string;
  credentials: Array<{
    type: string;
    title: string;
    issuer: string;
    status: string;
  }>;
  requestedAt: string;
}

const MOCK_REQUESTS: RegistrationRequest[] = [
  {
    id: 'REG-001',
    user: 'Maria Rodriguez',
    requestedRole: 'Realtor Agent',
    credentials: [
      {
        type: 'GovernmentID',
        title: 'California Driver\'s License',
        issuer: 'California DMV',
        status: 'Valid',
      },
      {
        type: 'RealEstateLicense',
        title: 'Real Estate Agent License',
        issuer: 'CA Dept of Real Estate',
        status: 'Valid',
      },
      {
        type: 'BrokerageAffiliation',
        title: 'Keller Williams Affiliation',
        issuer: 'Keller Williams',
        status: 'Valid',
      },
    ],
    requestedAt: '2024-12-15T10:30:00Z',
  },
  {
    id: 'REG-002',
    user: 'John Smith',
    requestedRole: 'Private Citizen',
    credentials: [
      {
        type: 'GovernmentID',
        title: 'California Driver\'s License',
        issuer: 'California DMV',
        status: 'Valid',
      },
    ],
    requestedAt: '2024-12-15T09:15:00Z',
  },
];

export default function AdminApprovals() {
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejection, setShowRejection] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async (request: RegistrationRequest) => {
    if (!confirm(`Approve registration for ${request.user} as ${request.requestedRole}?`)) {
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Approved: ${request.user}`);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (request: RegistrationRequest) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Rejected: ${request.user}\nReason: ${rejectionReason}`);
      setShowRejection(false);
      setRejectionReason('');
      setSelectedRequest(null);
    } catch (error) {
      console.error('Rejection failed:', error);
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

      <div className="grid" style={{ gridTemplateColumns: selectedRequest ? '1fr 1fr' : '1fr' }}>
        <div>
          <div className="card">
            <h2 className="card-header">Pending Approvals ({MOCK_REQUESTS.length})</h2>

            {MOCK_REQUESTS.map((request) => (
              <div
                key={request.id}
                style={{
                  padding: '1.25rem',
                  border: '2px solid',
                  borderColor: selectedRequest?.id === request.id ? '#5850ec' : '#e2e8f0',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  cursor: 'pointer',
                  background: selectedRequest?.id === request.id ? '#f0f4ff' : 'white',
                }}
                onClick={() => setSelectedRequest(request)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <div className="font-bold">{request.user}</div>
                    <div className="text-sm text-muted">{request.id}</div>
                  </div>
                  <span className="badge badge-warning">Pending</span>
                </div>

                <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  <strong>Requested Role:</strong> {request.requestedRole}
                </div>
                <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  <strong>Credentials:</strong> {request.credentials.length}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                  {new Date(request.requestedAt).toLocaleString()}
                </div>
              </div>
            ))}

            {MOCK_REQUESTS.length === 0 && (
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
                  <div><strong>User:</strong> {selectedRequest.user}</div>
                  <div><strong>Requested Role:</strong> {selectedRequest.requestedRole}</div>
                  <div><strong>Request ID:</strong> {selectedRequest.id}</div>
                  <div><strong>Requested At:</strong> {new Date(selectedRequest.requestedAt).toLocaleString()}</div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-3">Presented Credentials</h3>
                {selectedRequest.credentials.map((credential, index) => (
                  <div
                    key={index}
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
                      <div>Type: {credential.type}</div>
                      <div>Issuer: {credential.issuer}</div>
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
    </div>
  );
}
