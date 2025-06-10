// Pending Role Notification Component
import React, { useState, useEffect } from 'react';
import { FaClock, FaUserCheck, FaEnvelope } from 'react-icons/fa';

const PendingRoleNotification = ({ user }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaClock className="text-yellow-600 text-3xl" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          รอการอนุมัติบัญชี
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          บัญชีของคุณได้ถูกสร้างเรียบร้อยแล้ว แต่ยังรอการอนุมัติจาก Super Admin 
          เพื่อกำหนดสิทธิ์การเข้าใช้งาน
        </p>

        {/* User Info */}
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
          <div className="text-xs text-gray-500">
            เข้าสู่ระบบผ่าน: {user.provider}
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
                <FaClock className="text-white text-xs" />
              </div>
              <span className="text-sm text-gray-600">รอ Super Admin อนุมัติและกำหนดสิทธิ์</span>
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
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            ตรวจสอบสถานะอีกครั้ง
          </button>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            {showDetails ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียดเพิ่มเติม'}
          </button>
        </div>

        {/* Additional Details */}
        {showDetails && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
            <h4 className="font-medium text-gray-800 mb-3">ข้อมูลเพิ่มเติม:</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <strong>User ID:</strong> {user.id}
              </div>
              <div>
                <strong>สร้างบัญชีเมื่อ:</strong> {new Date(user.created_at).toLocaleString('th-TH')}
              </div>
              <div>
                <strong>Provider ID:</strong> {user.provider_id}
              </div>
              <div>
                <strong>สถานะ:</strong> รอการอนุมัติ
              </div>
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            หากมีข้อสงสัย กรุณาติดต่อ: admin@sss-surplus.com
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-4">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
          >
            ← กลับไปหน้าหลัก
          </a>
        </div>
      </div>
    </div>
  );
};

// Success Notification Component
const RoleAssignedNotification = ({ user, newRole }) => {
  const getRoleInfo = (role) => {
    const roleMap = {
      admin: {
        icon: '👨‍💼',
        title: 'Admin',
        description: 'คุณสามารถจัดการระบบและ Vendors ได้',
        redirectUrl: '/admin/dashboard',
        color: 'blue'
      },
      vendor: {
        icon: '🏪',
        title: 'Vendor',
        description: 'คุณสามารถขายสินค้าในระบบได้',
        redirectUrl: '/vendor/dashboard',
        color: 'green'
      },
      customer: {
        icon: '👤',
        title: 'Customer',
        description: 'คุณสามารถซื้อสินค้าในระบบได้',
        redirectUrl: '/customer/dashboard',
        color: 'gray'
      }
    };
    return roleMap[role] || roleMap.customer;
  };

  const roleInfo = getRoleInfo(newRole);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
        {/* Success Icon */}
        <div className={`w-20 h-20 bg-${roleInfo.color}-100 rounded-full flex items-center justify-center mx-auto mb-6`}>
          <span className="text-4xl">{roleInfo.icon}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          🎉 ยินดีด้วย!
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          บัญชีของคุณได้รับการอนุมัติแล้ว คุณได้รับสิทธิ์เป็น <strong>{roleInfo.title}</strong>
        </p>

        {/* Role Info */}
        <div className={`bg-${roleInfo.color}-50 rounded-lg p-4 mb-6`}>
          <h3 className={`font-medium text-${roleInfo.color}-800 mb-2`}>
            สิทธิ์ที่ได้รับ: {roleInfo.title}
          </h3>
          <p className={`text-sm text-${roleInfo.color}-700`}>
            {roleInfo.description}
          </p>
        </div>

        {/* User Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-3">
            {user.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt={user.name} 
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">{roleInfo.icon}</span>
              </div>
            )}
            <div>
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-${roleInfo.color}-100 text-${roleInfo.color}-800 mt-1`}>
                {roleInfo.title}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => window.location.href = roleInfo.redirectUrl}
          className={`w-full bg-${roleInfo.color}-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-${roleInfo.color}-700 transition-colors mb-4`}
        >
          เข้าสู่ {roleInfo.title} Dashboard
        </button>

        {/* Back to Home */}
        <div className="text-center">
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

export { PendingRoleNotification, RoleAssignedNotification };

