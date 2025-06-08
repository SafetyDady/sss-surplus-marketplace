'use client';

import React from 'react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        .contact-hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 0;
          text-align: center;
        }
        
        .contact-hero h1 {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }
        
        .contact-hero p {
          font-size: 1.2rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .contact-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }
        
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          margin-bottom: 4rem;
        }
        
        .contact-form {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .contact-form h2 {
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          color: #333;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #555;
        }
        
        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e1e8ed;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        
        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #667eea;
        }
        
        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }
        
        .submit-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s;
          width: 100%;
        }
        
        .submit-btn:hover {
          transform: translateY(-2px);
        }
        
        .contact-info {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .contact-info h2 {
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          color: #333;
        }
        
        .info-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 12px;
        }
        
        .info-icon {
          font-size: 1.5rem;
          margin-right: 1rem;
          margin-top: 0.25rem;
        }
        
        .info-content h3 {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .info-content p {
          color: #666;
          line-height: 1.6;
        }
        
        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
          text-decoration: none;
          font-size: 1.2rem;
          transition: transform 0.3s;
        }
        
        .social-link:hover {
          transform: translateY(-3px);
        }
        
        .map-section {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          margin-bottom: 4rem;
        }
        
        .map-section h2 {
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          color: #333;
          text-align: center;
        }
        
        .map-container {
          width: 100%;
          height: 400px;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid #e1e8ed;
        }
        
        .business-hours {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .business-hours h2 {
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          color: #333;
          text-align: center;
        }
        
        .hours-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .hours-card {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 12px;
          text-align: center;
        }
        
        .hours-card h3 {
          font-weight: 600;
          margin-bottom: 1rem;
          color: #333;
        }
        
        .hours-card p {
          color: #666;
          line-height: 1.6;
        }
        
        @media (max-width: 768px) {
          .contact-hero h1 {
            font-size: 2rem;
          }
          
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .contact-container {
            padding: 2rem 1rem;
          }
          
          .social-links {
            justify-content: center;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-container">
          <h1>ติดต่อเรา</h1>
          <p>พร้อมให้บริการและตอบคำถามทุกเรื่องเกี่ยวกับสินค้า Surplus คุณภาพดี</p>
        </div>
      </section>

      <div className="contact-container">
        {/* Contact Form & Info Grid */}
        <div className="contact-grid">
          {/* Contact Form */}
          <div className="contact-form">
            <h2>📝 ส่งข้อความถึงเรา</h2>
            <form>
              <div className="form-group">
                <label htmlFor="name">ชื่อ-นามสกุล *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="กรุณากรอกชื่อ-นามสกุล"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">อีเมล *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="example@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="08X-XXX-XXXX"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">หัวข้อ *</label>
                <select id="subject" name="subject" required>
                  <option value="">เลือกหัวข้อ</option>
                  <option value="product">สอบถามสินค้า</option>
                  <option value="order">เรื่องการสั่งซื้อ</option>
                  <option value="support">ขอความช่วยเหลือ</option>
                  <option value="partnership">ความร่วมมือทางธุรกิจ</option>
                  <option value="other">อื่นๆ</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">ข้อความ *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  placeholder="กรุณาระบุรายละเอียดที่ต้องการสอบถาม..."
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                📤 ส่งข้อความ
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="contact-info">
            <h2>📞 ข้อมูลติดต่อ</h2>
            
            <div className="info-item">
              <div className="info-icon">📱</div>
              <div className="info-content">
                <h3>เบอร์โทรศัพท์</h3>
                <p>
                  โทร: 02-123-4567<br/>
                  มือถือ: 089-123-4567
                </p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">✉️</div>
              <div className="info-content">
                <h3>อีเมล</h3>
                <p>
                  ทั่วไป: info@ssssupply.com<br/>
                  ขาย: sales@ssssupply.com<br/>
                  สนับสนุน: support@ssssupply.com
                </p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">💬</div>
              <div className="info-content">
                <h3>ช่องทางออนไลน์</h3>
                <p>
                  Line ID: @ssssupply<br/>
                  Facebook: SSS Supply Thailand
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="social-links">
              <a href="https://line.me/ti/p/@ssssupply" className="social-link" target="_blank" rel="noopener noreferrer">
                💬
              </a>
              <a href="https://facebook.com/ssssupply" className="social-link" target="_blank" rel="noopener noreferrer">
                📘
              </a>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="business-hours">
          <h2>🕒 เวลาทำการ</h2>
          <div className="hours-grid">
            <div className="hours-card">
              <h3>📞 ติดต่อทั่วไป</h3>
              <p>
                จันทร์ - ศุกร์: 08:00 - 18:00<br/>
                เสาร์: 09:00 - 16:00<br/>
                อาทิตย์: ปิดทำการ
              </p>
            </div>

            <div className="hours-card">
              <h3>🛒 ฝ่ายขาย</h3>
              <p>
                จันทร์ - ศุกร์: 08:30 - 17:30<br/>
                เสาร์: 09:00 - 15:00<br/>
                อาทิตย์: ปิดทำการ
              </p>
            </div>

            <div className="hours-card">
              <h3>🔧 ฝ่ายสนับสนุน</h3>
              <p>
                จันทร์ - ศุกร์: 09:00 - 17:00<br/>
                เสาร์: 10:00 - 14:00<br/>
                อาทิตย์: ปิดทำการ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

