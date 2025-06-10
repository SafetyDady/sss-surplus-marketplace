'use client';

import React, { useState } from 'react';

export default function VendorLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Handle vendor login
      console.log('Vendor login:', formData);
      
      // Redirect to vendor dashboard
      window.location.href = '/vendor/dashboard';
    } catch (error) {
      setErrorMessage('ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง กรุณาตรวจสอบอีเมลและรหัสผ่าน');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        
        .vendor-login-container {
          background: white;
          border-radius: 24px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          max-width: 450px;
          width: 100%;
          animation: slideUp 0.8s ease-out;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .vendor-header {
          background: linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%);
          color: white;
          padding: 2.5rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .vendor-header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .vendor-logo {
          width: 70px;
          height: 70px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 1.8rem;
          font-weight: bold;
          color: #059669;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          position: relative;
          z-index: 1;
        }
        
        .vendor-header h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }
        
        .vendor-header p {
          opacity: 0.95;
          font-size: 1rem;
          position: relative;
          z-index: 1;
        }
        
        .vendor-form {
          padding: 2.5rem 2rem;
        }
        
        .vendor-notice {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          border: 1px solid #10b981;
          color: #065f46;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          font-size: 0.9rem;
          text-align: center;
          font-weight: 500;
        }
        
        .vendor-notice .icon {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          display: block;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.75rem;
          font-weight: 600;
          color: #1f2937;
          font-size: 0.95rem;
        }
        
        .form-group input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f9fafb;
          font-weight: 500;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: #059669;
          background: white;
          box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.1);
        }
        
        .error-message {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          border: 1px solid #f87171;
          color: #dc2626;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .vendor-login-btn {
          width: 100%;
          background: linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%);
          color: white;
          border: none;
          padding: 1.25rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .vendor-login-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(5, 150, 105, 0.4);
        }
        
        .vendor-login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        
        .loading-spinner {
          width: 22px;
          height: 22px;
          border: 3px solid transparent;
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 0.75rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .vendor-features {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }
        
        .vendor-features h3 {
          color: #1f2937;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          text-align: center;
        }
        
        .features-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          font-size: 0.85rem;
          color: #4b5563;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .feature-item::before {
          content: '✓';
          color: #10b981;
          font-weight: bold;
          font-size: 0.9rem;
        }
        
        .back-link {
          text-align: center;
          margin-top: 2rem;
        }
        
        .back-link a {
          color: #6b7280;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: color 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .back-link a:hover {
          color: #374151;
        }
        
        .vendor-benefits {
          background: linear-gradient(135d, #d1fae5 0%, #a7f3d0 100%);
          border: 1px solid #10b981;
          color: #065f46;
          padding: 0.75rem;
          border-radius: 8px;
          margin-top: 1rem;
          font-size: 0.8rem;
          text-align: center;
        }
        
        @media (max-width: 480px) {
          .vendor-login-container {
            margin: 0.5rem;
          }
          
          .vendor-header {
            padding: 2rem 1.5rem;
          }
          
          .vendor-form {
            padding: 2rem 1.5rem;
          }
          
          .vendor-header h1 {
            font-size: 1.7rem;
          }
          
          .features-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="vendor-login-container">
        {/* Header */}
        <div className="vendor-header">
          <div className="vendor-logo">V</div>
          <h1>Vendor Portal</h1>
          <p>ระบบจัดการสำหรับผู้ขายและพาร์ทเนอร์</p>
        </div>

        {/* Vendor Form */}
        <div className="vendor-form">
          {/* Vendor Notice */}
          <div className="vendor-notice">
            <span className="icon">🏪</span>
            <strong>พื้นที่สำหรับผู้ขายและพาร์ทเนอร์ธุรกิจ</strong>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Error Message */}
            {errorMessage && (
              <div className="error-message">
                {errorMessage}
              </div>
            )}

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">อีเมลผู้ขาย</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="vendor@company.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">รหัสผ่าน</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="vendor-login-btn" disabled={isLoading}>
              {isLoading && <div className="loading-spinner"></div>}
              <span>เข้าสู่ระบบ Vendor</span>
            </button>

            {/* Vendor Features */}
            <div className="vendor-features">
              <h3>ฟีเจอร์สำหรับผู้ขาย</h3>
              <div className="features-list">
                <div className="feature-item">จัดการสินค้า</div>
                <div className="feature-item">ติดตามคำสั่งซื้อ</div>
                <div className="feature-item">รายงานยอดขาย</div>
                <div className="feature-item">จัดการสต็อก</div>
                <div className="feature-item">ระบบแชท</div>
                <div className="feature-item">การเงินและชำระเงิน</div>
              </div>
            </div>

            {/* Vendor Benefits */}
            <div className="vendor-benefits">
              💰 <strong>เริ่มขายได้ทันที:</strong> ไม่มีค่าสมัครสมาชิก คอมมิชชั่นเริ่มต้น 3%
            </div>
          </form>

          {/* Back to Home */}
          <div className="back-link">
            <a href="/">
              <span>←</span>
              กลับไปหน้าหลัก
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

