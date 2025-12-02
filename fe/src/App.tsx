import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import TransactionDetail from './pages/TransactionDetail';
import SubmitTransaction from './pages/SubmitTransaction';
import VerifyTransactions from './pages/VerifyTransactions';
import Insights from './pages/Insights';
import InsightDetail from './pages/InsightDetail';
import WalletRewards from './pages/WalletRewards';
import WalletPayments from './pages/WalletPayments';
import WalletCredentials from './pages/WalletCredentials';
import AdminApprovals from './pages/AdminApprovals';
import AdminUsers from './pages/AdminUsers';
import LedgerDebug from './pages/LedgerDebug';
import Layout from './components/Layout';
import Rankings from './pages/Rankings';
import { AuthProvider, useAuth } from './context/AuthContext';

// Wrapper component to protect admin routes
function AdminRoute({ children }: { children: React.ReactElement }) {
  const { isOperator } = useAuth();

  if (!isOperator) {
    return (
      <div className="container">
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🚫</div>
            <h2>Access Denied</h2>
            <p>You do not have permission to access this page.</p>
            <p className="text-muted">Only operators can access the admin panel.</p>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

function AppContent() {
  const { isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<Layout onLogout={logout} />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="transactions/:id" element={<TransactionDetail />} />
          <Route path="insights" element={<Insights />} />
          <Route path="insights/:id" element={<InsightDetail />} />
          <Route path="wallet/rewards" element={<WalletRewards />} />
          <Route path="wallet/payments" element={<WalletPayments />} />
          <Route path="wallet/credentials" element={<WalletCredentials />} />
          <Route path="submit" element={<SubmitTransaction />} />
          <Route path="verify" element={<VerifyTransactions />} />
          <Route path="admin/approvals" element={<AdminRoute><AdminApprovals /></AdminRoute>} />
          <Route path="admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="debug/ledger" element={<LedgerDebug />} />
          <Route path="rankings" element={<Rankings />} />
        </Route>
      </Routes>
    );
  }

  return <Login />;
}


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<AppContent />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
