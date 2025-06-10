// PendingApprovalPage.jsx - Page for users waiting for role assignment
import React, { useState, useEffect } from 'react';
import { FaClock, FaUserCheck, FaEnvelope, FaRefresh, FaHome } from 'react-icons/fa';

const PendingApprovalPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        
        // If user has been assigned a role, redirect
        if (userData.role && userData.role !== 'pending') {
          redirectToAppropriatePortal(userData.role);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const redirectToAppropriatePortal = (role) => {
    const redirectMap = {
      'admin': '/admin/dashboard',
      'vendor': '/vendor/dashboard', 
      'customer': '/customer/dashboard'
    };
    
    const redirectUrl = redirectMap[role] || '/dashboard';
    window.location.href = redirectUrl;
  };

  const checkStatus = async () => {
    setChecking(true);
    await fetchUserData();
    setChecking(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังตรวจสอบสถานะ...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">ไม่พบข้อมูลผู้ใช้</p>
          <a href="/auth/signin" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
            เข้าสู่ระบบอีกครั้ง
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaClock className="text-yellow-600 text-3xl animate-pulse" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          รอการอนุมัติบัญชี
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          บัญชีของคุณได้ถูกสร้างเรียบร้อยแล้ว แต่ยังรอการอนุมัติจากผู้ดูแลระบบ 
          เพื่อกำหนดสิทธิ์การเข้าใช้งาน
        </p>

        {/* User Info Card */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-3 mb-3">
            {user.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt={user.name} 
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <FaUserCheck className="text-gray-400" />
              </div>
            )}
            <div>
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <span>เข้าสู่ระบบผ่าน: {user.provider}</span>
            <span>•</span>
            <span>สถานะ: รอการอนุมัติ</span>
          </div>
        </div>

        {/* Process Steps */}
        <div className="text-left mb-6">
          <h3 className="font-medium text-gray-800 mb-3 text-center">ขั้นตอนการอนุมัติ:</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-sm text-gray-600">เข้าสู่ระบบด้วย Social Account</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <FaClock className="text-white text-xs animate-pulse" />
              </div>
              <span className="text-sm text-gray-600">รอผู้ดูแลระบบอนุมัติและกำหนดสิทธิ์</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <FaEnvelope className="text-white text-xs" />
              </div>
              <span className="text-sm text-gray-600">ได้รับการแจ้งเตือนทาง Email</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">4</span>
              </div>
              <span className="text-sm text-gray-600">เข้าใช้งานระบบได้ตามสิทธิ์ที่ได้รับ</span>
            </div>
          </div>
        </div>

        {/* Expected Roles */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-800 mb-2">สิทธิ์ที่อาจได้รับ:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-blue-700">👨‍💼 Admin</span>
              <span className="text-blue-600">จัดการระบบและ Vendors</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-700">🏪 Vendor</span>
              <span className="text-blue-600">ขายสินค้าในระบบ</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-700">👤 Customer</span>
              <span className="text-blue-600">ซื้อสินค้าในระบบ</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={checkStatus}
            disabled={checking}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <FaRefresh className={`${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'กำลังตรวจสอบ...' : 'ตรวจสอบสถานะอีกครั้ง'}</span>
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
          >
            <FaHome />
            <span>กลับไปหน้าหลัก</span>
          </button>
        </div>

        {/* Contact Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            หากมีข้อสงสัย กรุณาติดต่อ: 
            <a href="mailto:admin@sss-surplus.com" className="text-blue-600 hover:text-blue-700 ml-1">
              admin@sss-surplus.com
            </a>
          </p>
        </div>

        {/* Auto-refresh notice */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            หน้านี้จะตรวจสอบสถานะอัตโนมัติทุก 30 วินาที
          </p>
        </div>
      </div>
    </div>
  );
};

// Auto-refresh component
const AutoRefreshWrapper = ({ children }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      // Check if user is still on pending page
      if (window.location.pathname === '/pending-approval') {
        window.location.reload();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  return children;
};

const PendingApprovalPageWithAutoRefresh = () => (
  <AutoRefreshWrapper>
    <PendingApprovalPage />
  </AutoRefreshWrapper>
);

export default PendingApprovalPageWithAutoRefresh;

