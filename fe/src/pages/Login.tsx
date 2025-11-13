import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

interface User {
  id: string;
  primaryParty?: string;
  isDeactivated: boolean;
}

export default function Login() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const apiUrl = import.meta.env.VITE_CANTON_API_URL || 'http://localhost:7575';
        const response = await fetch(`${apiUrl}/v2/users`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data.users.filter((u: User) => !u.isDeactivated));
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users from Canton');
      }
    };

    fetchUsers();
  }, []);

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
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.id}
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
