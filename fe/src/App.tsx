import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createLedgerContext } from './context/LedgerContext';
import DamlHub, {
  damlHubLogout,
  isRunningOnHub,
  usePublicParty,
  usePublicToken,
} from '@daml/hub-react';
import Credentials from './types/Credentials';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SubmitTransaction from './pages/SubmitTransaction';
import VerifyTransactions from './pages/VerifyTransactions';
import MarketData from './pages/MarketData';
import AdminApprovals from './pages/AdminApprovals';
import AdminUsers from './pages/AdminUsers';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';

// Context for the party of the user
export const userContext = createLedgerContext();

// Context for the public party used to query user aliases
export const publicContext = isRunningOnHub()
  ? createLedgerContext()
  : userContext;

function AppContent() {
  const [credentials, setCredentials] = React.useState<Credentials | undefined>();

if (credentials) {
  return (
    <Routes>
      <Route path="/" element={<Layout onLogout={() => setCredentials(undefined)} />}>
        <Route index element={<Dashboard />} />
        <Route path="submit" element={<SubmitTransaction />} />
        <Route path="verify" element={<VerifyTransactions />} />
        <Route path="market-data" element={<MarketData />} />
        <Route path="admin/approvals" element={<AdminApprovals />} />
        <Route path="admin/users" element={<AdminUsers />} />
      </Route>
    </Routes>
  )
}


  return <Login onLogin={setCredentials} />;
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
