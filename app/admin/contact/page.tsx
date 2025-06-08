'use client';

import React from 'react';

export default function AdminContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">📞 จัดการ Contact Us</h1>
              <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded">Admin Panel</span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/admin"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ← กลับ Dashboard
              </a>
              <a
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🌐 ดูเว็บไซต์
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">จัดการ Contact Us</h2>
          <p className="text-gray-600">จัดการข้อความจากลูกค้า คำขอ Vendor และข้อมูลติดต่อบริษัท</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">📧</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">ข้อความใหม่</p>
                <p className="text-2xl font-semibold text-gray-900">24</p>
                <p className="text-xs text-blue-600">+12% จากเมื่อวาน</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">ตอบกลับแล้ว</p>
                <p className="text-2xl font-semibold text-gray-900">156</p>
                <p className="text-xs text-green-600">+8% จากเมื่อวาน</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">🤝</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">คำขอ Vendor</p>
                <p className="text-2xl font-semibold text-gray-900">8</p>
                <p className="text-xs text-yellow-600">รอพิจารณา</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">ทั้งหมดเดือนนี้</p>
                <p className="text-2xl font-semibold text-gray-900">188</p>
                <p className="text-xs text-purple-600">+15% จากเดือนก่อน</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📧 ข้อความจากลูกค้า</h3>
            <p className="text-gray-600 mb-4">ดูและตอบกลับข้อความจากลูกค้า จัดการสถานะและความสำคัญ</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full">
              ดูข้อความทั้งหมด
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">🤝 คำขอเป็น Vendor</h3>
            <p className="text-gray-600 mb-4">พิจารณาและอนุมัติคำขอสมัครเป็น Vendor ใหม่</p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors w-full">
              ดูคำขอ Vendor
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📞 ข้อมูลติดต่อ</h3>
            <p className="text-gray-600 mb-4">จัดการข้อมูลติดต่อบริษัท เบอร์โทร อีเมล และช่องทางออนไลน์</p>
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors w-full">
              แก้ไขข้อมูลติดต่อ
            </button>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">📧 ข้อความล่าสุด</h3>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                ดูทั้งหมด →
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📧</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">นายสมชาย ใจดี</p>
                      <p className="text-sm text-gray-600">somchai@email.com</p>
                      <p className="text-sm text-gray-800 mt-1">สอบถามเกี่ยวกับสินค้า Surplus อิเล็กทรอนิกส์...</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        ใหม่
                      </span>
                      <p className="text-xs text-gray-500 mt-1">5 นาทีที่แล้ว</p>
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                      ตอบกลับ
                    </button>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm">
                      ดูรายละเอียด
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🤝</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">บริษัท ABC จำกัด</p>
                      <p className="text-sm text-gray-600">contact@abc.com</p>
                      <p className="text-sm text-gray-800 mt-1">ส่งใบสมัครเป็น Vendor ประเภทอิเล็กทรอนิกส์</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        รอพิจารณา
                      </span>
                      <p className="text-xs text-gray-500 mt-1">2 ชั่วโมงที่แล้ว</p>
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                      พิจารณา
                    </button>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm">
                      ดูรายละเอียด
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📞</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">นางสาวมาลี สวยงาม</p>
                      <p className="text-sm text-gray-600">malee@company.com</p>
                      <p className="text-sm text-gray-800 mt-1">สอบถามเกี่ยวกับความร่วมมือทางธุรกิจ</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ตอบกลับแล้ว
                      </span>
                      <p className="text-xs text-gray-500 mt-1">1 วันที่แล้ว</p>
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm">
                      ดูการสนทนา
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Management */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">📞 ข้อมูลติดต่อปัจจุบัน</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">📱 เบอร์โทรศัพท์</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>หลัก: 02-123-4567</p>
                  <p>มือถือ: 089-123-4567</p>
                </div>
                <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                  แก้ไข →
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">📧 อีเมล</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>ทั่วไป: info@ssssupply.com</p>
                  <p>ขาย: sales@ssssupply.com</p>
                  <p>สนับสนุน: support@ssssupply.com</p>
                </div>
                <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                  แก้ไข →
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">💬 ช่องทางออนไลน์</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Line: @ssssupply</p>
                  <p>Facebook: SSS Supply Thailand</p>
                </div>
                <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                  แก้ไข →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

