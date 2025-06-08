'use client';

import React, { useState } from 'react';
import { submitVendorApplication } from '../../lib/vendorService';

export default function VendorRegistrationPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    businessType: '',
    companyAddress: '',
    taxId: '',
    website: '',
    contactName: '',
    position: '',
    email: '',
    phone: '',
    mobile: '',
    lineId: '',
    productCategories: '',
    productDescription: '',
    monthlyVolume: '',
    experience: '',
    motivation: '',
    otherPlatforms: '',
    terms: false,
    newsletter: false
  });

  const [currentTab, setCurrentTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const result = await submitVendorApplication(formData);
      setSubmitResult(result);
      
      if (result.success) {
        // Reset form on success
        setFormData({
          companyName: '',
          businessType: '',
          companyAddress: '',
          taxId: '',
          website: '',
          contactName: '',
          position: '',
          email: '',
          phone: '',
          mobile: '',
          lineId: '',
          productCategories: '',
          productDescription: '',
          monthlyVolume: '',
          experience: '',
          motivation: '',
          otherPlatforms: '',
          terms: false,
          newsletter: false
        });
        setCurrentTab(0);
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: 'เกิดข้อผิดพลาดในการส่งใบสมัคร'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 0, title: 'ข้อมูลบริษัท', icon: '🏢' },
    { id: 1, title: 'ข้อมูลผู้ติดต่อ', icon: '👤' },
    { id: 2, title: 'ข้อมูลสินค้า', icon: '📦' },
    { id: 3, title: 'ข้อมูลเพิ่มเติม', icon: '📝' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        .hero-section {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 4rem 0;
          text-align: center;
        }
        
        .hero-section h1 {
          font-size: 3.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }
        
        .hero-section p {
          font-size: 1.3rem;
          opacity: 0.9;
          max-width: 700px;
          margin: 0 auto;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .form-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }

        .tab-navigation {
          display: flex;
          background: white;
          border-radius: 12px;
          padding: 0.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .tab-button {
          flex: 1;
          padding: 1rem;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .tab-button.active {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .tab-button:hover:not(.active) {
          background: #f3f4f6;
        }

        .form-section {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #10b981;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        .checkbox-group {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .checkbox-group input[type="checkbox"] {
          width: auto;
          margin-top: 0.25rem;
        }

        .submit-section {
          text-align: center;
          padding: 2rem;
        }

        .submit-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 1rem 3rem;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s;
          min-width: 200px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .alert {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .alert.success {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .alert.error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 2.5rem;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .tab-button {
            font-size: 0.9rem;
            padding: 0.75rem 0.5rem;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1>🤝 สมัครเป็น Vendor</h1>
          <p>เข้าร่วมเป็นส่วนหนึ่งของ SSS Supply Marketplace แพลตฟอร์มการซื้อขายสินค้า Surplus ที่ใหญ่ที่สุดในประเทศไทย</p>
        </div>
      </section>

      <div className="form-container">
        {/* Submit Result Alert */}
        {submitResult && (
          <div className={`alert ${submitResult.success ? 'success' : 'error'}`}>
            {submitResult.message}
            {submitResult.success && submitResult.applicationId && (
              <div className="mt-2">
                <strong>รหัสใบสมัคร:</strong> {submitResult.applicationId}
              </div>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="tab-navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${currentTab === tab.id ? 'active' : ''}`}
              onClick={() => setCurrentTab(tab.id)}
            >
              <span>{tab.icon}</span>
              <span>{tab.title}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tab 0: Company Information */}
          {currentTab === 0 && (
            <div className="form-section">
              <h2>🏢 ข้อมูลบริษัท</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="companyName">ชื่อบริษัท *</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    placeholder="บริษัท ABC จำกัด"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="businessType">ประเภทธุรกิจ *</label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">เลือกประเภทธุรกิจ</option>
                    <option value="บริษัทจำกัด">บริษัทจำกัด</option>
                    <option value="ห้างหุ้นส่วนจำกัด">ห้างหุ้นส่วนจำกัด</option>
                    <option value="ห้างหุ้นส่วนสามัญ">ห้างหุ้นส่วนสามัญ</option>
                    <option value="ธุรกิจเจ้าของคนเดียว">ธุรกิจเจ้าของคนเดียว</option>
                    <option value="สหกรณ์">สหกรณ์</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="companyAddress">ที่อยู่บริษัท *</label>
                <textarea
                  id="companyAddress"
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleInputChange}
                  required
                  placeholder="123/45 ถนนสุขุมวิท แขวงคลองตัน เขตวัฒนา กรุงเทพมหานคร 10110"
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="taxId">เลขประจำตัวผู้เสียภาษี</label>
                  <input
                    type="text"
                    id="taxId"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleInputChange}
                    placeholder="1234567890123"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="website">เว็บไซต์บริษัท</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://www.company.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 1: Contact Information */}
          {currentTab === 1 && (
            <div className="form-section">
              <h2>👤 ข้อมูลผู้ติดต่อ</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="contactName">ชื่อ-นามสกุล ผู้ติดต่อ *</label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    required
                    placeholder="นายสมชาย ใจดี"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="position">ตำแหน่ง *</label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    placeholder="ผู้จัดการฝ่ายขาย"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">อีเมล *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="contact@company.com"
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="phone">เบอร์โทรศัพท์ *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="02-123-4567"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="mobile">เบอร์มือถือ *</label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                    placeholder="089-123-4567"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="lineId">Line ID</label>
                <input
                  type="text"
                  id="lineId"
                  name="lineId"
                  value={formData.lineId}
                  onChange={handleInputChange}
                  placeholder="@company_line"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Product Information */}
          {currentTab === 2 && (
            <div className="form-section">
              <h2>📦 ข้อมูลสินค้า</h2>
              <div className="form-group">
                <label htmlFor="productCategories">หมวดหมู่สินค้าที่ต้องการขาย *</label>
                <select
                  id="productCategories"
                  name="productCategories"
                  value={formData.productCategories}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">เลือกหมวดหมู่สินค้า</option>
                  <option value="อิเล็กทรอนิกส์">อิเล็กทรอนิกส์</option>
                  <option value="เครื่องใช้ไฟฟ้า">เครื่องใช้ไฟฟ้า</option>
                  <option value="เสื้อผ้าและแฟชั่น">เสื้อผ้าและแฟชั่น</option>
                  <option value="อาหารและเครื่องดื่ม">อาหารและเครื่องดื่ม</option>
                  <option value="เครื่องสำอาง">เครื่องสำอาง</option>
                  <option value="ของเล่นและเกม">ของเล่นและเกม</option>
                  <option value="หนังสือและสื่อการเรียน">หนังสือและสื่อการเรียน</option>
                  <option value="อุปกรณ์กีฬา">อุปกรณ์กีฬา</option>
                  <option value="เครื่องมือและอุปกรณ์">เครื่องมือและอุปกรณ์</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="productDescription">รายละเอียดสินค้า *</label>
                <textarea
                  id="productDescription"
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleInputChange}
                  required
                  placeholder="อธิบายประเภทสินค้า Surplus ที่ต้องการขาย เช่น สินค้าเหลือจากการผลิต สินค้าที่มีข้อบกพร่องเล็กน้อย ฯลฯ"
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="monthlyVolume">ปริมาณสินค้าต่อเดือน (โดยประมาณ) *</label>
                  <select
                    id="monthlyVolume"
                    name="monthlyVolume"
                    value={formData.monthlyVolume}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">เลือกปริมาณ</option>
                    <option value="น้อยกว่า 100 ชิ้น">น้อยกว่า 100 ชิ้น</option>
                    <option value="100-500 ชิ้น">100-500 ชิ้น</option>
                    <option value="500-1,000 ชิ้น">500-1,000 ชิ้น</option>
                    <option value="1,000-5,000 ชิ้น">1,000-5,000 ชิ้น</option>
                    <option value="มากกว่า 5,000 ชิ้น">มากกว่า 5,000 ชิ้น</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="experience">ประสบการณ์การขายออนไลน์ *</label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">เลือกประสบการณ์</option>
                    <option value="ไม่มีประสบการณ์">ไม่มีประสบการณ์</option>
                    <option value="น้อยกว่า 1 ปี">น้อยกว่า 1 ปี</option>
                    <option value="1-3 ปี">1-3 ปี</option>
                    <option value="3-5 ปี">3-5 ปี</option>
                    <option value="มากกว่า 5 ปี">มากกว่า 5 ปี</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Additional Information */}
          {currentTab === 3 && (
            <div className="form-section">
              <h2>📝 ข้อมูลเพิ่มเติม</h2>
              <div className="form-group">
                <label htmlFor="motivation">เหตุผลที่ต้องการเข้าร่วมเป็น Vendor *</label>
                <textarea
                  id="motivation"
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  required
                  placeholder="อธิบายเหตุผลที่ต้องการขายสินค้าผ่าน SSS Supply และเป้าหมายทางธุรกิจ"
                />
              </div>

              <div className="form-group">
                <label htmlFor="otherPlatforms">แพลตฟอร์มอื่นที่ใช้ขายสินค้า</label>
                <textarea
                  id="otherPlatforms"
                  name="otherPlatforms"
                  value={formData.otherPlatforms}
                  onChange={handleInputChange}
                  placeholder="เช่น Shopee, Lazada, Facebook, เว็บไซต์ตัวเอง ฯลฯ"
                />
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="terms">
                  ยอมรับ <a href="#" style={{color: '#10b981'}}>ข้อตกลงและเงื่อนไข</a> การเป็น Vendor *
                </label>
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="newsletter"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleInputChange}
                />
                <label htmlFor="newsletter">
                  รับข่าวสารและโปรโมชั่นจาก SSS Supply
                </label>
              </div>
            </div>
          )}

          {/* Submit Section */}
          <div className="submit-section">
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? '🔄 กำลังส่งใบสมัคร...' : '📝 ส่งใบสมัคร'}
            </button>
            <p style={{marginTop: '1rem', color: '#666', fontSize: '0.9rem'}}>
              * ฟิลด์ที่จำเป็นต้องกรอก
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

