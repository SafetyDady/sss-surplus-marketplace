// AdminMainDashboard.jsx - Complete Admin Dashboard
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const AdminMainDashboard = () => {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingApprovals: 0,
    monthlyRevenue: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();
      setStats(data.stats);
      setRecentActivities(data.recentActivities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session?.user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {session?.user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon="👥"
            color="blue"
            change="+12%"
          />
          <StatCard
            title="Active Vendors"
            value={stats.totalVendors}
            icon="🏪"
            color="green"
            change="+8%"
          />
          <StatCard
            title="Products"
            value={stats.totalProducts}
            icon="📦"
            color="purple"
            change="+15%"
          />
          <StatCard
            title="Orders"
            value={stats.totalOrders}
            icon="🛒"
            color="orange"
            change="+23%"
          />
          <StatCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon="⏳"
            color="yellow"
            change="-5%"
          />
          <StatCard
            title="Monthly Revenue"
            value={`฿${stats.monthlyRevenue.toLocaleString()}`}
            icon="💰"
            color="emerald"
            change="+18%"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <ActivityItem key={index} activity={activity} />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <QuickActionButton
                  icon="👤"
                  title="Add New User"
                  description="Create new user account"
                  onClick={() => window.location.href = '/admin/users/new'}
                />
                <QuickActionButton
                  icon="🏪"
                  title="Approve Vendor"
                  description="Review pending vendors"
                  onClick={() => window.location.href = '/admin/vendors/pending'}
                />
                <QuickActionButton
                  icon="📦"
                  title="Manage Products"
                  description="Review and approve products"
                  onClick={() => window.location.href = '/admin/products'}
                />
                <QuickActionButton
                  icon="📊"
                  title="View Reports"
                  description="Generate analytics reports"
                  onClick={() => window.location.href = '/admin/reports'}
                />
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
              <div className="space-y-3">
                <StatusItem label="Database" status="healthy" />
                <StatusItem label="Email Service" status="healthy" />
                <StatusItem label="OAuth Providers" status="healthy" />
                <StatusItem label="File Storage" status="warning" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* User Growth Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Growth</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Chart placeholder - User growth over time</p>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue Trends</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Chart placeholder - Revenue trends</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon, color, change }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    emerald: 'bg-emerald-50 text-emerald-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          <p className={`text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change} from last month
          </p>
        </div>
      </div>
    </div>
  );
};

// ActivityItem Component
const ActivityItem = ({ activity }) => {
  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
      <div className="flex-shrink-0">
        <span className="text-2xl">{activity.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
        <p className="text-sm text-gray-500">{activity.description}</p>
        <p className="text-xs text-gray-400">{activity.timestamp}</p>
      </div>
    </div>
  );
};

// QuickActionButton Component
const QuickActionButton = ({ icon, title, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
    >
      <div className="flex items-center space-x-3">
        <span className="text-xl">{icon}</span>
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </button>
  );
};

// StatusItem Component
const StatusItem = ({ label, status }) => {
  const statusColors = {
    healthy: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  };

  const statusIcons = {
    healthy: '✅',
    warning: '⚠️',
    error: '❌'
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-900">{label}</span>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {statusIcons[status]} {status}
      </span>
    </div>
  );
};

export default AdminMainDashboard;

