// SuperAdminDashboard.jsx - Dashboard for Super Admin role assignment
import React, { useState, useEffect } from 'react';
import { 
  FaCrown, FaUser, FaUserTie, FaStore, FaCheck, FaTimes, 
  FaEye, FaSearch, FaFilter, FaBell, FaChartBar 
} from 'react-icons/fa';

const SuperAdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [stats, setStats] = useState({
    pending: 0,
    admins: 0,
    vendors: 0,
    customers: 0
  });

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
      
      if (response.ok) {
        const data = await response.json();
        const users = data.users || [];
        
        setPendingUsers(users.filter(user => user.role === 'pending'));
        setAllUsers(users);
        
        // Calculate stats
        setStats({
          pending: users.filter(u => u.role === 'pending').length,
          admins: users.filter(u => u.role === 'admin').length,
          vendors: users.filter(u => u.role === 'vendor').length,
          customers: users.filter(u => u.role === 'customer').length
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (userId, role, reason = '') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ role, reason })
      });

      if (response.ok) {
        await fetchUsers(); // Refresh data
        
        // Show success notification
        showNotification(`Role "${role}" assigned successfully!`, 'success');
        
        // Send email notification to user
        await sendRoleNotification(userId, role);
      } else {
        const error = await response.json();
        showNotification(error.message || 'Failed to assign role', 'error');
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      showNotification('Error assigning role', 'error');
    }
  };

  const sendRoleNotification = async (userId, role) => {
    try {
      await fetch('/api/admin/send-role-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ userId, role })
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const showNotification = (message, type) => {
    // Simple notification - can be replaced with toast library
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const getRoleIcon = (role) => {
    const icons = {
      super_admin: <FaCrown className="text-purple-600" />,
      admin: <FaUserTie className="text-blue-600" />,
      vendor: <FaStore className="text-green-600" />,
      customer: <FaUser className="text-gray-600" />,
      pending: <FaUser className="text-yellow-600" />
    };
    return icons[role] || icons.pending;
  };

  const getRoleBadge = (role) => {
    const colors = {
      super_admin: 'bg-purple-100 text-purple-800',
      admin: 'bg-blue-100 text-blue-800',
      vendor: 'bg-green-100 text-green-800',
      customer: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };

    const labels = {
      super_admin: 'Super Admin',
      admin: 'Admin',
      vendor: 'Vendor',
      customer: 'Customer',
      pending: 'รอการอนุมัติ'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[role] || colors.pending}`}>
        {labels[role] || 'Unknown'}
      </span>
    );
  };

  const filteredUsers = () => {
    let users = selectedTab === 'pending' ? pendingUsers : allUsers;
    
    if (searchTerm) {
      users = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterRole !== 'all') {
      users = users.filter(user => user.role === filterRole);
    }
    
    return users;
  };

  const UserCard = ({ user, showActions = true }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-12 h-12 rounded-full" />
            ) : (
              getRoleIcon(user.role)
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
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => assignRole(user.id, 'admin')}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
              title="Assign as Admin"
            >
              👨‍💼 Admin
            </button>
            <button
              onClick={() => assignRole(user.id, 'vendor')}
              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
              title="Assign as Vendor"
            >
              🏪 Vendor
            </button>
            <button
              onClick={() => assignRole(user.id, 'customer')}
              className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
              title="Assign as Customer"
            >
              👤 Customer
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-3 text-xs text-gray-500 space-y-1">
        <div className="flex justify-between">
          <span>Provider:</span>
          <span className="font-medium">{user.provider}</span>
        </div>
        <div className="flex justify-between">
          <span>Joined:</span>
          <span>{new Date(user.created_at).toLocaleDateString('th-TH')}</span>
        </div>
        {user.assigned_at && (
          <div className="flex justify-between">
            <span>Assigned:</span>
            <span>{new Date(user.assigned_at).toLocaleDateString('th-TH')}</span>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
              <div className="relative">
                <FaBell className="text-gray-400 text-xl" />
                {stats.pending > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {stats.pending}
                  </span>
                )}
              </div>
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
                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{stats.admins}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{stats.vendors}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{stats.customers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Tabs and Filters */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setSelectedTab('pending')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === 'pending'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Pending Users ({stats.pending})
                </button>
                <button
                  onClick={() => setSelectedTab('all')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === 'all'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  All Users ({allUsers.length})
                </button>
              </nav>

              <div className="flex space-x-3">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                {selectedTab === 'all' && (
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="vendor">Vendor</option>
                    <option value="customer">Customer</option>
                    <option value="pending">Pending</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {filteredUsers().length === 0 ? (
              <div className="text-center py-12">
                <FaCheck className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {selectedTab === 'pending' ? 'No pending users' : 'No users found'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedTab === 'pending' 
                    ? 'All users have been assigned roles.' 
                    : 'Try adjusting your search or filter criteria.'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers().map(user => (
                  <UserCard 
                    key={user.id} 
                    user={user} 
                    showActions={selectedTab === 'pending'} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

