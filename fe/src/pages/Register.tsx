import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

interface Credential {
  id: string;
  type: string;
  title: string;
  icon: string;
  details: string[];
  status: 'valid' | 'expired' | 'required';
  required: boolean;
}

const MOCK_CREDENTIALS: Credential[] = [
  {
    id: 'gov-id',
    type: 'GovernmentID',
    title: 'California Driver\'s License',
    icon: '🪪',
    details: ['License #: D1234567', 'Expires: Dec 15, 2026'],
    status: 'valid',
    required: true,
  },
  {
    id: 're-license',
    type: 'RealEstateLicense',
    title: 'Real Estate Agent License',
    icon: '🏠',
    details: ['License #: 02056789', 'Issued by: CA DRE', 'Expires: Jun 30, 2025'],
    status: 'valid',
    required: false,
  },
  {
    id: 'brokerage',
    type: 'BrokerageAffiliation',
    title: 'Keller Williams Affiliation',
    icon: '🏢',
    details: ['Affiliation ID: KW-CA-12345', 'Agent License: 02056789'],
    status: 'valid',
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
  const [existingUsers, setExistingUsers] = useState<string[]>([]);
  const [selectedCredentials, setSelectedCredentials] = useState<string[]>(['gov-id']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = 'http://localhost:8080';

  useEffect(() => {
    fetchExistingUsers();
  }, []);

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

      if (userExists) {
        // User exists, go to credentials step
        setStep(2);
      } else {
        // Create new party and user
        await createPartyAndUser(username);
        setStep(2);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process registration');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createPartyAndUser = async (userId: string) => {
    try {
      // Step 1: Create a new party
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
      const partyId = partyData.partyDetails.party;

      // Step 2: Create user with the new party
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
    } catch (err) {
      throw err;
    }
  };

  const toggleCredential = (credentialId: string) => {
    const credential = MOCK_CREDENTIALS.find(c => c.id === credentialId);
    if (credential?.required) return;

    setSelectedCredentials(prev =>
      prev.includes(credentialId)
        ? prev.filter(id => id !== credentialId)
        : [...prev, credentialId]
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep(3);
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
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
              {MOCK_CREDENTIALS.map((credential) => (
                <div
                  key={credential.id}
                  className={`credential-card ${selectedCredentials.includes(credential.id) ? 'selected' : ''}`}
                  onClick={() => toggleCredential(credential.id)}
                >
                  <div className="credential-icon">{credential.icon}</div>
                  <div className="credential-info">
                    <div className="credential-title">{credential.title}</div>
                    {credential.details.map((detail, i) => (
                      <div key={i} className="credential-detail">{detail}</div>
                    ))}
                    <span className={`credential-status status-${credential.status}`}>
                      {credential.required ? '⚠ Required' : `✓ ${credential.status.charAt(0).toUpperCase() + credential.status.slice(1)}`}
                    </span>
                  </div>
                  <div className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={selectedCredentials.includes(credential.id)}
                      onChange={() => {}}
                      disabled={credential.required}
                    />
                  </div>
                </div>
              ))}
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
