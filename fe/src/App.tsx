import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SubmitTransaction from './pages/SubmitTransaction';
import VerifyTransactions from './pages/VerifyTransactions';
import MarketData from './pages/MarketData';
import AdminApprovals from './pages/AdminApprovals';
import AdminUsers from './pages/AdminUsers';
import LedgerDebug from './pages/LedgerDebug';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';

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
          <Route path="submit" element={<SubmitTransaction />} />
          <Route path="verify" element={<VerifyTransactions />} />
          <Route path="market-data" element={<MarketData />} />
          <Route path="admin/approvals" element={<AdminApprovals />} />
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="debug/ledger" element={<LedgerDebug />} />
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
