import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

type LayoutProps = {
  onLogout: () => void;
};

export default function Layout({ onLogout }: LayoutProps) {
  const { isOperator } = useAuth();

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            RETVN
          </Link>

          <ul className="navbar-nav">
            {isOperator ? (
              <li><Link to="/admin/approvals">Admin</Link></li>
            ) : (
              <>
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/submit">Submit Transaction</Link></li>
              <li><Link to="/verify">Verify Transactions</Link></li>
              <li><Link to="/market-data">Market Data</Link></li>
              <li><Link to="/debug/ledger" style={{ color: '#e53e3e' }}>Debug</Link></li>
              </>
            )}
          </ul>

          <div className="navbar-user">
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
