import { useState, useEffect } from 'react';
import { cantonApi } from '../services/cantonApi';
import { TemplateIds } from '../utils/daml';
import type { Contract } from '../types/canton';

interface CredentialSubject {
  id: string;
  claims: Array<{ _1: string; _2: string }>;
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

interface CredentialDisplay {
  contractId: string;
  credentialId: string;
  type: string[];
  title: string;
  icon: string;
  issuer: string;
  claims: Record<string, string>;
  expirationDate?: string;
  status: string;
}

const formatPartyForDisplay = (partyId: string): string => {
  const hintPart = partyId.split('::')[0];
  const baseName = hintPart.split('-')[0];
  return baseName
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toUpperCase();
};

export default function WalletCredentials() {
  const [credentials, setCredentials] = useState<CredentialDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const result = await cantonApi.query<VerifiableCredential>(
          TemplateIds.VerifiableCredential
        );

        if (result && result.length > 0) {
          const displayCredentials: CredentialDisplay[] = result.map((vc) => {
            const claims: Record<string, string> = {};

            if (vc.payload.subject.claims && Array.isArray(vc.payload.subject.claims)) {
              vc.payload.subject.claims.forEach((tuple: any) => {
                claims[tuple._1] = tuple._2;
              });
            }

            let icon = '📜';
            let title = vc.payload.credentialType
              .filter(t => t !== 'VerifiableCredential')
              .join(', ') || 'Credential';

            if (vc.payload.credentialType.includes('GovernmentIDCredential')) {
              icon = '🪪';
              title = claims.state ? `${claims.state} Driver's License` : 'Government ID';
            } else if (vc.payload.credentialType.includes('RealEstateLicenseCredential')) {
              icon = '🏠';
              title = 'Real Estate License';
            } else if (vc.payload.credentialType.includes('RealEstateBrokerLicenseCredential')) {
              icon = '🏠';
              title = 'Real Estate Broker License';
            } else if (vc.payload.credentialType.includes('BrokerageAffiliationCredential')) {
              icon = '🏢';
              title = claims.brokerageName || 'Brokerage Affiliation';
            } else if (vc.payload.credentialType.includes('BrokerageOwnershipCredential')) {
              icon = '🏢';
              title = claims.brokerageName || 'Brokerage Ownership';
            } else if (vc.payload.credentialType.includes('MortgageLenderLicenseCredential')) {
              icon = '🏦';
              title = 'Mortgage Lender License';
            }

            const expirationDate = Array.isArray(vc.payload.expirationDate) && vc.payload.expirationDate.length > 0
              ? vc.payload.expirationDate[0]
              : undefined;

            return {
              contractId: vc.contractId,
              credentialId: vc.payload.credentialId,
              type: vc.payload.credentialType,
              title,
              icon,
              issuer: formatPartyForDisplay(vc.payload.issuer),
              claims,
              expirationDate,
              status: vc.payload.status,
            };
          });

          setCredentials(displayCredentials);
        } else {
          setCredentials([]);
        }
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
          {credentials.filter(c => c.status === 'Active').length} active
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {credentials.map((credential) => {
            const claimsDisplay = Object.entries(credential.claims)
              .slice(0, 3)
              .map(([key, value]) => `${key}: ${value}`);

            return (
              <div
                key={credential.contractId}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                  <span className={`badge ${getStatusBadgeClass(credential.status)}`}>
                    {credential.status}
                  </span>
                </div>

                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                  {credential.icon}
                </div>

                <h3 className="font-bold mb-2">{credential.title}</h3>

                <div className="text-sm text-muted mb-2">
                  Issuer: {credential.issuer}
                </div>

                {claimsDisplay.map((claim, i) => (
                  <div key={i} className="text-sm text-muted">
                    {claim}
                  </div>
                ))}

                {credential.expirationDate && (
                  <div className="text-sm text-muted mt-2">
                    Expires: {new Date(credential.expirationDate).toLocaleDateString()}
                  </div>
                )}

                <details style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                  <summary className="cursor-pointer text-sm text-primary font-semibold">
                    View Details
                  </summary>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
                    <div className="text-muted text-sm mb-1">ID: {credential.credentialId}</div>

                    {Object.keys(credential.claims).length > 3 && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <div className="font-semibold mb-1">All Claims:</div>
                        {Object.entries(credential.claims).map(([key, value], idx) => (
                          <div key={idx} className="text-sm" style={{ marginBottom: '0.25rem' }}>
                            <span className="font-semibold">{key}:</span> {value}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
