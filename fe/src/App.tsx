import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SubmitTransaction from './pages/SubmitTransaction';
import VerifyTransactions from './pages/VerifyTransactions';
import MarketData from './pages/MarketData';
import AdminApprovals from './pages/AdminApprovals';
import AdminUsers from './pages/AdminUsers';
import Layout from './components/Layout';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="submit" element={<SubmitTransaction />} />
            <Route path="verify" element={<VerifyTransactions />} />
            <Route path="market-data" element={<MarketData />} />
            <Route path="admin/approvals" element={<AdminApprovals />} />
            <Route path="admin/users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
