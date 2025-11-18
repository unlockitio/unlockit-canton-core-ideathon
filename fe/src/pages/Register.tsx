import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import { cantonApi } from '../services/cantonApi';
import type { Contract } from '../types/canton';

// Import DAML codegen types from installed package
import * as W3C_VC from '@daml.js/unlockit-canton-core-ideathon-0.0.1/lib/W3C/VC';
import * as RETVN_Role from '@daml.js/unlockit-canton-core-ideathon-0.0.1/lib/RETVN/Role';

// W3C VC-based credential interface for display
interface CredentialDisplay {
  contractId: string;
  credentialId: string;
  type: string[];
  title: string;
  icon: string;
  issuer: string;
  issuedTo: string;
  claims: Record<string, string>;
  expirationDate?: string;
  status: W3C_VC.CredentialStatus;
  required: boolean;
}

// Mock W3C VCs with realistic structure - will be replaced by ledger queries
const MOCK_W3C_CREDENTIALS: CredentialDisplay[] = [
  {
    contractId: 'mock-contract-gov-id',
    credentialId: 'urn:uuid:ca-dmv-dl-d1234567',
    type: ['VerifiableCredential', 'GovernmentIDCredential'],
    title: 'California Driver\'s License',
    icon: '🪪',
    issuer: 'CA_DMV',
    issuedTo: 'did:example:holder',
    claims: {
      licenseNumber: 'D1234567',
      licenseClass: 'C',
      state: 'California',
      issueDate: '2020-12-15'
    },
    expirationDate: '2026-12-15',
    status: 'Active',
    required: true,
  },
  {
    contractId: 'mock-contract-re-license',
    credentialId: 'urn:uuid:ca-dre-agent-02056789',
    type: ['VerifiableCredential', 'RealEstateLicenseCredential'],
    title: 'Real Estate Agent License',
    icon: '🏠',
    issuer: 'CA_DRE',
    issuedTo: 'did:example:holder',
    claims: {
      licenseNumber: '02056789',
      licenseType: 'Real Estate Agent',
      state: 'California',
      issueDate: '2023-01-15'
    },
    expirationDate: '2025-06-30',
    status: 'Active',
    required: false,
  },
  {
    contractId: 'mock-contract-brokerage',
    credentialId: 'urn:uuid:kw-affiliation-12345',
    type: ['VerifiableCredential', 'BrokerageAffiliationCredential'],
    title: 'Keller Williams Affiliation',
    icon: '🏢',
    issuer: 'KELLER_WILLIAMS',
    issuedTo: 'did:example:holder',
    claims: {
      affiliationId: 'KW-CA-12345',
      agentLicense: '02056789',
      brokerageName: 'Keller Williams Realty',
      office: 'San Francisco'
    },
    status: 'Active',
    required: false,
  },
];

type WalletType = 'dfns' | 'bron' | null;

export default function Register() {
  const [step, setStep] = useState(1);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletType>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [partyId, setPartyId] = useState<string>(''); // Store the actual party ID
  const [operatorPartyId, setOperatorPartyId] = useState<string>(''); // Store the operator party ID
  const [existingUsers, setExistingUsers] = useState<string[]>([]);
  const [selectedCredentials, setSelectedCredentials] = useState<string[]>(['mock-contract-gov-id']);
  const [credentials, setCredentials] = useState<CredentialDisplay[]>(MOCK_W3C_CREDENTIALS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = 'http://localhost:8080';

  useEffect(() => {
    fetchExistingUsers();
    fetchOperatorParty();
  }, []);

  const fetchOperatorParty = async () => {
    try {
      const operatorId = await findPartyByHint('operator');
      if (operatorId) {
        setOperatorPartyId(operatorId);
      }
    } catch (err) {
      console.error('Error fetching operator party:', err);
    }
  };

  // Fetch real credentials from ledger when reaching step 2
  useEffect(() => {
    if (step === 2 && partyId) {
      fetchUserCredentials();
    }
  }, [step, partyId]);

  const fetchExistingUsers = async () => {
    try {
      const response = await fetch(`${apiUrl}/v2/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setExistingUsers(data.users.map((u: any) => u.id));
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchUserCredentials = async () => {
    try {
      console.log('[Register] Fetching credentials for partyId:', partyId);
      console.log('[Register] Username:', username);

      // Get JWT token with the actual party ID (not username)
      const token = await cantonApi.getToken(partyId);
      cantonApi.setAuth(token, partyId);

      console.log('[Register] Using templateId:', W3C_VC.VerifiableCredential.templateId);

      // Query VerifiableCredential contracts for this user
      const vcs = await cantonApi.query<W3C_VC.VerifiableCredential>(
        W3C_VC.VerifiableCredential.templateId
      );

      console.log('[Register] Received VCs:', JSON.stringify(vcs, null, 2));

      if (vcs && vcs.length > 0) {
        // Convert VerifiableCredential contracts to CredentialDisplay format
        const realCredentials: CredentialDisplay[] = vcs.map((vc, index) => {
          console.log(`[Register] Processing VC ${index}:`, JSON.stringify(vc, null, 2));

          // Defensive checks for nested properties
          if (!vc.payload) {
            console.error(`[Register] VC ${index} missing payload:`, vc);
            throw new Error(`Contract ${index} is missing payload`);
          }

          if (!vc.payload.subject) {
            console.error(`[Register] VC ${index} missing subject:`, vc.payload);
            throw new Error(`Contract ${index} payload is missing subject`);
          }

          const claims: Record<string, string> = {};

          // Convert DAML Tuple2 array to claims object
          if (vc.payload.subject.claims && Array.isArray(vc.payload.subject.claims)) {
            vc.payload.subject.claims.forEach((tuple: any) => {
              // DAML Tuple2 has _1 and _2 properties
              claims[tuple._1] = tuple._2;
            });
          }

          // Determine icon based on credential type
          let icon = '📜';
          let title = vc.payload.credentialType.join(', ');

          if (vc.payload.credentialType.includes('GovernmentIDCredential')) {
            icon = '🪪';
            title = claims.state ? `${claims.state} Driver's License` : 'Government ID';
          } else if (vc.payload.credentialType.includes('RealEstateLicenseCredential')) {
            icon = '🏠';
            title = 'Real Estate License';
          } else if (vc.payload.credentialType.includes('BrokerageAffiliationCredential')) {
            icon = '🏢';
            title = claims.brokerageName || 'Brokerage Affiliation';
          }

          // Convert DAML Optional ([] or [value]) to string | undefined
          const expirationDate = Array.isArray(vc.payload.expirationDate) && vc.payload.expirationDate.length > 0
            ? vc.payload.expirationDate[0]
            : undefined;

          return {
            contractId: vc.contractId,
            credentialId: vc.payload.credentialId,
            type: vc.payload.credentialType,
            title,
            icon,
            issuer: vc.payload.issuer,
            issuedTo: vc.payload.subject.id,
            claims,
            expirationDate,
            status: vc.payload.status,
            required: vc.payload.credentialType.includes('GovernmentIDCredential') // Gov ID is required
          };
        });

        setCredentials(realCredentials);

        // Pre-select required credentials
        const requiredIds = realCredentials
          .filter(c => c.required)
          .map(c => c.contractId);
        setSelectedCredentials(requiredIds);
      } else {
        console.log('No credentials found on ledger, using mock credentials');
        // Keep using mock credentials if none found
      }
    } catch (err) {
      console.error('Error fetching credentials from ledger:', err);
      // Keep using mock credentials on error
    }
  };

  const handleConnectWallet = () => {
    setShowWalletModal(true);
  };
  

  const handleSelectWallet = (wallet: WalletType) => {
    setSelectedWallet(wallet);
    setShowWalletModal(false);
  };

  const handleUsernamePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please provide both username and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const userExists = existingUsers.includes(username);

      // First, try to find an existing party for this username
      let foundPartyId = await findPartyByHint(username);

      if (userExists) {
        // User exists, use the found party or username as fallback
        setPartyId(foundPartyId || username);
        setStep(2);
      } else {
        // Create new party and user, or use existing party if found
        const createdPartyId = await createPartyAndUser(username, foundPartyId);
        setPartyId(createdPartyId);
        setStep(2);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process registration');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const findPartyByHint = async (partyIdHint: string): Promise<string | null> => {
    try {
      // Try to list all parties and find one matching the hint
      const response = await fetch(`${apiUrl}/v2/parties`);
      if (!response.ok) return null;

      const data = await response.json();
      const parties = data.partyDetails || [];

      // Look for a party that starts with the hint (case-insensitive)
      // The seeding script creates parties like "alice-9b3970be::..."
      // We want to find this when searching for "alice"
      const matchingParty = parties.find((p: any) => {
        const partyId = p.party.toLowerCase();
        const searchTerm = partyIdHint.toLowerCase();
        // Check if party ID starts with the hint (e.g., "alice-" matches when searching for "alice")
        return partyId.startsWith(searchTerm + '-') || partyId.startsWith(searchTerm + '::');
      });

      if (matchingParty) {
        console.log(`Found existing party for ${partyIdHint}:`, matchingParty.party);
      }

      return matchingParty ? matchingParty.party : null;
    } catch (err) {
      console.error('Error finding party:', err);
      return null;
    }
  };

  const createPartyAndUser = async (userId: string, existingPartyId: string | null): Promise<string> => {
    try {
      let partyId: string = existingPartyId || '';

      // Step 2: If party doesn't exist, create it
      if (!partyId) {
        const partyResponse = await fetch(`${apiUrl}/v2/parties`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            partyIdHint: userId,
            displayName: userId
          })
        });

        if (!partyResponse.ok) {
          const errorText = await partyResponse.text();
          throw new Error(`Failed to create party: ${partyResponse.statusText} - ${errorText}`);
        }

        const partyData = await partyResponse.json();
        partyId = partyData.partyDetails.party;
      } else {
        console.log(`Using existing party for ${userId}: ${partyId}`);
      }

      // Step 3: Create user with the party (new or existing)
      const userResponse = await fetch(`${apiUrl}/v2/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: {
            id: userId,
            primaryParty: partyId,
            actAs: [partyId],
            readAs: [],
            isDeactivated: false,
            metadata: {
              resourceVersion: "",
              annotations: {}
            },
            identityProviderId: ""
          }
        })
      });

      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        throw new Error(`Failed to create user: ${userResponse.statusText} - ${errorText}`);
      }

      await fetchExistingUsers();
      return partyId;
    } catch (err) {
      throw err;
    }
  };

  const toggleCredential = (contractId: string) => {
    const credential = credentials.find(c => c.contractId === contractId);
    if (credential?.required) return;

    setSelectedCredentials(prev =>
      prev.includes(contractId)
        ? prev.filter(id => id !== contractId)
        : [...prev, contractId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCredentials.length === 0) {
      setError('Please select at least one credential');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Get JWT token with the actual party ID (not username)
      const token = await cantonApi.getToken(partyId);
      cantonApi.setAuth(token, partyId);

      // TODO: In production, these contractIds would come from actual VerifiableCredential contracts on the ledger
      // For now, we're using mock contractIds that will be created by the seeding script
      const selectedCredDisplays = credentials.filter(c => selectedCredentials.includes(c.contractId));

      // Step 1: Present each credential to create PresentationReceipt contracts
      // NOTE: This will only work once we have real VerifiableCredential contracts on the ledger
      // For now, we'll create PresentationReceipt contracts directly (simulating the presentation)
      const presentationReceiptIds: string[] = [];

      for (const cred of selectedCredDisplays) {
        try {
          // In a real implementation with credentials on the ledger, we would:
          // const receipt = await cantonApi.exercise(
          //   VerifiableCredential.templateId,
          //   cred.contractId,
          //   'PresentCredential',
          //   {
          //     verifier: 'operator',
          //     challenge: `registration-${username}-${Date.now()}`,
          //     presentationProof: 'mock-proof-of-possession'
          //   }
          // );
          // presentationReceiptIds.push(receipt.result.exerciseResult);

          // For now, create PresentationReceipt directly (bypassing VerifiableCredential)
          const receiptPayload = {
            credentialId: cred.credentialId,
            holder: partyId,
            verifier: operatorPartyId || 'operator',
            presentedAt: new Date().toISOString(),
            challenge: `registration-${username}-${Date.now()}`,
            presentationProof: 'mock-proof-of-possession'
          };

          const receipt = await cantonApi.create<typeof receiptPayload>(
            W3C_VC.PresentationReceipt.templateId,
            receiptPayload
          );

          presentationReceiptIds.push(receipt.contractId);
        } catch (err) {
          console.error(`Failed to present credential ${cred.title}:`, err);
          throw new Error(`Failed to present credential: ${cred.title}`);
        }
      }

      // Step 2: Determine requested role based on credentials
      let requestedRole: RETVN_Role.UserRole = 'PrivateCitizen';
      const hasRELicense = selectedCredDisplays.some(c =>
        c.type.includes('RealEstateLicenseCredential')
      );
      const hasBrokerageAffiliation = selectedCredDisplays.some(c =>
        c.type.includes('BrokerageAffiliationCredential')
      );

      if (hasRELicense && hasBrokerageAffiliation) {
        requestedRole = 'RealtorAgent';
      } else if (hasRELicense) {
        requestedRole = 'PrivateCitizen'; // Has license but no affiliation
      }

      // Step 3: Create RegistrationRequest contract
      const registrationPayload = {
        operator: operatorPartyId || 'operator',
        user: partyId,
        requestedRole,
        credentialPresentations: presentationReceiptIds,
        requestedAt: new Date().toISOString()
      };

      await cantonApi.create<typeof registrationPayload>(
        RETVN_Role.RegistrationRequest.templateId,
        registrationPayload
      );

      console.log('Registration request submitted successfully');
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <div className="auth-header">
          <h1 className="auth-title">RETVN</h1>
          <p className="auth-subtitle">Register for Real Estate Transaction Verification</p>
        </div>

        {step === 1 ? (
          <>
            <div className="step-indicator">
              <div className="step active">
                <div className="step-number">1</div>
                <div className="step-label">Connect Wallet</div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-label">Select Credentials</div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-label">Await Approval</div>
              </div>
            </div>

            {!selectedWallet ? (
              <>
                <div className="alert alert-info mb-3">
                  <strong>Step 1:</strong> Connect your digital wallet to access your credentials
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={handleConnectWallet}
                >
                  Connect Wallet
                </button>
              </>
            ) : (
              <form onSubmit={handleUsernamePasswordSubmit}>
                <div className="alert alert-success mb-3">
                  <strong>Wallet Connected:</strong> {selectedWallet}
                </div>

                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    placeholder="Enter your username"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="Enter your password"
                  />
                </div>

                {error && (
                  <div className="alert alert-error">
                    {error}
                  </div>
                )}

                <div className="grid grid-2" style={{ gap: '1rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedWallet(null)}
                    disabled={isLoading}
                  >
                    Change Wallet
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Continue'}
                  </button>
                </div>
              </form>
            )}
          </>
        ) : step === 2 ? (
          <form onSubmit={handleSubmit}>
            <div className="step-indicator">
              <div className="step completed">
                <div className="step-number">✓</div>
                <div className="step-label">Connect Wallet</div>
              </div>
              <div className="step active">
                <div className="step-number">2</div>
                <div className="step-label">Select Credentials</div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-label">Await Approval</div>
              </div>
            </div>

            <div className="alert alert-info mb-3">
              <strong>Step 2:</strong> Select the credentials you want to present for verification
            </div>

            <div className="credential-grid">
              {credentials.map((credential) => {
                const claimsDisplay = Object.entries(credential.claims)
                  .slice(0, 3) // Show first 3 claims
                  .map(([key, value]) => `${key}: ${value}`);

                return (
                  <div
                    key={credential.contractId}
                    className={`credential-card ${selectedCredentials.includes(credential.contractId) ? 'selected' : ''}`}
                    onClick={() => toggleCredential(credential.contractId)}
                  >
                    <div className="credential-icon">{credential.icon}</div>
                    <div className="credential-info">
                      <div className="credential-title">{credential.title}</div>
                      <div className="credential-detail">Issuer: {credential.issuer}</div>
                      {claimsDisplay.map((claim, i) => (
                        <div key={i} className="credential-detail">{claim}</div>
                      ))}
                      {credential.expirationDate && (
                        <div className="credential-detail">Expires: {new Date(credential.expirationDate).toLocaleDateString()}</div>
                      )}
                      <span className={`credential-status status-${credential.status.toLowerCase()}`}>
                        {credential.required ? '⚠ Required' : `✓ ${credential.status}`}
                      </span>
                    </div>
                    <div className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={selectedCredentials.includes(credential.contractId)}
                        onChange={() => {}}
                        disabled={credential.required}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep(1)}
                disabled={isLoading}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit for Approval'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="step-indicator">
              <div className="step completed">
                <div className="step-number">✓</div>
                <div className="step-label">Connect Wallet</div>
              </div>
              <div className="step completed">
                <div className="step-number">✓</div>
                <div className="step-label">Select Credentials</div>
              </div>
              <div className="step active">
                <div className="step-number">3</div>
                <div className="step-label">Await Approval</div>
              </div>
            </div>

            <div className="alert alert-success text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Registration Submitted!</h3>
              <p>Your credentials have been submitted for admin approval.</p>
              <p style={{ marginTop: '1rem' }}>
                You will be notified once an administrator reviews and approves your account.
              </p>
            </div>

            <Link to="/login" className="btn btn-primary btn-block">
              Return to Login
            </Link>
          </>
        )}

        <div className="auth-footer mt-4">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Wallet Selection Modal */}
      {showWalletModal && (
        <div className="modal-overlay" onClick={() => setShowWalletModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem' }}>Select Wallet</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                className="btn btn-outline btn-block"
                onClick={() => handleSelectWallet('dfns')}
              >
                🔐 Dfns
              </button>
              <button
                className="btn btn-outline btn-block"
                onClick={() => handleSelectWallet('bron')}
              >
                ⚡ Bron
              </button>
            </div>
            <button
              className="btn btn-secondary btn-block"
              style={{ marginTop: '1.5rem' }}
              onClick={() => setShowWalletModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
