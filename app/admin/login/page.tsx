'use client';

import React, { useState } from 'react';

export default function AdminLogin() {
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
      
      // Handle admin login
      console.log('Admin login:', formData);
      
      // Check if it's super admin
      if (formData.email === 'sanchai5651@gmail.com') {
        window.location.href = '/admin/super';
      } else {
        window.location.href = '/admin';
      }
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
          background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        
        .admin-login-container {
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
        
        .admin-header {
          background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%);
          color: white;
          padding: 2.5rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .admin-header::before {
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
        
        .admin-logo {
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
          color: #1e3a8a;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          position: relative;
          z-index: 1;
        }
        
        .admin-header h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }
        
        .admin-header p {
          opacity: 0.95;
          font-size: 1rem;
          position: relative;
          z-index: 1;
        }
        
        .admin-form {
          padding: 2.5rem 2rem;
        }
        
        .security-notice {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 1px solid #f59e0b;
          color: #92400e;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          font-size: 0.9rem;
          text-align: center;
          font-weight: 500;
        }
        
        .security-notice .icon {
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
          border-color: #3730a3;
          background: white;
          box-shadow: 0 0 0 4px rgba(55, 48, 163, 0.1);
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
        
        .admin-login-btn {
          width: 100%;
          background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%);
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
        
        .admin-login-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(30, 58, 138, 0.4);
        }
        
        .admin-login-btn:disabled {
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
        
        .admin-features {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }
        
        .admin-features h3 {
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
        
        .super-admin-hint {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 1px solid #f59e0b;
          color: #92400e;
          padding: 0.75rem;
          border-radius: 8px;
          margin-top: 1rem;
          font-size: 0.8rem;
          text-align: center;
        }
        
        @media (max-width: 480px) {
          .admin-login-container {
            margin: 0.5rem;
          }
          
          .admin-header {
            padding: 2rem 1.5rem;
          }
          
          .admin-form {
            padding: 2rem 1.5rem;
          }
          
          .admin-header h1 {
            font-size: 1.7rem;
          }
          
          .features-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="admin-login-container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-logo">A</div>
          <h1>Admin Portal</h1>
          <p>ระบบจัดการสำหรับผู้ดูแลระบบ</p>
        </div>

        {/* Admin Form */}
        <div className="admin-form">
          {/* Security Notice */}
          <div className="security-notice">
            <span className="icon">🔒</span>
            <strong>พื้นที่ปลอดภัยสำหรับผู้ดูแลระบบเท่านั้น</strong>
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
              <label htmlFor="email">อีเมลผู้ดูแลระบบ</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="admin@company.com"
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
            <button type="submit" className="admin-login-btn" disabled={isLoading}>
              {isLoading && <div className="loading-spinner"></div>}
              <span>เข้าสู่ระบบ Admin</span>
            </button>

            {/* Admin Features */}
            <div className="admin-features">
              <h3>ฟีเจอร์สำหรับผู้ดูแลระบบ</h3>
              <div className="features-list">
                <div className="feature-item">จัดการผู้ใช้งาน</div>
                <div className="feature-item">ตรวจสอบคำสั่งซื้อ</div>
                <div className="feature-item">จัดการสินค้า</div>
                <div className="feature-item">รายงานยอดขาย</div>
                <div className="feature-item">ตั้งค่าระบบ</div>
                <div className="feature-item">ระบบความปลอดภัย</div>
              </div>
            </div>

            {/* Super Admin Hint */}
            <div className="super-admin-hint">
              💡 <strong>Super Admin:</strong> ใช้อีเมล sanchai5651@gmail.com เพื่อเข้าถึงระบบ Super Admin
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

