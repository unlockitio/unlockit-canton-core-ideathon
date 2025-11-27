import { useState, useEffect } from 'react';
import { cantonApi } from '../services/cantonApi';
import { TemplateIds } from '../utils/daml';
import type { Contract } from '../types/canton';

interface CredentialSubject {
  id: string;
  claims: Array<{ fst: string; snd: string }>;
}

interface Proof {
  proofType: string;
  proofValue: string;
  verificationMethod: string;
  created: string;
}

interface VerifiableCredential {
  credentialId: string;
  credentialType: string[];
  issuer: string;
  issuanceDate: string;
  expirationDate?: string;
  subject: CredentialSubject;
  proof: Proof;
  status: string;
  holder: string;
  verifiers: string[];
  credentialSchema?: string;
  credentialContext: string[];
}

export default function WalletCredentials() {
  const [credentials, setCredentials] = useState<Contract<VerifiableCredential>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const result = await cantonApi.query<VerifiableCredential>(
          TemplateIds.VerifiableCredential
        );
        setCredentials(result || []);
      } catch (err) {
        console.error('Failed to fetch credentials:', err);
        setError('Failed to load credentials');
      } finally {
        setLoading(false);
      }
    };
    fetchCredentials();
  }, []);

  if (loading) return <div>Loading credentials...</div>;

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'badge-success';
      case 'suspended':
        return 'badge-warning';
      case 'revoked':
        return 'badge-error';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Wallet - Credentials</h1>
        <p className="text-muted">Your verifiable credentials</p>
      </div>

      <div className="card mb-4">
        <div className="text-muted text-sm font-semibold mb-1">Total Credentials</div>
        <div className="text-xl font-bold">{credentials.length}</div>
        <div className="text-sm text-muted">
          {credentials.filter(c => c.payload.status === 'Active').length} active
        </div>
      </div>

      {credentials.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 className="font-semibold mb-2">No Credentials Yet</h3>
          <p className="text-muted">
            You don't have any verifiable credentials in your wallet yet
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {credentials.map((credential) => (
            <div key={credential.contractId} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h3 className="font-bold">
                      {credential.payload.credentialType.join(', ')}
                    </h3>
                    <span className={`badge ${getStatusBadgeClass(credential.payload.status)}`}>
                      {credential.payload.status}
                    </span>
                  </div>
                  <div className="text-sm text-muted mb-2">
                    ID: {credential.payload.credentialId}
                  </div>
                </div>
              </div>

              <div style={{ background: '#f7fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
                  <div>
                    <div className="text-muted text-sm">Issuer</div>
                    <div className="font-semibold">{credential.payload.issuer}</div>
                  </div>
                  <div>
                    <div className="text-muted text-sm">Issued</div>
                    <div className="font-semibold">
                      {new Date(credential.payload.issuanceDate).toLocaleDateString()}
                    </div>
                  </div>
                  {credential.payload.expirationDate && (
                    <div>
                      <div className="text-muted text-sm">Expires</div>
                      <div className="font-semibold">
                        {new Date(credential.payload.expirationDate).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-muted text-sm">Verifiers</div>
                    <div className="font-semibold">
                      {credential.payload.verifiers.length || 'None'}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Claims</h4>
                {credential.payload.subject.claims.length === 0 ? (
                  <p className="text-muted text-sm">No claims</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {credential.payload.subject.claims.map((claim, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '0.75rem',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span className="font-semibold text-sm">{claim.fst}:</span>
                          <span className="text-sm">{claim.snd}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <details style={{ marginTop: '1rem' }}>
                <summary className="cursor-pointer text-sm text-primary font-semibold">
                  Show Proof Details
                </summary>
                <div style={{ marginTop: '0.75rem', padding: '1rem', background: '#f7fafc', borderRadius: '6px' }}>
                  <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <div>
                      <span className="text-muted">Type: </span>
                      <span>{credential.payload.proof.proofType}</span>
                    </div>
                    <div>
                      <span className="text-muted">Method: </span>
                      <span>{credential.payload.proof.verificationMethod}</span>
                    </div>
                    <div>
                      <span className="text-muted">Created: </span>
                      <span>{new Date(credential.payload.proof.created).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted">Value: </span>
                      <span className="font-mono text-xs break-all">
                        {credential.payload.proof.proofValue.slice(0, 64)}...
                      </span>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
