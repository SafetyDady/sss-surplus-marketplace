// Enhanced Admin Login Component with Social Login
import React, { useState } from 'react';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { SiLine } from 'react-icons/si';

const EnhancedAdminLogin = () => {
  const [loginType, setLoginType] = useState('admin'); // 'admin' or 'super_admin'
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    try {
      // Redirect to social login
      window.location.href = `/api/auth/${provider}?type=${loginType}`;
    } catch (error) {
      console.error('Social login error:', error);
      setLoading(false);
    }
  };

  const handleCredentialLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/super-admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        window.location.href = data.redirectTo || '/admin/super/dashboard';
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">
              {loginType === 'super_admin' ? 'SA' : 'A'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {loginType === 'super_admin' ? 'Super Admin Portal' : 'Admin Portal'}
          </h1>
          <p className="text-gray-600 mt-2">
            {loginType === 'super_admin' 
              ? 'ระบบจัดการสำหรับผู้ดูแลระบบสูงสุด' 
              : 'ระบบจัดการสำหรับผู้ดูแลระบบ'
            }
          </p>
        </div>

        {/* Login Type Selector */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setLoginType('admin')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              loginType === 'admin'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => setLoginType('super_admin')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              loginType === 'super_admin'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Super Admin
          </button>
        </div>

        {/* Super Admin Credential Login */}
        {loginType === 'super_admin' && (
          <form onSubmit={handleCredentialLogin} className="space-y-4 mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <span className="text-yellow-600 mr-2">🔒</span>
                <span className="text-sm text-yellow-800">
                  ต้นที่โลคอลกิ่นสำหรับผู้ดูแลระบบเท่านั้น
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                อีเมลผู้ดูแลระบบ
              </label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
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
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ SUPER ADMIN'}
            </button>
          </form>
        )}

        {/* Admin Social Login */}
        {loginType === 'admin' && (
          <div className="space-y-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <span className="text-blue-600 mr-2">ℹ️</span>
                <span className="text-sm text-blue-800">
                  เข้าสู่ระบบด้วย Social Account แล้วรอการ Assign Role
                </span>
              </div>
            </div>

            <div className="text-center text-gray-600 mb-4">
              หรือเข้าสู่ระบบด้วย
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <FaGoogle className="text-red-500 mr-3" />
                <span className="text-gray-700">เข้าสู่ระบบด้วย Google</span>
              </button>

              <button
                onClick={() => handleSocialLogin('facebook')}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <FaFacebook className="text-blue-600 mr-3" />
                <span className="text-gray-700">เข้าสู่ระบบด้วย Facebook</span>
              </button>

              <button
                onClick={() => handleSocialLogin('line')}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <SiLine className="text-green-500 mr-3" />
                <span className="text-gray-700">เข้าสู่ระบบด้วย Line</span>
              </button>
            </div>
          </div>
        )}

        {/* Role Assignment Info */}
        {loginType === 'admin' && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-800 mb-2">ขั้นตอนการได้รับสิทธิ์ Admin:</h3>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. เข้าสู่ระบบด้วย Social Account</li>
              <li>2. รอ Super Admin assign role "Admin"</li>
              <li>3. ได้รับการแจ้งเตือน</li>
              <li>4. เข้าสู่ระบบอีกครั้งเพื่อใช้งาน Admin Panel</li>
            </ol>
          </div>
        )}

        {/* Super Admin Info */}
        {loginType === 'super_admin' && (
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-medium text-purple-800 mb-2">ขั้นตอนหลัง Login สำเร็จ:</h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• จัดการ Admin และ Vendor</li>
              <li>• Assign roles ให้ผู้ใช้ใหม่</li>
              <li>• ตั้งค่าระบบขั้นสูง</li>
              <li>• ดูรายงานและ Analytics</li>
            </ul>
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

export default EnhancedAdminLogin;

