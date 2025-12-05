import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BasketModal from './BasketModal';
import './Layout.css';

type LayoutProps = {
  onLogout: () => void;
};

export default function Layout({ onLogout }: LayoutProps) {
  const { isOperator } = useAuth();
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [basketOpen, setBasketOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
  };

  const handleSelectOrder = (order: any) => {
    // Store the selected order and open the RequestInsightModal
    // This will be handled by the parent component
    window.dispatchEvent(new CustomEvent('openBasketOrder', { detail: order }));
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
              <li><Link to="/transactions">Transactions</Link></li>
              <li><Link to="/insights">Insights</Link></li>
              <li><Link to="/rankings">Rankings</Link></li>
              <li
                className="navbar-dropdown"
                onMouseEnter={() => setWalletDropdownOpen(true)}
                onMouseLeave={() => setWalletDropdownOpen(false)}
              >
                <span className="navbar-dropdown-trigger">Wallet</span>
                {walletDropdownOpen && (
                  <ul className="navbar-dropdown-menu">
                    <li><Link to="/wallet/rewards">Rewards</Link></li>
                    <li><Link to="/wallet/payments">Payments</Link></li>
                    <li><Link to="/wallet/credentials">Credentials</Link></li>
                  </ul>
                )}
              </li>
              {/* <li><Link to="/debug/ledger" style={{ color: '#e53e3e' }}>Debug</Link></li> */}
              </>
            )}
          </ul>

          <div className="navbar-user">
            {!isOperator && (
              <button
                onClick={() => setBasketOpen(true)}
                className="btn btn-secondary btn-sm"
                style={{ marginRight: '0.5rem' }}
                title="Pending Orders"
              >
                🛒
              </button>
            )}
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <BasketModal
        isOpen={basketOpen}
        onClose={() => setBasketOpen(false)}
        onSelectOrder={handleSelectOrder}
      />
    </div>
  );
}
