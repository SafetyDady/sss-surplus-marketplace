// Role Assignment Dashboard for Super Admin
import React, { useState, useEffect } from 'react';
import { FaUser, FaUserTie, FaStore, FaCrown, FaCheck, FaTimes, FaEye } from 'react-icons/fa';

const RoleAssignmentDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('pending');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      const data = await response.json();
      
      setPendingUsers(data.users.filter(user => user.role === 'pending'));
      setAllUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (userId, role) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ role })
      });

      if (response.ok) {
        fetchUsers(); // Refresh data
        alert(`Role "${role}" assigned successfully!`);
      } else {
        alert('Failed to assign role');
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      alert('Error assigning role');
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'super_admin': return <FaCrown className="text-purple-600" />;
      case 'admin': return <FaUserTie className="text-blue-600" />;
      case 'vendor': return <FaStore className="text-green-600" />;
      case 'customer': return <FaUser className="text-gray-600" />;
      default: return <FaUser className="text-gray-400" />;
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      super_admin: 'bg-purple-100 text-purple-800',
      admin: 'bg-blue-100 text-blue-800',
      vendor: 'bg-green-100 text-green-800',
      customer: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[role] || colors.pending}`}>
        {role === 'pending' ? 'รอการอนุมัติ' : role.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const UserCard = ({ user, showActions = true }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-12 h-12 rounded-full" />
            ) : (
              <FaUser className="text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              {getRoleIcon(user.role)}
              {getRoleBadge(user.role)}
            </div>
          </div>
        </div>
        
        {showActions && user.role === 'pending' && (
          <div className="flex space-x-2">
            <button
              onClick={() => assignRole(user.id, 'admin')}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
              title="Assign as Admin"
            >
              Admin
            </button>
            <button
              onClick={() => assignRole(user.id, 'vendor')}
              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
              title="Assign as Vendor"
            >
              Vendor
            </button>
            <button
              onClick={() => assignRole(user.id, 'customer')}
              className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
              title="Assign as Customer"
            >
              Customer
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        <div>Provider: {user.provider}</div>
        <div>Joined: {new Date(user.created_at).toLocaleDateString('th-TH')}</div>
        {user.assigned_at && (
          <div>Assigned: {new Date(user.assigned_at).toLocaleDateString('th-TH')}</div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <FaCrown className="text-purple-600 text-2xl" />
              <h1 className="text-xl font-semibold text-gray-900">Super Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Role Assignment Management</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FaUser className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Users</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingUsers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUserTie className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {allUsers.filter(u => u.role === 'admin').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaStore className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vendors</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {allUsers.filter(u => u.role === 'vendor').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <FaUser className="text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {allUsers.filter(u => u.role === 'customer').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setSelectedTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'pending'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Pending Users ({pendingUsers.length})
              </button>
              <button
                onClick={() => setSelectedTab('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'all'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                All Users ({allUsers.length})
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {selectedTab === 'pending' && (
              <div>
                {pendingUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <FaCheck className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No pending users</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      All users have been assigned roles.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingUsers.map(user => (
                      <UserCard key={user.id} user={user} showActions={true} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'all' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allUsers.map(user => (
                  <UserCard key={user.id} user={user} showActions={false} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleAssignmentDashboard;

