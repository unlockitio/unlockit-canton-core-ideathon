import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cantonApi } from '../services/cantonApi';
import { useAuth } from '../context/AuthContext';
import { Contract } from '../types/canton';
import { TemplateIds } from '../utils/daml';

interface UserAccountData {
  operator: string;
  user: string;
  role: { tag: string } | string;
  verificationWeight: number;
  credentialPresentations: string[];
  registeredAt: string;
  status: { tag: string } | string;
}

interface UserDisplay {
  contractId: string;
  contract: Contract<UserAccountData>;
  userParty: string;
  userName: string;
  role: string;
  verificationWeight: number;
  status: string;
  registeredAt: string;
  credentialCount: number;
}

export default function AdminUsers() {
  const { party, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<UserDisplay[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedUser, setSelectedUser] = useState<UserDisplay | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch UserAccount contracts from Canton
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAuthenticated || !party) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');

        // Query for UserAccount contracts
        const userAccountContracts = await cantonApi.query<UserAccountData>(
          TemplateIds.UserAccount
        );

        console.log('Found user accounts:', userAccountContracts);

        // Transform to display format
        const displayUsers: UserDisplay[] = userAccountContracts.map(contract => {
          const role = typeof contract.payload.role === 'object'
            ? contract.payload.role.tag
            : contract.payload.role;

          const status = typeof contract.payload.status === 'object'
            ? contract.payload.status.tag
            : contract.payload.status;

          // Extract user name from party ID (format: "alice-9b3970be::...")
          const userName = contract.payload.user.split('::')[0].split('-')[0] || contract.payload.user;

          return {
            contractId: contract.contractId,
            contract: contract,
            userParty: contract.payload.user,
            userName: userName,
            role: role,
            verificationWeight: contract.payload.verificationWeight,
            status: status.replace('Account', ''), // "AccountActive" -> "Active"
            registeredAt: contract.payload.registeredAt,
            credentialCount: contract.payload.credentialPresentations.length
          };
        });

        setUsers(displayUsers);
      } catch (err) {
        console.error('Error fetching user accounts:', err);
        setError('Failed to load user accounts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [isAuthenticated, party]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userParty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSuspend = async (user: UserDisplay) => {
    if (!confirm(`Suspend account for ${user.userName}?`)) {
      return;
    }

    try {
      // Exercise SuspendAccount choice
      await cantonApi.exercise(
        TemplateIds.UserAccount,
        user.contractId,
        'SuspendAccount',
        {}
      );

      alert(`Account suspended: ${user.userName}`);

      // Refresh the list
      const updatedUsers = users.map(u =>
        u.contractId === user.contractId
          ? { ...u, status: 'Suspended' }
          : u
      );
      setUsers(updatedUsers);
      setSelectedUser(null);
    } catch (error) {
      console.error('Suspension failed:', error);
      alert(`Failed to suspend account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleReactivate = async (user: UserDisplay) => {
    if (!confirm(`Reactivate account for ${user.userName}?`)) {
      return;
    }

    try {
      // Exercise ReactivateAccount choice
      await cantonApi.exercise(
        TemplateIds.UserAccount,
        user.contractId,
        'ReactivateAccount',
        {}
      );

      alert(`Account reactivated: ${user.userName}`);

      // Refresh the list
      const updatedUsers = users.map(u =>
        u.contractId === user.contractId
          ? { ...u, status: 'Active' }
          : u
      );
      setUsers(updatedUsers);
      setSelectedUser(null);
    } catch (error) {
      console.error('Reactivation failed:', error);
      alert(`Failed to reactivate account: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

      {error && <div className="alert alert-error">{error}</div>}

      {isLoading ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">⏳</div>
            <p>Loading user accounts...</p>
          </div>
        </div>
      ) : (
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
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Credentials</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.contractId}
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      background: selectedUser?.contractId === user.contractId ? '#f7fafc' : 'white',
                    }}
                    onClick={() => setSelectedUser(user)}
                  >
                    <td style={{ padding: '1rem' }}>
                      <div className="font-semibold">{user.userName}</div>
                      <div className="text-sm text-muted">{user.userParty.substring(0, 20)}...</div>
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
                      {new Date(user.registeredAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                      <span className="badge badge-info">{user.credentialCount}</span>
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
      )}

      {selectedUser && (
        <div className="card mt-4">
          <h2 className="card-header">User Details - {selectedUser.userName}</h2>

          <div className="grid grid-2">
            <div>
              <h3 className="font-semibold mb-2">Account Information</h3>
              <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                <div><strong>User Name:</strong> {selectedUser.userName}</div>
                <div><strong>Party ID:</strong> <span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{selectedUser.userParty}</span></div>
                <div><strong>Role:</strong> {selectedUser.role}</div>
                <div><strong>Verification Weight:</strong> {selectedUser.verificationWeight}</div>
                <div><strong>Status:</strong> {selectedUser.status}</div>
                <div><strong>Registered:</strong> {new Date(selectedUser.registeredAt).toLocaleString()}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Credential Information</h3>
              <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                <div><strong>Total Credentials:</strong> {selectedUser.credentialCount}</div>
                <div><strong>Contract ID:</strong> <span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{selectedUser.contractId.substring(0, 30)}...</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
