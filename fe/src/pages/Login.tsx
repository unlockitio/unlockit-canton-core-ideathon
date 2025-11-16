import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Ledger from '@daml/ledger'
import Credentials from '../types/Credentials'
import { authConfig, config } from '../config'
import './Auth.css'

interface User {
  id: string
  primaryParty?: string
  isDeactivated: boolean
}

type LoginProps = {
  onLogin: (credentials: Credentials) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/v2/users`)
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }
        const data = await response.json()
        setUsers(data.users.filter((u: User) => !u.isDeactivated))
      } catch (err) {
        console.error('Error fetching users:', err)
        setError('Failed to load users from Canton')
      }
    }

    fetchUsers()
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
        const auth = authConfig

        const token = await auth.makeToken(selectedUser)
        const ledger = new Ledger({ token, httpBaseUrl: config.apiUrl })

        const primaryParty = await auth.userManagement.primaryParty(selectedUser)

        const useGetPublicParty = () => {
          const [publicParty, setPublicParty] = useState<string | undefined>()

          const setup = useCallback(() => {
            const fn = async () => {
              const p = await auth.userManagement.publicParty()
              setPublicParty(p)
            }
            fn()
          }, [])

          return {
            usePublicParty: () => publicParty,
            setup: setup
          }
        }

        const credentials: Credentials = {
          user: { userId: selectedUser, primaryParty: primaryParty },
          party: primaryParty,
          token: token,
          getPublicParty: useGetPublicParty
        }

        onLogin(credentials)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Login failed'
        if (!error) {
          setError(msg)
        }
        console.error('Login error:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [selectedUser, onLogin, error]
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
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.id}
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
