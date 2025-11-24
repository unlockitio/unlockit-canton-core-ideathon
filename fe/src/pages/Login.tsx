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
  const [operatorParty, setOperatorParty] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserAccounts = async () => {
      try {
        // Step 1: Find operator party
        const partiesResponse = await fetch('http://localhost:8080/v2/parties')
        if (!partiesResponse.ok) {
          throw new Error('Failed to fetch parties')
        }
        const partiesData = await partiesResponse.json()
        const operatorPartyDetails = partiesData.partyDetails?.find((p: any) => {
          const partyId = p.party.toLowerCase()
          return partyId.startsWith('operator-') || partyId.startsWith('operator::')
        })

        if (!operatorPartyDetails) {
          throw new Error('Operator party not found')
        }

        const operatorPartyId = operatorPartyDetails.party
        console.log('Using operator party:', operatorPartyId)

        // Step 2: Get operator token and query UserAccount contracts from operator's perspective
        const operatorToken = await cantonApi.getToken(operatorPartyId)
        cantonApi.setAuth(operatorToken, operatorPartyId)

        console.log('Querying UserAccount contracts from operator perspective...')
        const userAccountContracts = await cantonApi.query<{
          operator: string
          user: string
          role: { tag: string } | string
          verificationWeight: number
          credentialPresentations: string[]
          registeredAt: string
          status: { tag: string } | string
        }>('RETVN.Role:UserAccount')

        console.log('UserAccount contracts:', userAccountContracts)

        // Extract unique user parties from UserAccount contracts
        const userPartiesWithAccounts = new Set<string>()
        const userAccountDataMap = new Map<string, any>()

        userAccountContracts.forEach(contract => {
          const userParty = contract.payload.user
          userPartiesWithAccounts.add(userParty)

          // Extract role - handle both object format {tag: "RealtorAgent"} and string format
          let role = 'User'
          if (contract.payload.role) {
            if (typeof contract.payload.role === 'object' && 'tag' in contract.payload.role) {
              role = contract.payload.role.tag
            } else if (typeof contract.payload.role === 'string') {
              role = contract.payload.role
            }
          }

          userAccountDataMap.set(userParty, {
            role,
            status: typeof contract.payload.status === 'object' ? contract.payload.status.tag : contract.payload.status
          })
        })

        console.log('User parties with accounts:', Array.from(userPartiesWithAccounts))

        // Step 3: Fetch all users from Canton /v2/users
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

        // Step 4: Filter to only show users that have Active UserAccount contracts
        const displayAccounts: UserAccountDisplay[] = data.users
          .filter((user: any) => {
            if (user.isDeactivated) return false
            if (!userPartiesWithAccounts.has(user.primaryParty)) return false

            const accountData = userAccountDataMap.get(user.primaryParty)
            // Only show AccountActive accounts (not AccountSuspended or AccountPendingReview)
            return accountData?.status === 'AccountActive'
          })
          .map((user: any) => {
            const accountData = userAccountDataMap.get(user.primaryParty)
            return {
              user: user.primaryParty,
              displayName: user.id || user.primaryParty.split('::')[0] || user.primaryParty,
              role: accountData?.role || 'User',
              status: accountData?.status || 'AccountActive'
            }
          })

        console.log('Filtered display accounts:', displayAccounts)
        setUserAccounts(displayAccounts)

        // Store operator party for admin login
        setOperatorParty(operatorPartyId)

        // Clear operator auth so it doesn't interfere with actual login
        cantonApi.clearAuth()
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

  const handleAdminLogin = useCallback(
    async () => {
      if (!operatorParty) {
        setError('Operator party not found')
        return
      }

      setIsLoading(true)
      setError('')

      try {
        // Login as operator
        await authLogin(operatorParty)

        // Navigate to admin approvals page
        navigate('/admin/approvals')
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Admin login failed'
        setError(msg)
        console.error('Admin login error:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [operatorParty, authLogin, navigate]
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
        </form>

        {operatorParty && (
          <>
            <div className="auth-divider">
              <span>or</span>
            </div>
            <button
              type="button"
              className="btn-admin"
              onClick={handleAdminLogin}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Admin Login'}
            </button>
          </>
        )}

        <div className="auth-footer">
          <p>
            Do not have an account{' '}
            <Link to="/register" className="auth-link">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
