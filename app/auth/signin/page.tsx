'use client';

import React, { useState } from 'react';

export default function CustomerLogin() {
  const [isSignUp, setIsSignUp] = useState(false);
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
      
      if (isSignUp) {
        // Handle sign up
        console.log('Sign up:', formData);
        alert('สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี');
      } else {
        // Handle sign in
        console.log('Sign in:', formData);
        // Redirect to dashboard or home
        window.location.href = '/';
      }
    } catch (error) {
      setErrorMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Implement social login logic here
    alert(`เข้าสู่ระบบด้วย ${provider} (ยังไม่ได้เชื่อมต่อ)`);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrorMessage('');
    setFormData({ email: '', password: '' });
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        
        .login-container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          max-width: 400px;
          width: 100%;
          animation: slideUp 0.6s ease-out;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .login-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          text-align: center;
        }
        
        .logo {
          width: 60px;
          height: 60px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 1.5rem;
          font-weight: bold;
          color: #667eea;
        }
        
        .login-header h1 {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        
        .login-header p {
          opacity: 0.9;
          font-size: 0.95rem;
        }
        
        .login-form {
          padding: 2rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }
        
        .form-group input {
          width: 100%;
          padding: 0.875rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f8fafc;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .error-message {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .login-btn {
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        
        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 0.5rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .toggle-mode {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        
        .toggle-mode button {
          background: none;
          border: none;
          color: #667eea;
          font-weight: 500;
          cursor: pointer;
          text-decoration: underline;
        }
        
        .toggle-mode button:hover {
          color: #5a6fd8;
        }
        
        .divider {
          position: relative;
          text-align: center;
          margin: 1.5rem 0;
          color: #6b7280;
          font-size: 0.9rem;
        }
        
        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e5e7eb;
        }
        
        .divider span {
          background: white;
          padding: 0 1rem;
        }
        
        .social-login {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.875rem;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          background: white;
          color: #374151;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .social-btn:hover {
          border-color: #d1d5db;
          background: #f9fafb;
          transform: translateY(-1px);
        }
        
        .social-btn svg {
          width: 20px;
          height: 20px;
          margin-right: 0.75rem;
        }
        
        .google-btn:hover {
          border-color: #4285f4;
          color: #4285f4;
        }
        
        .facebook-btn:hover {
          border-color: #1877f2;
          color: #1877f2;
        }
        
        .line-btn:hover {
          border-color: #00b900;
          color: #00b900;
        }
        
        .back-link {
          text-align: center;
          margin-top: 1.5rem;
        }
        
        .back-link a {
          color: #6b7280;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s;
        }
        
        .back-link a:hover {
          color: #374151;
        }
        
        @media (max-width: 480px) {
          .login-container {
            margin: 0.5rem;
          }
          
          .login-header {
            padding: 1.5rem;
          }
          
          .login-form {
            padding: 1.5rem;
          }
          
          .login-header h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <div className="logo">S</div>
          <h1>{isSignUp ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}</h1>
          <p>{isSignUp ? 'สร้างบัญชีใหม่เพื่อเริ่มซื้อสินค้า' : 'เข้าสู่ระบบเพื่อซื้อสินค้าและติดตามคำสั่งซื้อ'}</p>
        </div>

        {/* Login Form */}
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            {/* Error Message */}
            {errorMessage && (
              <div className="error-message">
                {errorMessage}
              </div>
            )}

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">อีเมล</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your@email.com"
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
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading && <div className="loading-spinner"></div>}
              <span>{isSignUp ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}</span>
            </button>

            {/* Toggle Sign Up/Sign In */}
            <div className="toggle-mode">
              <button type="button" onClick={toggleMode}>
                {isSignUp ? 'มีบัญชีแล้ว? เข้าสู่ระบบ' : 'ยังไม่มีบัญชี? สมัครสมาชิก'}
              </button>
            </div>

            {/* Divider */}
            <div className="divider">
              <span>หรือเข้าสู่ระบบด้วย</span>
            </div>

            {/* Social Login Buttons */}
            <div className="social-login">
              {/* Google Login */}
              <button type="button" className="social-btn google-btn" onClick={() => handleSocialLogin('Google')}>
                <svg viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                เข้าสู่ระบบด้วย Google
              </button>

              {/* Facebook Login */}
              <button type="button" className="social-btn facebook-btn" onClick={() => handleSocialLogin('Facebook')}>
                <svg fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                เข้าสู่ระบบด้วย Facebook
              </button>

              {/* Line Login */}
              <button type="button" className="social-btn line-btn" onClick={() => handleSocialLogin('Line')}>
                <svg fill="#00B900" viewBox="0 0 24 24">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                </svg>
                เข้าสู่ระบบด้วย Line
              </button>
            </div>
          </form>

          {/* Back to Home */}
          <div className="back-link">
            <a href="/">← กลับไปหน้าหลัก</a>
          </div>
        </div>
      </div>
    </>
  );
}

