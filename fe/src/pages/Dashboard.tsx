import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { cantonApi } from '../services/cantonApi'
import type { Contract } from '../types/canton'

interface Transaction {
  contractId: string
  type: 'submission' | 'verification'
  title: string
  status: 'Verified' | 'Pending' | 'Partially Verified'
  trustScore: number
  date: string
}

export default function Dashboard() {
  const { userId } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Query both submitted transactions and verifications
        const result: Contract<Transaction>[] = await cantonApi.query('TransactionTemplate', {
          owner: userId
        })
        if (!result) {
          setTransactions([])
          setLoading(false)
          return
        }
        const mapped: Transaction[] = result.map(c => ({
          contractId: c.contractId,
          type: c.payload.type,
          title: c.payload.title,
          status: c.payload.status,
          trustScore: c.payload.trustScore,
          date: c.payload.date
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
  }, [userId])

  if (loading) return <div>Loading dashboard...</div>

  // Compute aggregated stats
  const transactionsSubmitted = transactions.filter(t => t.type === 'submission').length
  const verificationsGiven = transactions.filter(t => t.type === 'verification').length
  const trustScore =
    transactionsSubmitted > 0
      ? Math.round(
          transactions
            .filter(t => t.type === 'submission' && t.status === 'Verified')
            .reduce((sum, t) => sum + t.trustScore, 0) /
            transactionsSubmitted
        )
      : 0
  const pendingVerifications = transactions.filter(t => t.status === 'Pending').length

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
          <div className="text-sm text-success">
            {verificationsGiven > 0 ? `+${verificationsGiven} this month` : 'No verifications yet'}
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
