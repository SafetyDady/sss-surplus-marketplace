'use client';

import React from 'react';
import { useAuth } from '../../../components/AuthProvider';
import { signOutAdmin } from '../../../lib/auth';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function AdminDashboard() {
  const { adminData } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOutAdmin();
      router.push('/admin/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">MTP Supply</span>
              </div>
              <div className="flex items-center space-x-4">
                {/* User Info */}
                {adminData && (
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{adminData.name}</div>
                      <div className="text-xs text-gray-500">{adminData.role}</div>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {adminData.name?.charAt(0) || 'A'}
                      </span>
                    </div>
                  </div>
                )}
                
                <a
                  href="/admin/setup"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  ⚙️ Setup
                </a>
                
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  ออกจากระบบ
                </button>
                
                <a
                  href="/"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  🌐 ดูเว็บไซต์
                </a>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">👥</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">ผู้ใช้ทั้งหมด</p>
                  <p className="text-2xl font-semibold text-gray-900">1,234</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">📦</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">สินค้าทั้งหมด</p>
                  <p className="text-2xl font-semibold text-gray-900">567</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">🛒</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">คำสั่งซื้อ</p>
                  <p className="text-2xl font-semibold text-gray-900">89</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">📄</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">หน้า About Us</p>
                  <p className="text-2xl font-semibold text-gray-900">1</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">จัดการผู้ใช้</h3>
              <p className="text-gray-600 mb-4">จัดการบัญชีผู้ใช้ สิทธิ์การเข้าถึง และข้อมูลส่วนตัว</p>
              <a
                href="/admin/users"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors inline-block"
              >
                👥 จัดการผู้ใช้
              </a>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">จัดการหมวดหมู่</h3>
              <p className="text-gray-600 mb-4">เพิ่ม แก้ไข หรือลบหมวดหมู่สินค้าต่างๆ</p>
              <a
                href="/admin/categories"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors inline-block"
              >
                📂 จัดการหมวดหมู่
              </a>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">จัดการ About Us</h3>
              <p className="text-gray-600 mb-4">แก้ไขเนื้อหาหน้าเกี่ยวกับเรา ทีมงาน และข้อมูลบริษัท</p>
              <a
                href="/admin/about"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors inline-block"
              >
                📄 จัดการ About Us
              </a>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">จัดการ Contact Us</h3>
              <p className="text-gray-600 mb-4">ดูข้อความจากลูกค้า จัดการคำขอ Vendor และข้อมูลติดต่อ</p>
              <a
                href="/admin/contact"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors inline-block"
              >
                📞 จัดการ Contact Us
              </a>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">จัดการเนื้อหา Contact</h3>
              <p className="text-gray-600 mb-4">แก้ไขเนื้อหาหน้า Contact Us, Hero Section และข้อมูลติดต่อ</p>
              <a
                href="/admin/contact-content"
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors inline-block"
              >
                📝 จัดการเนื้อหา Contact
              </a>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">จัดการ Vendor</h3>
              <p className="text-gray-600 mb-4">อนุมัติคำขอ Vendor ใหม่ และจัดการบัญชี Vendor</p>
              <a
                href="/admin/vendors"
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors inline-block"
              >
                🤝 จัดการ Vendor
              </a>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">รายงานและสถิติ</h3>
              <p className="text-gray-600 mb-4">ดูรายงานการขาย สถิติผู้ใช้ และข้อมูลการดำเนินงาน</p>
              <a
                href="/admin/reports"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors inline-block"
              >
                📊 รายงานและสถิติ
              </a>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">กิจกรรมล่าสุด</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">👤</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">ผู้ใช้ใหม่ลงทะเบียน: john.doe@email.com</p>
                    <p className="text-xs text-gray-500">5 นาทีที่แล้ว</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">📦</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">สินค้าใหม่ถูกเพิ่ม: เครื่องใช้ไฟฟ้าคุณภาพดี</p>
                    <p className="text-xs text-gray-500">15 นาทีที่แล้ว</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm">📄</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">หน้า About Us ถูกอัพเดท</p>
                    <p className="text-xs text-gray-500">1 ชั่วโมงที่แล้ว</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                    <span className="text-cyan-600 text-sm">📝</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Contact Us content ถูกอัพเดท</p>
                    <p className="text-xs text-gray-500">1 ชั่วโมงที่แล้ว</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-sm">🛒</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">คำสั่งซื้อใหม่: #ORD-2024-001</p>
                    <p className="text-xs text-gray-500">2 ชั่วโมงที่แล้ว</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

