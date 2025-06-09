'use client';

import React, { useState, useEffect } from 'react';
import { submitContactMessage } from '../../lib/contactService';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await submitContactMessage(formData);
      
      if (result.success) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        alert('เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">ส่งข้อความเรียบร้อยแล้ว!</h2>
          <p className="text-gray-600 mb-6">
            ขอบคุณที่ติดต่อเรา เราจะตอบกลับภายใน 24 ชั่วโมง
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            ส่งข้อความใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">ติดต่อเรา</h1>
          <p className="text-xl md:text-2xl text-blue-100">
            พร้อมให้บริการและสอบถามข้อมูลเกี่ยวกับสินค้า Surplus คุณภาพดี
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Vendor Section */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 mb-12 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">🤝 สนใจเป็น Vendor กับเรา?</h2>
            <p className="text-xl mb-8 text-green-100">
              เข้าร่วมแพลตฟอร์ม SSS Supply และขยายธุรกิจของคุณไปกับเรา
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl mb-2">🌟</div>
                <h3 className="font-semibold mb-2">เข้าถึงลูกค้าใหม่</h3>
                <p className="text-sm text-green-100">ขยายฐานลูกค้าผ่านแพลตฟอร์มออนไลน์</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl mb-2">💰</div>
                <h3 className="font-semibold mb-2">เพิ่มยอดขาย</h3>
                <p className="text-sm text-green-100">โอกาสในการขายสินค้าได้มากขึ้น</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="font-semibold mb-2">ง่ายต่อการจัดการ</h3>
                <p className="text-sm text-green-100">ระบบจัดการที่ใช้งานง่าย</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl mb-2">🛡️</div>
                <h3 className="font-semibold mb-2">ความปลอดภัย</h3>
                <p className="text-sm text-green-100">ระบบการชำระเงินที่ปลอดภัย</p>
              </div>
            </div>
            
            <a href="/vendor-registration" className="vendor-btn">
              📝 สมัครเป็น Vendor
            </a>
          </div>
        </div>

        {/* Contact Form & Info Grid */}
        <div className="contact-grid">
          {/* Contact Form */}
          <div className="contact-form">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">📧 ส่งข้อความถึงเรา</h2>
                <p className="text-gray-600">กรอกข้อมูลด้านล่างเพื่อติดต่อเรา เราจะตอบกลับโดยเร็วที่สุด</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อ-นามสกุล *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="กรุณากรอกชื่อ-นามสกุล"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    อีเมล *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="08X-XXX-XXXX"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    หัวข้อ *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">เลือกหัวข้อ</option>
                    <option value="สินค้า">สอบถามเกี่ยวกับสินค้า</option>
                    <option value="สั่งซื้อ">สั่งซื้อสินค้า</option>
                    <option value="สนับสนุน">ขอความช่วยเหลือ</option>
                    <option value="ธุรกิจ">ความร่วมมือทางธุรกิจ</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    ข้อความ *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="กรุณาระบุรายละเอียดที่ต้องการสอบถาม..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      กำลังส่ง...
                    </span>
                  ) : (
                    '📤 ส่งข้อความ'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="contact-info">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📞 ข้อมูลติดต่อ</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-lg">📱</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">เบอร์โทรศัพท์</h3>
                    <p className="text-gray-600">โทร: 02-123-4567</p>
                    <p className="text-gray-600">มือถือ: 089-123-4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 text-lg">📧</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">อีเมล</h3>
                    <p className="text-gray-600">ทั่วไป: info@ssssupply.com</p>
                    <p className="text-gray-600">ขาย: sales@ssssupply.com</p>
                    <p className="text-gray-600">สนับสนุน: support@ssssupply.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-lg">💬</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">ช่องทางออนไลน์</h3>
                    <p className="text-gray-600">Line ID: @ssssupply</p>
                    <p className="text-gray-600">Facebook: SSS Supply Thailand</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-600 text-lg">🕒</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">เวลาทำการ</h3>
                    <p className="text-gray-600">จันทร์ - ศุกร์: 8:00 - 17:00 น.</p>
                    <p className="text-gray-600">เสาร์: 8:00 - 12:00 น.</p>
                    <p className="text-gray-600">อาทิตย์: ปิด</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .contact-grid {
            grid-template-columns: 2fr 1fr;
          }
        }

        .vendor-btn {
          display: inline-block;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          color: #1e40af;
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .vendor-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }
      `}</style>
    </div>
  );
}

