// AdminVendorSocialLogin.jsx - Enhanced Social Login for Admin/Vendor
import React, { useState, useEffect } from 'react';

const AdminVendorSocialLogin = () => {
  const [loginType, setLoginType] = useState('admin'); // 'admin' or 'vendor' or 'super_admin'
  const [loading, setLoading] = useState(false);
  const [superAdminCredentials, setSuperAdminCredentials] = useState({
    email: '',
    password: ''
  });

  // Handle Social Login
  const handleSocialLogin = async (provider) => {
    setLoading(true);
    try {
      // Store login type in sessionStorage for callback handling
      sessionStorage.setItem('pendingLoginType', loginType);
      
      // Redirect to social login with type parameter
      const callbackUrl = `${window.location.origin}/auth/callback`;
      const loginUrl = `/api/auth/signin/${provider}?callbackUrl=${encodeURIComponent(callbackUrl)}&type=${loginType}`;
      
      window.location.href = loginUrl;
    } catch (error) {
      console.error('Social login error:', error);
      setLoading(false);
      alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    }
  };

  // Handle Super Admin Login
  const handleSuperAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/super-admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(superAdminCredentials)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store token
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        // Redirect to dashboard
        window.location.href = data.redirectTo || '/admin/super/dashboard';
      } else {
        alert(data.message || 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง');
      }
    } catch (error) {
      console.error('Super admin login error:', error);
      alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  // Get login type configuration
  const getLoginConfig = () => {
    const configs = {
      admin: {
        icon: '👨‍💼',
        title: 'Admin Portal',
        subtitle: 'ระบบจัดการสำหรับผู้ดูแลระบบ',
        color: 'blue',
        gradient: 'from-blue-600 to-blue-700'
      },
      vendor: {
        icon: '🏪',
        title: 'Vendor Portal', 
        subtitle: 'ระบบจัดการสำหรับผู้ขาย',
        color: 'green',
        gradient: 'from-green-600 to-green-700'
      },
      super_admin: {
        icon: '👑',
        title: 'Super Admin Portal',
        subtitle: 'ระบบจัดการสำหรับผู้ดูแลระบบสูงสุด',
        color: 'purple',
        gradient: 'from-purple-600 to-purple-700'
      }
    };
    return configs[loginType] || configs.admin;
  };

  const config = getLoginConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 bg-gradient-to-r ${config.gradient} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <span className="text-white text-2xl">
              {config.icon}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {config.title}
          </h1>
          <p className="text-gray-600 mt-2">
            {config.subtitle}
          </p>
        </div>

        {/* Login Type Selector */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setLoginType('admin')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
              loginType === 'admin'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className="inline mr-1">👨‍💼</span>
            Admin
          </button>
          <button
            onClick={() => setLoginType('vendor')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
              loginType === 'vendor'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className="inline mr-1">🏪</span>
            Vendor
          </button>
          <button
            onClick={() => setLoginType('super_admin')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
              loginType === 'super_admin'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className="inline mr-1">👑</span>
            Super
          </button>
        </div>

        {/* Super Admin Credential Login */}
        {loginType === 'super_admin' && (
          <form onSubmit={handleSuperAdminLogin} className="space-y-4 mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <span className="text-yellow-600 mr-2">🔒</span>
                <span className="text-sm text-yellow-800">
                  เข้าสู่ระบบด้วย Environment Credentials
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                อีเมลผู้ดูแลระบบ
              </label>
              <input
                type="email"
                value={superAdminCredentials.email}
                onChange={(e) => setSuperAdminCredentials({
                  ...superAdminCredentials, 
                  email: e.target.value
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="sanchai5651@gmail.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รหัสผ่าน
              </label>
              <input
                type="password"
                value={superAdminCredentials.password}
                onChange={(e) => setSuperAdminCredentials({
                  ...superAdminCredentials, 
                  password: e.target.value
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r ${config.gradient} text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ SUPER ADMIN'}
            </button>
          </form>
        )}

        {/* Social Login for Admin/Vendor */}
        {(loginType === 'admin' || loginType === 'vendor') && (
          <div className="space-y-4 mb-6">
            <div className={`bg-${config.color}-50 border border-${config.color}-200 rounded-lg p-3 mb-4`}>
              <div className="flex items-center">
                <span className={`text-${config.color}-600 mr-2`}>ℹ️</span>
                <span className={`text-sm text-${config.color}-800`}>
                  เข้าสู่ระบบด้วย Social Account แล้วรอการ Assign Role
                </span>
              </div>
            </div>

            <div className="text-center text-gray-600 mb-4">
              เข้าสู่ระบบด้วย
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 group"
              >
                <span className="text-red-500 mr-3 group-hover:scale-110 transition-transform">🔍</span>
                <span className="text-gray-700">เข้าสู่ระบบด้วย Google</span>
              </button>

              <button
                onClick={() => handleSocialLogin('facebook')}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 group"
              >
                <span className="text-blue-600 mr-3 group-hover:scale-110 transition-transform">📘</span>
                <span className="text-gray-700">เข้าสู่ระบบด้วย Facebook</span>
              </button>

              <button
                onClick={() => handleSocialLogin('line')}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 group"
              >
                <span className="text-green-500 mr-3 group-hover:scale-110 transition-transform">💬</span>
                <span className="text-gray-700">เข้าสู่ระบบด้วย Line</span>
              </button>
            </div>
          </div>
        )}

        {/* Role Assignment Info */}
        {(loginType === 'admin' || loginType === 'vendor') && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-800 mb-2">
              ขั้นตอนการได้รับสิทธิ์ {loginType === 'admin' ? 'Admin' : 'Vendor'}:
            </h3>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. เข้าสู่ระบบด้วย Social Account</li>
              <li>2. รอ {loginType === 'admin' ? 'Super Admin' : 'Admin'} assign role</li>
              <li>3. ได้รับการแจ้งเตือนทาง Email</li>
              <li>4. เข้าสู่ระบบอีกครั้งเพื่อใช้งาน {loginType === 'admin' ? 'Admin' : 'Vendor'} Panel</li>
            </ol>
          </div>
        )}

        {/* Super Admin Info */}
        {loginType === 'super_admin' && (
          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-purple-800 mb-2">สิทธิ์ Super Admin:</h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• จัดการ Admin และ Vendor ทั้งหมด</li>
              <li>• Assign roles ให้ผู้ใช้ใหม่</li>
              <li>• ตั้งค่าระบบขั้นสูง</li>
              <li>• ดูรายงานและ Analytics ทั้งหมด</li>
              <li>• จัดการ System Configuration</li>
            </ul>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">กำลังเข้าสู่ระบบ...</span>
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            ← กลับไปหน้าหลัก
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminVendorSocialLogin;

