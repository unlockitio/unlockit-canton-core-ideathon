import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { cantonApi } from '../services/cantonApi'
import type { Contract } from '../types/canton'
import { TemplateIds } from '../utils/daml'
import type { TransactionData } from '../codegen/unlockit-canton-core-ideathon-0.0.1/lib/RETVN/Transaction/module'

interface Transaction {
  contractId: string
  type: 'submission' | 'verification'
  title: string
  status: 'Verified' | 'Pending' | 'Partially Verified'
  trustScore: number
  date: string
}

export default function Dashboard() {
  const { userId, party, userAccount } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [verificationsAsSubmitter, setVerificationsAsSubmitter] = useState(0)
  const [verificationsAsVerifier, setVerificationsAsVerifier] = useState(0)
  const [pendingVerificationsCount, setPendingVerificationsCount] = useState(0)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Query TransactionData contracts
        const result: Contract<TransactionData>[] = await cantonApi.query(
          TemplateIds.TransactionData
        )
        if (!result) {
          setTransactions([])
          setLoading(false)
          return
        }

        // Count verifications given by the current user and pending verifications
        let asSubmitterCount = 0
        let asVerifierCount = 0
        let pendingCount = 0
        if (party) {
          result.forEach(c => {
            const hasVerified = c.payload.verifications.some(v => v.verifier === party)
            const isAssignedVerifier = c.payload.assignedVerifiers.includes(party)

            if (hasVerified) {
              // Check if user was the submitter of this transaction
              if (c.payload.submitter === party) {
                asSubmitterCount++
              } else {
                asVerifierCount++
              }
            } else if (isAssignedVerifier) {
              // User is assigned but hasn't verified yet
              pendingCount++
            }
          })
        }
        setVerificationsAsSubmitter(asSubmitterCount)
        setVerificationsAsVerifier(asVerifierCount)
        setPendingVerificationsCount(pendingCount)

        const mapped: Transaction[] = result.map(c => ({
          contractId: c.contractId,
          type: 'submission', // All TransactionData are submissions
          title: c.payload.propertyAddress,
          status: c.payload.status === 'FullyVerified' ? 'Verified'
                : c.payload.status === 'PartiallyVerified' ? 'Partially Verified'
                : 'Pending',
          trustScore: parseInt(c.payload.trustScore, 10),
          date: c.payload.transactionDate
        }))

        // Sort by date descending for recent activity
        mapped.sort((a, b) => (a.date < b.date ? 1 : -1))
        setTransactions(mapped)
      } catch (err) {
        console.error('Failed to fetch transactions:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [userId, party])

  if (loading) return <div>Loading dashboard...</div>

  // Compute aggregated stats
  const transactionsSubmitted = transactions.filter(t => t.type === 'submission').length
  const verificationsGiven = verificationsAsSubmitter + verificationsAsVerifier

  // Get trust score from user's reputation in their UserAccount contract
  const trustScore = userAccount?.reputation || 0
  const pendingVerifications = pendingVerificationsCount

  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-muted">Welcome back, {userId}</p>
      </div>

      <div className="grid grid-2 mb-4">
        <div className="card">
          <div className="text-muted text-sm font-semibold mb-1">Transactions Submitted</div>
          <div className="text-xl font-bold mb-1">{transactionsSubmitted}</div>
          <div className="text-sm text-success">
            {transactionsSubmitted > 0 ? `+${transactionsSubmitted} this month` : 'No submissions yet'}
          </div>
        </div>
        <div className="card">
          <div className="text-muted text-sm font-semibold mb-1">Verifications Given</div>
          <div className="text-xl font-bold mb-1">{verificationsGiven}</div>
          <div className="text-sm text-muted">
            {verificationsAsSubmitter} as submitter, {verificationsAsVerifier} as verifier
          </div>
        </div>
        <div className="card">
          <div className="text-muted text-sm font-semibold mb-1">Trust Score</div>
          <div className="text-xl font-bold mb-1">{trustScore}</div>
          <div className="text-sm text-success">
            {trustScore > 0 ? 'Based on verified transactions' : 'No verified transactions yet'}
          </div>
        </div>
        <div className="card">
          <div className="text-muted text-sm font-semibold mb-1">Pending Verifications</div>
          <div className="text-xl font-bold mb-1">{pendingVerifications}</div>
          <div className="text-sm text-success">
            {pendingVerifications > 0 ? 'Awaiting your review' : 'All caught up'}
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div>
          <div className="card">
            <h2 className="card-header">Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link to="/submit" className="btn btn-primary">
                Submit New Transaction
              </Link>
              <Link to="/verify" className="btn btn-secondary">
                Verify Transactions
              </Link>
              <Link to="/market-data" className="btn btn-secondary">
                View Market Data
              </Link>
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <h2 className="card-header">Recent Activity</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {transactions.slice(0, 5).map(activity => (
                <div
                  key={activity.contractId}
                  style={{
                    padding: '1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="font-semibold">{activity.title}</span>
                    <span
                      className={`badge ${
                        activity.status === 'Verified'
                          ? 'badge-success'
                          : activity.status === 'Pending'
                          ? 'badge-warning'
                          : 'badge-info'
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span className="text-muted">Trust Score: {activity.trustScore}</span>
                    <span className="text-muted">{activity.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
