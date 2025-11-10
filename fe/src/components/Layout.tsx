import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout() {
  const { userId, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            RETVN
          </Link>

          <ul className="navbar-nav">
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/submit">Submit Transaction</Link></li>
            <li><Link to="/verify">Verify Transactions</Link></li>
            <li><Link to="/market-data">Market Data</Link></li>
            <li><Link to="/admin/approvals">Admin</Link></li>
          </ul>

          <div className="navbar-user">
            <span className="user-info">{userId}</span>
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
