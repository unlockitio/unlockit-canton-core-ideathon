import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const MOCK_USERS = [
  { userId: 'operator', name: 'Unlockit Operator', role: 'Operator' },
  { userId: 'maria', name: 'Maria Rodriguez', role: 'Realtor Agent' },
  { userId: 'john', name: 'John Doe', role: 'Realtor Agent' },
  { userId: 'sarah', name: 'Sarah Chen', role: 'Private Citizen' },
  { userId: 'broker_bob', name: 'Bob Smith', role: 'Realtor Broker' },
];

export default function Login() {
  const [selectedUser, setSelectedUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) {
      setError('Please select a user');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(selectedUser);
      navigate('/');
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">RETVN</h1>
          <p className="auth-subtitle">Real Estate Transaction Verification Network</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label className="form-label">Select User</label>
            <select
              className="form-select"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              disabled={isLoading}
            >
              <option value="">Choose a user...</option>
              {MOCK_USERS.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
