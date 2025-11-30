import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { cantonApi } from '../services/cantonApi';
import { TemplateIds } from '../utils/daml';

interface UserAccount {
  operator: string;
  user: string;
  role: string;
  verificationWeight: number;
  credentialPresentations: string[];
  registeredAt: string;
  status: string;
  reputation: number;
  reputationCap: number;
  transactionsSubmitted: number;
}

interface AuthContextType {
  party: string | null;
  userId: string | null;
  token: string | null;
  isAuthenticated: boolean;
  isOperator: boolean;
  userAccount: UserAccount | null;
  userAccountContractId: string | null;
  userRole: string | null;
  verificationWeight: number;
  login: (userId: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  refreshUserAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [party, setParty] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [userAccountContractId, setUserAccountContractId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedParty = localStorage.getItem('party');
    const storedUserId = localStorage.getItem('userId');
    const storedToken = localStorage.getItem('token');

    if (storedParty && storedUserId && storedToken) {
      setParty(storedParty);
      setUserId(storedUserId);
      setToken(storedToken);
      cantonApi.setAuth(storedToken, storedParty);
    }
    setIsLoading(false);
  }, []);

  const refreshUserAccount = async () => {
    if (!party || !token) return;

    try {
      // Query for user's UserAccount contract
      const accounts = await cantonApi.query<UserAccount>(
        TemplateIds.UserAccount,
        { user: party }
      );

      if (accounts.length > 0) {
        setUserAccount(accounts[0].payload);
        setUserAccountContractId(accounts[0].contractId);
        localStorage.setItem('userAccount', JSON.stringify(accounts[0].payload));
        localStorage.setItem('userAccountContractId', accounts[0].contractId);
      }
    } catch (error) {
      console.error('Failed to fetch user account:', error);
      // Don't throw - user might not have account yet (in registration)
    }
  };

  const login = async (selectedUserId: string) => {
    try {
      const token = await cantonApi.getToken(selectedUserId);

      if (token) {

        const userParty = selectedUserId; // FIXME: Assuming userId is the party for simplicity 
        cantonApi.setAuth(token, userParty);

        setParty(userParty);
        setUserId(selectedUserId);
        setToken(token);

        localStorage.setItem('party', userParty);
        localStorage.setItem('userId', selectedUserId);
        localStorage.setItem('token', token);

        // Fetch user account after login
        await refreshUserAccount();
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setParty(null);
    setUserId(null);
    setToken(null);
    setUserAccount(null);
    setUserAccountContractId(null);

    localStorage.removeItem('party');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('userAccount');
    localStorage.removeItem('userAccountContractId');

    cantonApi.clearAuth();
  };

  // Load user account from localStorage on mount
  useEffect(() => {
    const storedUserAccount = localStorage.getItem('userAccount');
    const storedUserAccountContractId = localStorage.getItem('userAccountContractId');

    if (storedUserAccount) {
      try {
        setUserAccount(JSON.parse(storedUserAccount));
      } catch (error) {
        console.error('Failed to parse stored user account:', error);
      }
    }

    if (storedUserAccountContractId) {
      setUserAccountContractId(storedUserAccountContractId);
    }
  }, []);

  // Refresh user account when party/token changes
  useEffect(() => {
    if (party && token && !isLoading) {
      refreshUserAccount();
    }
  }, [party, token, isLoading]);

  // Check if current party is the operator
  const isOperator = party
    ? party.toLowerCase().startsWith('operator-') || party.toLowerCase().startsWith('operator::')
    : false;

  return (
    <AuthContext.Provider
      value={{
        party,
        userId,
        token,
        isAuthenticated: !!party && !!token,
        isOperator,
        userAccount,
        userAccountContractId,
        userRole: userAccount?.role || "user-role-null", // FIXME: should be null, but we havent't add user roles yet
        verificationWeight: userAccount?.verificationWeight || 0,
        login,
        logout,
        isLoading,
        refreshUserAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
