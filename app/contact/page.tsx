
'use client';

import React, { useState, useEffect } from 'react';

interface HeroData {
  title: string;
  subtitle: string;
}

interface ContactInfo {
  phones: {
    office: string;
    mobile: string;
  };
  emails: {
    general: string;
    sales: string;
    support: string;
  };
  social: {
    line: string;
    facebook: string;
  };
}

interface VendorFeature {
  icon: string;
  title: string;
  description: string;
}

interface VendorData {
  title: string;
  subtitle: string;
  features: VendorFeature[];
}

interface Subject {
  id: string;
  name: string;
  active: boolean;
  order: number;
}

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  // State for dynamic content
  const [heroData, setHeroData] = useState<HeroData>({
    title: 'ติดต่อเรา',
    subtitle: 'พร้อมให้บริการและตอบทุกข้อสงสัยเกี่ยวกับสินค้า Surplus คุณภาพดี'
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phones: { office: '02-123-4567', mobile: '089-123-4567' },
    emails: { general: 'info@ssssupply.com', sales: 'sales@ssssupply.com', support: 'support@ssssupply.com' },
    social: { line: '@ssssupply', facebook: 'MTP Supply Thailand' }
  });

  const [vendorData, setVendorData] = useState<VendorData>({
    title: '🤝 สนใจเป็น Vendor กับเรา?',
    subtitle: 'เข้าร่วมเป็นพาร์ทเนอร์กับเราในการจำหน่ายสินค้า Surplus คุณภาพดี เพิ่มช่องทางขายและเพิ่มรายได้ของคุณ',
    features: [
      { icon: '🌟', title: 'เข้าถึงลูกค้าใหม่', description: 'เพิ่มฐานลูกค้าและขยายตลาด' },
      { icon: '💰', title: 'เพิ่มรายได้', description: 'สร้างรายได้เสริมจากสินค้าคงเหลือ' },
      { icon: '🚀', title: 'ง่ายต่อการจัดการ', description: 'ระบบจัดการที่ใช้งานง่าย' },
      { icon: '💎', title: 'ความน่าเชื่อถือ', description: 'แพลตฟอร์มที่มั่นคงและปลอดภัย' }
    ]
  });

  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: 'สอบถามสินค้า', active: true, order: 1 },
    { id: '2', name: 'สอบถามราคา', active: true, order: 2 },
    { id: '3', name: 'แจ้งปัญหา', active: true, order: 3 },
    { id: '4', name: 'ข้อเสนอแนะ', active: true, order: 4 },
    { id: '5', name: 'อื่นๆ', active: true, order: 5 }
  ]);

  // Load dynamic content from Firebase
  useEffect(() => {
    loadContentData();
  }, []);

  const loadContentData = async () => {
    try {
      // Load Hero Data
      const heroResponse = await fetch('/api/contact-content/hero');
      if (heroResponse.ok) {
        const heroResult = await heroResponse.json();
        if (heroResult.success) {
          setHeroData(heroResult.data);
        }
      }

      // Load Contact Info
      const infoResponse = await fetch('/api/contact-content/info');
      if (infoResponse.ok) {
        const infoResult = await infoResponse.json();
        if (infoResult.success) {
          setContactInfo(infoResult.data);
        }
      }

      // Load Vendor Data
      const vendorResponse = await fetch('/api/contact-content/vendor');
      if (vendorResponse.ok) {
        const vendorResult = await vendorResponse.json();
        if (vendorResult.success) {
          setVendorData(vendorResult.data);
        }
      }

      // Load Subjects
      const subjectsResponse = await fetch('/api/contact-content/subjects');
      if (subjectsResponse.ok) {
        const subjectsResult = await subjectsResponse.json();
        if (subjectsResult.success) {
          setSubjects(subjectsResult.data.filter((s: Subject) => s.active));
        }
      }
    } catch (error) {
      console.error('Error loading content data:', error);
      // Keep default values if API fails
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Mobile Menu Toggle Function
    window.toggleMobileMenu = function() {
      const hamburger = document.querySelector('.hamburger');
      const mobileMenu = document.getElementById('mobileMenu');
      
      hamburger?.classList.toggle('active');
      mobileMenu?.classList.toggle('active');
    };

    // Super Admin Detection
    function checkSuperAdminMode() {
      const superAdminEnabled = process.env.NEXT_PUBLIC_SUPER_ADMIN_ENABLED === 'true';
      const superAdminLink = document.getElementById('superAdminLink');
      
      if (superAdminEnabled && superAdminLink) {
        superAdminLink.style.display = 'block';
      }
    }

    checkSuperAdminMode();

    // Close mobile menu handlers
    document.querySelectorAll('.mobile-menu a').forEach(link => {
      link.addEventListener('click', function() {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        
        hamburger?.classList.remove('active');
        mobileMenu?.classList.remove('active');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      const header = document.querySelector('.header');
      
      if (!header?.contains(e.target)) {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        
        hamburger?.classList.remove('active');
        mobileMenu?.classList.remove('active');
      }
    });
  }, []);

  return (
    <div>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
        }

        /* Header Styles */
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .logo-icon {
          background: white;
          color: #667eea;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .nav {
          display: flex;
          align-items: center;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-links a {
          color: white;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
          position: relative;
        }

        .nav-links a:hover {
          color: #e0e7ff;
        }

        .nav-links a[href="/contact"] {
          color: #fbbf24;
          font-weight: 600;
        }

        .login-dropdown {
          position: relative;
        }

        .login-btn {
          background: rgba(255,255,255,0.2);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.3s;
        }

        .login-btn:hover {
          background: rgba(255,255,255,0.3);
        }

        .login-dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          padding: 0.5rem 0;
          min-width: 160px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s;
        }

        .login-dropdown:hover .login-dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .login-dropdown-menu a {
          display: block;
          color: #374151;
          padding: 0.5rem 1rem;
          text-decoration: none;
          transition: background-color 0.3s;
        }

        .login-dropdown-menu a:hover {
          background: #f3f4f6;
          color: #667eea;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .cart-icon {
          font-size: 1.5rem;
          cursor: pointer;
          transition: transform 0.3s;
        }

        .cart-icon:hover {
          transform: scale(1.1);
        }

        .hamburger {
          display: none;
          flex-direction: column;
          cursor: pointer;
          gap: 3px;
        }

        .hamburger span {
          width: 25px;
          height: 3px;
          background: white;
          transition: 0.3s;
          border-radius: 2px;
        }

        .hamburger.active span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }

        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1rem;
          transform: translateY(-100%);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s;
          border-radius: 0 0 8px 8px;
        }

        .mobile-menu.active {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        .mobile-menu a {
          display: block;
          color: white;
          text-decoration: none;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          transition: color 0.3s;
        }

        .mobile-menu a:hover {
          color: #e0e7ff;
        }

        .mobile-menu a:last-child {
          border-bottom: none;
        }

        /* Hero Section */
        .contact-hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem 0;
          text-align: center;
        }

        .contact-hero h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .contact-hero p {
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
          opacity: 0.9;
        }

        /* Vendor Section - Now at the top */
        .vendor-section {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          margin: 2rem auto;
          max-width: 1200px;
          padding: 2rem;
          border-radius: 20px;
          color: white;
          text-align: center;
          box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
        }

        .vendor-section h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .vendor-section .subtitle {
          margin-bottom: 2rem;
          opacity: 0.9;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .vendor-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .vendor-feature {
          background: rgba(255,255,255,0.15);
          padding: 1.5rem;
          border-radius: 12px;
          text-align: center;
          transition: transform 0.3s, background 0.3s;
          backdrop-filter: blur(10px);
        }

        .vendor-feature:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.2);
        }

        .vendor-feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          display: block;
        }

        .vendor-feature h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .vendor-feature p {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .vendor-btn {
          background: white;
          color: #059669;
          padding: 1rem 2.5rem;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .vendor-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        .contact-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 1rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }

        .contact-form {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .contact-form h2 {
          color: #374151;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
        }

        .required {
          color: #ef4444;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .form-group textarea {
          height: 120px;
          resize: vertical;
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

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .contact-info {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .contact-info h2 {
          color: #374151;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .info-item {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }

        .info-item h3 {
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
        }

        .info-item p {
          color: #6b7280;
          margin: 0;
        }

        .vendor-section {
          grid-column: 1 / -1;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          padding: 2rem;
          border-radius: 16px;
          color: white;
          text-align: center;
          margin-top: 2rem;
        }

        .vendor-section h2 {
          font-size: 1.8rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .vendor-section p {
          margin-bottom: 1.5rem;
          opacity: 0.9;
        }

        .vendor-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .vendor-feature {
          background: rgba(255,255,255,0.1);
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
        }

        .vendor-feature-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .vendor-btn {
          background: white;
          color: #059669;
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s;
          text-decoration: none;
          display: inline-block;
        }

        .vendor-btn:hover {
          transform: translateY(-2px);
        }

        .status-message {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          text-align: center;
        }

        .status-success {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .status-error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .hamburger {
            display: flex;
          }

          .contact-hero h1 {
            font-size: 1.8rem;
          }

          .contact-container {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 2rem 1rem;
          }

          .vendor-features {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <div className="logo-icon">M</div>
            <span>MTP Supply</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="nav">
            <div className="nav-links">
              <a href="/products">สินค้า</a>
              <a href="#categories">หมวดหมู่</a>
              <a href="/about">เกี่ยวกับเรา</a>
              <a href="/contact">ติดต่อเรา</a>
              
              {/* Login Dropdown */}
              <div className="login-dropdown">
                <button className="login-btn">เข้าสู่ระบบ</button>
                <div className="login-dropdown-menu">
                  <a href="/auth/signin">สำหรับลูกค้า</a>
                  <a href="/vendor/login">สำหรับ Vendor</a>
                  <a href="/admin/login">สำหรับ Admin</a>
                  <a href="/admin/super" id="superAdminLink" style={{display: 'none'}}>🔥 Super Admin</a>
                </div>
              </div>
            </div>
          </nav>

          <div className="header-actions">
            <div className="cart-icon">🛒</div>
            
            {/* Hamburger Menu (Mobile) */}
            <div className="hamburger" onClick={() => window.toggleMobileMenu?.()}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          
          {/* Mobile Menu Dropdown */}
          <div className="mobile-menu" id="mobileMenu">
            <a href="/products">สินค้า</a>
            <a href="#categories">หมวดหมู่</a>
            <a href="/about">เกี่ยวกับเรา</a>
            <a href="/contact">ติดต่อเรา</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="contact-hero">
        <div>
          <h1>{heroData.title}</h1>
          <p>{heroData.subtitle}</p>
        </div>
      </section>

      {/* Vendor Section - Moved to top */}
      <div className="vendor-section">
        <h2>{vendorData.title}</h2>
        <p className="subtitle">{vendorData.subtitle}</p>
        
        <div className="vendor-features">
          {vendorData.features.map((feature, index) => (
            <div key={index} className="vendor-feature">
              <span className="vendor-feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
        
        <a href="/vendor-registration" className="vendor-btn">
          🌸 สมัครเป็น Vendor
        </a>
      </div>

      {/* Contact Content */}
      <div className="contact-container">
        {/* Contact Form */}
        <div className="contact-form">
          <h2>💬 ส่งข้อความถึงเรา</h2>
          
          {submitStatus === 'success' && (
            <div className="status-message status-success">
              ส่งข้อความเรียบร้อยแล้ว! เราจะติดต่อกลับโดยเร็วที่สุด
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="status-message status-error">
              เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">ชื่อ-นามสกุล <span className="required">*</span></label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="กรุณากรอกชื่อ-นามสกุล"
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">อีเมล <span className="required">*</span></label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="example@email.com"
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">เบอร์โทรศัพท์</label>
              <input 
                type="tel" 
                name="phone" 
                id="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="08X-XXX-XXXX"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">หัวข้อ <span className="required">*</span></label>
              <select 
                name="subject" 
                id="subject" 
                value={formData.subject} 
                onChange={handleChange} 
                required
              >
                <option value="">เลือกหัวข้อ</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">ข้อความ <span className="required">*</span></label>
              <textarea 
                name="message" 
                id="message" 
                value={formData.message} 
                onChange={handleChange} 
                placeholder="กรุณาระบุรายละเอียดที่ต้องการติดต่อ..."
                required 
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'กำลังส่ง...' : 'ส่งข้อความ'}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="contact-info">
          <h2>📞 ข้อมูลติดต่อ</h2>
          
          <div className="info-item">
            <h3>แนวโทรศัพท์</h3>
            <p>โทร: {contactInfo.phones.office}</p>
            <p>มือถือ: {contactInfo.phones.mobile}</p>
          </div>

          <div className="info-item">
            <h3>อีเมล</h3>
            <p>ทั่วไป: {contactInfo.emails.general}</p>
            <p>ขาย: {contactInfo.emails.sales}</p>
            <p>สนับสนุน: {contactInfo.emails.support}</p>
          </div>

          <div className="info-item">
            <h3>ช่องทางออนไลน์</h3>
            <p>Line ID: {contactInfo.social.line}</p>
            <p>Facebook: {contactInfo.social.facebook}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

