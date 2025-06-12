
'use client';

import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate API call
    try {
      // In a real application, you would send this data to your API endpoint
      // await fetch('/api/contact', { 
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      console.log('Form data submitted:', formData);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header (Consistent with About Us page) */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white text-blue-600 w-10 h-10 rounded-lg flex items-center justify-center font-bold">
              M
            </div>
            <span className="text-xl font-bold">MTP Surplus</span> {/* Placeholder, can be dynamic later */}
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="/" className="hover:text-blue-200 transition-colors">หน้าหลัก</a>
            <a href="/products" className="hover:text-blue-200 transition-colors">สินค้า</a>
            <a href="/about" className="hover:text-blue-200 transition-colors">เกี่ยวกับเรา</a>
            <a href="/contact" className="text-blue-200 font-semibold">ติดต่อเรา</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            ติดต่อ <span className="text-purple-600">MTP Surplus</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            เรายินดีรับฟังความคิดเห็นและตอบทุกข้อสงสัยของคุณ กรุณากรอกแบบฟอร์มด้านล่างหรือติดต่อเราผ่านช่องทางอื่นๆ
          </p>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">ส่งข้อความถึงเรา</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                  <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์ (ถ้ามี)</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    id="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">ข้อความ</label>
                  <textarea 
                    name="message" 
                    id="message" 
                    rows={4} 
                    value={formData.message} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  ></textarea>
                </div>
                <div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'กำลังส่ง...' : 'ส่งข้อความ'}
                  </button>
                </div>
                {submitStatus === 'success' && (
                  <p className="text-green-600 text-sm text-center">ส่งข้อความสำเร็จแล้ว! เราจะติดต่อกลับโดยเร็วที่สุด</p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-600 text-sm text-center">เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง</p>
                )}
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">ข้อมูลติดต่อ</h3>
                <div className="bg-gray-50 p-6 rounded-2xl shadow-lg space-y-4">
                  <div className="flex items-start">
                    <span className="text-purple-600 text-2xl mr-3">📍</span>
                    <p className="text-gray-700">123 ถนนสุขุมวิท, แขวงคลองเตย, เขตคลองเตย, กรุงเทพมหานคร 10110</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-purple-600 text-2xl mr-3">📞</span>
                    <p className="text-gray-700">02-123-4567</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-purple-600 text-2xl mr-3">✉️</span>
                    <p className="text-gray-700">contact@mtpsurplus.com</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">แผนที่</h3>
                <div className="bg-gray-50 p-2 rounded-2xl shadow-lg h-64 md:h-80">
                  {/* Placeholder for Google Maps iframe */}
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-xl">
                    <p className="text-gray-500">Google Maps จะแสดงที่นี่</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">ติดตามเรา</h3>
                <div className="bg-gray-50 p-6 rounded-2xl shadow-lg flex space-x-4">
                  {/* Placeholder for social media icons */}
                  <a href="#" className="text-purple-600 hover:text-purple-800 text-3xl">FB</a>
                  <a href="#" className="text-purple-600 hover:text-purple-800 text-3xl">LN</a>
                  <a href="#" className="text-purple-600 hover:text-purple-800 text-3xl">IG</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Consistent with About Us page) */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="bg-purple-600 w-10 h-10 rounded-lg flex items-center justify-center font-bold">
              M
            </div>
            <span className="text-xl font-bold">MTP Surplus</span>
          </div>
          <p className="text-gray-400 mb-6">ผู้นำด้านการจัดหาและจำหน่ายสินค้าคุณภาพสูง</p>
          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500">© {new Date().getFullYear()} MTP Surplus. สงวนลิขสิทธิ์.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;

