'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../components/AuthProvider';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { 
  createAdminUser, 
  getAllAdminUsers, 
  updateAdminUser, 
  deactivateAdminUser,
  ADMIN_ROLES,
  DEFAULT_ADMIN
} from '../../../lib/auth';

export default function AdminSetupPage() {
  const { adminData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: ADMIN_ROLES.MODERATOR
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadAdminUsers();
  }, []);

  const loadAdminUsers = async () => {
    try {
      const users = await getAllAdminUsers();
      setAdminUsers(users);
    } catch (error) {
      console.error('Error loading admin users:', error);
    }
  };

  const handleCreateDefaultAdmin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await createAdminUser(DEFAULT_ADMIN.email, DEFAULT_ADMIN.password, {
        name: DEFAULT_ADMIN.name,
        role: DEFAULT_ADMIN.role,
        createdBy: 'system'
      });
      
      setSuccess('สร้าง Admin เริ่มต้นเรียบร้อยแล้ว! กรุณา Login ด้วย admin@sss-supply.com');
      loadAdminUsers();
    } catch (error) {
      console.error('Error creating default admin:', error);
      setError(error.message || 'เกิดข้อผิดพลาดในการสร้าง Admin');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await createAdminUser(formData.email, formData.password, {
        name: formData.name,
        role: formData.role,
        createdBy: adminData?.name || 'admin'
      });
      
      setSuccess('สร้าง Admin ใหม่เรียบร้อยแล้ว!');
      setShowCreateForm(false);
      setFormData({
        email: '',
        password: '',
        name: '',
        role: ADMIN_ROLES.MODERATOR
      });
      loadAdminUsers();
    } catch (error) {
      console.error('Error creating admin:', error);
      setError(error.message || 'เกิดข้อผิดพลาดในการสร้าง Admin');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (uid, newRole) => {
    try {
      await updateAdminUser(uid, { role: newRole });
      setSuccess('อัพเดทสิทธิ์เรียบร้อยแล้ว!');
      loadAdminUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      setError('เกิดข้อผิดพลาดในการอัพเดทสิทธิ์');
    }
  };

  const handleDeactivate = async (uid) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะปิดการใช้งานบัญชีนี้?')) return;

    try {
      await deactivateAdminUser(uid);
      setSuccess('ปิดการใช้งานบัญชีเรียบร้อยแล้ว!');
      loadAdminUsers();
    } catch (error) {
      console.error('Error deactivating user:', error);
      setError('เกิดข้อผิดพลาดในการปิดการใช้งานบัญชี');
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      [ADMIN_ROLES.SUPER_ADMIN]: { color: 'bg-red-100 text-red-800', text: 'Super Admin' },
      [ADMIN_ROLES.ADMIN]: { color: 'bg-blue-100 text-blue-800', text: 'Admin' },
      [ADMIN_ROLES.MODERATOR]: { color: 'bg-green-100 text-green-800', text: 'Moderator' }
    };
    
    const config = roleConfig[role] || roleConfig[ADMIN_ROLES.MODERATOR];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('th-TH') + ' ' + date.toLocaleTimeString('th-TH');
  };

  return (
    <ProtectedRoute requiredPermission="all">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <h1 className="text-3xl font-bold text-gray-900">Admin Setup & Management</h1>
              <p className="mt-2 text-gray-600">จัดการบัญชี Admin และสิทธิ์การเข้าถึง</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Messages */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-700">{success}</span>
              </div>
            </div>
          )}

          {/* Quick Setup */}
          {adminUsers.length === 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">🚀 เริ่มต้นใช้งาน</h2>
              <p className="text-gray-600 mb-6">
                ยังไม่มีบัญชี Admin ในระบบ กรุณาสร้างบัญชี Admin เริ่มต้นเพื่อเริ่มใช้งาน
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-900 mb-2">ข้อมูล Admin เริ่มต้น:</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <div><strong>Email:</strong> {DEFAULT_ADMIN.email}</div>
                  <div><strong>Password:</strong> {DEFAULT_ADMIN.password}</div>
                  <div><strong>Role:</strong> Super Admin</div>
                </div>
              </div>

              <button
                onClick={handleCreateDefaultAdmin}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'กำลังสร้าง...' : '🔑 สร้าง Admin เริ่มต้น'}
              </button>
            </div>
          )}

          {/* Admin Users List */}
          {adminUsers.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">บัญชี Admin ทั้งหมด</h2>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  ➕ เพิ่ม Admin ใหม่
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ผู้ใช้
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        สิทธิ์
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        สถานะ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        เข้าสู่ระบบล่าสุด
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        วันที่สร้าง
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        การดำเนินการ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {adminUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium">
                                {user.name?.charAt(0) || 'A'}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {adminData?.role === ADMIN_ROLES.SUPER_ADMIN ? (
                            <select
                              value={user.role}
                              onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value={ADMIN_ROLES.MODERATOR}>Moderator</option>
                              <option value={ADMIN_ROLES.ADMIN}>Admin</option>
                              <option value={ADMIN_ROLES.SUPER_ADMIN}>Super Admin</option>
                            </select>
                          ) : (
                            getRoleBadge(user.role)
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'ใช้งาน' : 'ปิดใช้งาน'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.lastLogin)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {adminData?.role === ADMIN_ROLES.SUPER_ADMIN && user.id !== adminData?.uid && (
                            <button
                              onClick={() => handleDeactivate(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              ปิดใช้งาน
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Create Admin Form Modal */}
          {showCreateForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">เพิ่ม Admin ใหม่</h3>
                  
                  <form onSubmit={handleCreateAdmin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ชื่อ-นามสกุล
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="ชื่อ Admin"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        อีเมล
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="admin@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        รหัสผ่าน
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                        minLength={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        สิทธิ์
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value={ADMIN_ROLES.MODERATOR}>Moderator</option>
                        <option value={ADMIN_ROLES.ADMIN}>Admin</option>
                        {adminData?.role === ADMIN_ROLES.SUPER_ADMIN && (
                          <option value={ADMIN_ROLES.SUPER_ADMIN}>Super Admin</option>
                        )}
                      </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? 'กำลังสร้าง...' : 'สร้าง Admin'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Role Permissions Info */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">สิทธิ์การเข้าถึง</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    Moderator
                  </span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• จัดการข้อความติดต่อ</li>
                  <li>• ตอบกลับลูกค้า</li>
                  <li>• ดูสถิติพื้นฐาน</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    Admin
                  </span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• สิทธิ์ Moderator ทั้งหมด</li>
                  <li>• จัดการ Vendor</li>
                  <li>• ดูรายงานและสถิติ</li>
                  <li>• อนุมัติ/ปฏิเสธใบสมัคร</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                    Super Admin
                  </span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• สิทธิ์ Admin ทั้งหมด</li>
                  <li>• จัดการบัญชี Admin</li>
                  <li>• เปลี่ยนสิทธิ์ผู้ใช้</li>
                  <li>• ปิดใช้งานบัญชี</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

