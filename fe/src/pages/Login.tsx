import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { cantonApi } from '../services/cantonApi'
import './Auth.css'

interface UserAccountDisplay {
  user: string // Party ID
  displayName: string // Extracted from party ID
  role: string
  status: string
}

export default function Login() {
  const navigate = useNavigate()
  const { login: authLogin } = useAuth()
  const [userAccounts, setUserAccounts] = useState<UserAccountDisplay[]>([])
  const [selectedUser, setSelectedUser] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUserAccounts = async () => {
      try {
        // Fetch users from Canton JSON API /v2/users
        const response = await fetch('http://localhost:8080/v2/users', {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`Canton API Error: ${response.status}`)
        }

        const data = await response.json()
        console.log('Fetched users from /v2/users:', data)

        // Transform /v2/users response to display format
        // /v2/users returns: { users: [{ id, primaryParty, actAs, readAs, isDeactivated, ... }] }
        const displayAccounts: UserAccountDisplay[] = data.users
          .filter((user: any) => !user.isDeactivated)
          .map((user: any) => ({
            user: user.primaryParty,
            displayName: user.id || user.primaryParty.split('::')[0] || user.primaryParty,
            role: 'User', // Default role, /v2/users doesn't have role info
            status: user.isDeactivated ? 'Inactive' : 'Active'
          }))

        setUserAccounts(displayAccounts)
      } catch (err) {
        console.error('Error fetching user accounts:', err)
        setError('Failed to load user accounts. Is Canton running on port 8080?')
      }
    }

    fetchUserAccounts()
  }, [])

  const handleInsecureLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!selectedUser) {
        setError('Please select a user')
        return
      }

      setIsLoading(true)
      setError('')

      try {
        // Call AuthContext's login method
        await authLogin(selectedUser)

        // Navigate to dashboard after successful login
        navigate('/')
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Login failed'
        setError(msg)
        console.error('Login error:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [selectedUser, authLogin, navigate]
  )

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">RETVN</h1>
          <p className="auth-subtitle">Real Estate Transaction Verification Network</p>
        </div>

        <form onSubmit={handleInsecureLogin} className="auth-form">
          <div className="form-group">
            <label className="form-label">Select User</label>
            <select
              className="form-select"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              disabled={isLoading}
            >
              <option value="">Choose a user...</option>
              {userAccounts.map((account) => (
                <option key={account.user} value={account.user}>
                  {account.displayName} ({account.role})
                </option>
              ))}
            </select>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <div className="auth-footer">
            <p>
              Do not have an account{' '}
              <Link to="/register" className="auth-link">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
