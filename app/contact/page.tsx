'use client';

import React, { useState } from 'react';

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
  const [error, setError] = useState('');

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
    setError('');

    try {
      console.log('Submitting contact form...', formData);
      
      // Import Firebase functions dynamically
      const { submitContactMessage } = await import('../../lib/contactService');
      const result = await submitContactMessage(formData);
      
      console.log('Submit result:', result);
      
      if (result.success) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        alert('ส่งข้อความเรียบร้อยแล้ว! เราจะติดต่อกลับโดยเร็วที่สุด');
      } else {
        setError(result.error || 'เกิดข้อผิดพลาดในการส่งข้อความ');
        alert('เกิดข้อผิดพลาด: ' + (result.error || 'ไม่สามารถส่งข้อความได้'));
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setError(error.message);
      alert('เกิดข้อผิดพลาด: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">ส่งข้อความสำเร็จ!</h2>
            <p className="text-gray-600 mb-6">
              ขอบคุณที่ติดต่อเรา เราจะตอบกลับโดยเร็วที่สุด
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              ส่งข้อความใหม่
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800">
      {/* Hero Section */}
      <div className="text-center py-16 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">ติดต่อเรา</h1>
        <p className="text-xl opacity-90">
          พร้อมให้บริการและตอบคำถามทุกเรื่องเกี่ยวกับสินค้า Surplus คุณภาพดี
        </p>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-2xl mr-3">📧</span>
                ส่งข้อความถึงเรา
              </h2>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    ชื่อ-นามสกุล *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="กรุณากรอกชื่อ-นามสกุล"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    อีเมล *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="08X-XXX-XXXX"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    หัวข้อ *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">เลือกหัวข้อ</option>
                    <option value="สอบถามเกี่ยวกับสินค้า">สอบถามเกี่ยวกับสินค้า</option>
                    <option value="สั่งซื้อสินค้า">สั่งซื้อสินค้า</option>
                    <option value="สนับสนุนและบริการ">สนับสนุนและบริการ</option>
                    <option value="ความร่วมมือทางธุรกิจ">ความร่วมมือทางธุรกิจ</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    ข้อความ *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="กรุณาระบุรายละเอียดที่ต้องการสอบถาม..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'กำลังส่ง...' : 'ส่งข้อความ'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Contact Details */}
              <div className="bg-white rounded-xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="text-2xl mr-3">📞</span>
                  ข้อมูลติดต่อ
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <span className="text-purple-600 text-xl">📱</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">เบอร์โทรศัพท์</h3>
                      <p className="text-gray-600">โทร: 02-123-4567</p>
                      <p className="text-gray-600">มือถือ: 089-123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <span className="text-purple-600 text-xl">✉️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">อีเมล</h3>
                      <p className="text-gray-600">ทั่วไป: info@ssssupply.com</p>
                      <p className="text-gray-600">ขาย: sales@ssssupply.com</p>
                      <p className="text-gray-600">สนับสนุน: support@ssssupply.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <span className="text-purple-600 text-xl">💬</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">ช่องทางออนไลน์</h3>
                      <p className="text-gray-600">Line ID: @ssssupply</p>
                      <p className="text-gray-600">Facebook: SSS Supply Thailand</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vendor Section */}
              <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="text-2xl mr-3">🤝</span>
                  สนใจเป็น Vendor กับเรา?
                </h2>
                <p className="mb-6 opacity-90">
                  เข้าร่วมเป็นพาร์ทเนอร์ทางธุรกิจและขายสินค้า Surplus คุณภาพดีผ่านแพลตฟอร์มของเรา
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🌟</div>
                    <p className="text-sm">เข้าถึงลูกค้าใหม่</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">💰</div>
                    <p className="text-sm">เพิ่มยอดขาย</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🚀</div>
                    <p className="text-sm">ง่ายต่อการจัดการ</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🛡️</div>
                    <p className="text-sm">ความปลอดภัย</p>
                  </div>
                </div>

                <a 
                  href="/vendor-registration" 
                  className="inline-block w-full text-center bg-white text-green-600 py-3 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  📝 สมัครเป็น Vendor
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

