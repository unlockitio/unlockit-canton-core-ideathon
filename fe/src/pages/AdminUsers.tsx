import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface User {
  userId: string;
  name: string;
  role: string;
  verificationWeight: number;
  status: 'Active' | 'Suspended';
  registeredAt: string;
  transactionsSubmitted: number;
  verificationsGiven: number;
}

const MOCK_USERS: User[] = [
  {
    userId: 'maria',
    name: 'Maria Rodriguez',
    role: 'Realtor Agent',
    verificationWeight: 8,
    status: 'Active',
    registeredAt: '2024-11-01',
    transactionsSubmitted: 5,
    verificationsGiven: 12,
  },
  {
    userId: 'john',
    name: 'John Doe',
    role: 'Realtor Agent',
    verificationWeight: 8,
    status: 'Active',
    registeredAt: '2024-11-15',
    transactionsSubmitted: 3,
    verificationsGiven: 8,
  },
  {
    userId: 'sarah',
    name: 'Sarah Chen',
    role: 'Private Citizen',
    verificationWeight: 5,
    status: 'Active',
    registeredAt: '2024-12-01',
    transactionsSubmitted: 1,
    verificationsGiven: 0,
  },
  {
    userId: 'broker_bob',
    name: 'Bob Smith',
    role: 'Realtor Broker',
    verificationWeight: 12,
    status: 'Active',
    registeredAt: '2024-10-15',
    transactionsSubmitted: 8,
    verificationsGiven: 25,
  },
];

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSuspend = async (user: User) => {
    if (!confirm(`Suspend account for ${user.name}?`)) {
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Account suspended: ${user.name}`);
    } catch (error) {
      console.error('Suspension failed:', error);
    }
  };

  const handleReactivate = async (user: User) => {
    if (!confirm(`Reactivate account for ${user.name}?`)) {
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Account reactivated: ${user.name}`);
    } catch (error) {
      console.error('Reactivation failed:', error);
    }
  };

  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Admin - User Directory</h1>
        <p className="text-muted">Manage registered users and their accounts</p>
        <div className="mt-2">
          <Link to="/admin/approvals" className="btn btn-secondary">
            View Pending Approvals
          </Link>
        </div>
      </div>

      <div className="card mb-4">
        <div className="grid grid-3">
          <div className="form-group">
            <label className="form-label">Search Users</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Filter by Role</label>
            <select
              className="form-select"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="Private Citizen">Private Citizen</option>
              <option value="Realtor Agent">Realtor Agent</option>
              <option value="Realtor Broker">Realtor Broker</option>
              <option value="Realtor Master">Realtor Master</option>
              <option value="Notary Public">Notary Public</option>
              <option value="Tax Authority">Tax Authority</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Filter by Status</label>
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-header">Users ({filteredUsers.length})</h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>User</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Role</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Weight</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Registered</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Activity</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.userId}
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    background: selectedUser?.userId === user.userId ? '#f7fafc' : 'white',
                  }}
                  onClick={() => setSelectedUser(user)}
                >
                  <td style={{ padding: '1rem' }}>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-muted">{user.userId}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{user.role}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-info">{user.verificationWeight}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#718096' }}>
                    {user.registeredAt}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                    <div>{user.transactionsSubmitted} submitted</div>
                    <div>{user.verificationsGiven} verified</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {user.status === 'Active' ? (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSuspend(user);
                        }}
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReactivate(user);
                        }}
                      >
                        Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <p>No users found matching your filters</p>
            </div>
          )}
        </div>
      </div>

      {selectedUser && (
        <div className="card mt-4">
          <h2 className="card-header">User Details - {selectedUser.name}</h2>

          <div className="grid grid-2">
            <div>
              <h3 className="font-semibold mb-2">Account Information</h3>
              <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                <div><strong>User ID:</strong> {selectedUser.userId}</div>
                <div><strong>Name:</strong> {selectedUser.name}</div>
                <div><strong>Role:</strong> {selectedUser.role}</div>
                <div><strong>Verification Weight:</strong> {selectedUser.verificationWeight}</div>
                <div><strong>Status:</strong> {selectedUser.status}</div>
                <div><strong>Registered:</strong> {selectedUser.registeredAt}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Activity Summary</h3>
              <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                <div><strong>Transactions Submitted:</strong> {selectedUser.transactionsSubmitted}</div>
                <div><strong>Verifications Given:</strong> {selectedUser.verificationsGiven}</div>
                <div><strong>Contribution Score:</strong> {selectedUser.verificationsGiven * selectedUser.verificationWeight}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
