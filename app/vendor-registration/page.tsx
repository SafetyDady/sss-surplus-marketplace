'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { submitVendorApplication } from '../../lib/vendorService';
import { validateForm, validateField, documentCategories, allowedFileTypes, fileSizeLimits } from '../../lib/validation';

export default function VendorRegistrationPage() {
  const [formData, setFormData] = useState({
    // ประเภทผู้สมัคร
    applicantType: '',
    
    // บุคคลธรรมดา
    firstName: '',
    lastName: '',
    idCard: '',
    
    // นิติบุคคล
    companyName: '',
    businessType: '',
    taxId: '',
    
    // ข้อมูลติดต่อ
    address: '',
    contactName: '',
    position: '',
    email: '',
    phone: '',
    mobile: '',
    lineId: '',
    website: '',
    
    // ข้อมูลสินค้า
    productCategories: '',
    productDescription: '',
    monthlyVolume: '',
    experience: '',
    
    // ข้อมูลเพิ่มเติม
    motivation: '',
    otherPlatforms: '',
    terms: false,
    newsletter: false,
    
    // เอกสาร
    documents: {}
  });

  const [currentTab, setCurrentTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Real-time validation
    if (name !== 'terms' && name !== 'newsletter') {
      const fieldError = validateField(name, newValue, formData.applicantType);
      setFieldErrors(prev => ({
        ...prev,
        [name]: fieldError[name] || null
      }));
    }
  };

  // Document upload handlers
  const onDrop = useCallback((acceptedFiles, rejectedFiles, docType) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejectionErrors = {};
      rejectedFiles.forEach((rejection, index) => {
        rejection.errors.forEach(error => {
          if (error.code === 'file-too-large') {
            rejectionErrors[`${docType}_rejected_${index}`] = 'ไฟล์มีขนาดเกิน 5MB';
          } else if (error.code === 'file-invalid-type') {
            rejectionErrors[`${docType}_rejected_${index}`] = 'ประเภทไฟล์ไม่ถูกต้อง (รองรับ PDF, JPG, PNG เท่านั้น)';
          }
        });
      });
      
      setFieldErrors(prev => ({
        ...prev,
        ...rejectionErrors
      }));
      
      // Clear rejection errors after 5 seconds
      setTimeout(() => {
        setFieldErrors(prev => {
          const newErrors = { ...prev };
          Object.keys(rejectionErrors).forEach(key => {
            delete newErrors[key];
          });
          return newErrors;
        });
      }, 5000);
    }

    // Handle accepted files
    if (acceptedFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [docType]: [...(prev.documents[docType] || []), ...acceptedFiles]
        }
      }));

      // Clear any previous errors for this document type
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[docType];
        return newErrors;
      });
    }
  }, []);

  const removeDocument = (docType, fileIndex) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: prev.documents[docType].filter((_, index) => index !== fileIndex)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    // Validate form
    const validationErrors = validateForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      setSubmitResult({
        success: false,
        message: 'กรุณาตรวจสอบข้อมูลที่กรอกให้ถูกต้อง'
      });
      return;
    }

    try {
      const result = await submitVendorApplication(formData);
      setSubmitResult(result);
      
      if (result.success) {
        // Reset form on success
        setFormData({
          applicantType: '',
          firstName: '',
          lastName: '',
          idCard: '',
          companyName: '',
          businessType: '',
          taxId: '',
          address: '',
          contactName: '',
          position: '',
          email: '',
          phone: '',
          mobile: '',
          lineId: '',
          website: '',
          productCategories: '',
          productDescription: '',
          monthlyVolume: '',
          experience: '',
          motivation: '',
          otherPlatforms: '',
          terms: false,
          newsletter: false,
          documents: {}
        });
        setCurrentTab(0);
        setErrors({});
        setFieldErrors({});
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
    { id: 0, title: 'ประเภทผู้สมัคร', icon: '👤' },
    { id: 1, title: 'ข้อมูลติดต่อ', icon: '📞' },
    { id: 2, title: 'ข้อมูลสินค้า', icon: '📦' },
    { id: 3, title: 'เอกสารแนบ', icon: '📄' },
    { id: 4, title: 'ข้อมูลเพิ่มเติม', icon: '📝' }
  ];

  const DocumentUpload = ({ docType, config }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (acceptedFiles, rejectedFiles) => onDrop(acceptedFiles, rejectedFiles, docType),
      accept: {
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
        'application/pdf': ['.pdf']
      },
      maxSize: fileSizeLimits.maxFileSize,
      maxFiles: config.maxFiles
    });

    const uploadedFiles = formData.documents[docType] || [];

    return (
      <div className="document-upload">
        <label className="document-label">
          {config.label} {config.required && '*'}
        </label>
        <p className="document-description">{config.description}</p>
        
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          <div className="dropzone-content">
            <div className="dropzone-icon">📁</div>
            <p>
              {isDragActive ? 
                'วางไฟล์ที่นี่...' : 
                'ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์'
              }
            </p>
            <p className="dropzone-info">
              รองรับ PDF, JPG, PNG • สูงสุด {config.maxFiles} ไฟล์ • ขนาดไม่เกิน 5MB ต่อไฟล์
            </p>
          </div>
        </div>

        {/* Display uploaded files */}
        {uploadedFiles.length > 0 && (
          <div className="uploaded-files">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="uploaded-file">
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeDocument(docType, index)}
                  className="remove-file-btn"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Display errors */}
        {fieldErrors[docType] && (
          <div className="field-error">{fieldErrors[docType]}</div>
        )}
        {errors.documents && errors.documents[docType] && (
          <div className="field-error">{errors.documents[docType]}</div>
        )}
      </div>
    );
  };

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
          overflow-x: auto;
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
          min-width: 120px;
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

        .form-group input.error,
        .form-group textarea.error,
        .form-group select.error {
          border-color: #ef4444;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        .field-error {
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .applicant-type-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .applicant-type-card {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .applicant-type-card:hover {
          border-color: #10b981;
        }

        .applicant-type-card.selected {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .applicant-type-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .applicant-type-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .applicant-type-description {
          color: #666;
          font-size: 0.9rem;
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

        .document-upload {
          margin-bottom: 2rem;
        }

        .document-label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .document-description {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .dropzone {
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .dropzone:hover,
        .dropzone.active {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .dropzone-content {
          pointer-events: none;
        }

        .dropzone-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .dropzone-info {
          color: #666;
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }

        .uploaded-files {
          margin-top: 1rem;
        }

        .uploaded-file {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 8px;
          margin-bottom: 0.5rem;
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .file-name {
          font-weight: 500;
        }

        .file-size {
          color: #666;
          font-size: 0.875rem;
        }

        .remove-file-btn {
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
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
          
          .form-grid,
          .applicant-type-selector {
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
          <p>เข้าร่วมเป็นส่วนหนึ่งของ MTP Supply Marketplace แพลตฟอร์มการซื้อขายสินค้า Surplus ที่ใหญ่ที่สุดในประเทศไทย</p>
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
          {/* Tab 0: Applicant Type */}
          {currentTab === 0 && (
            <div className="form-section">
              <h2>👤 ประเภทผู้สมัคร</h2>
              <div className="applicant-type-selector">
                <div 
                  className={`applicant-type-card ${formData.applicantType === 'individual' ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, applicantType: 'individual' }))}
                >
                  <div className="applicant-type-icon">👤</div>
                  <div className="applicant-type-title">บุคคลธรรมดา</div>
                  <div className="applicant-type-description">
                    ผู้ประกอบการรายย่อย<br/>
                    ต้องแนบบัตรประชาชน และทะเบียนบ้าน
                  </div>
                </div>
                
                <div 
                  className={`applicant-type-card ${formData.applicantType === 'company' ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, applicantType: 'company' }))}
                >
                  <div className="applicant-type-icon">🏢</div>
                  <div className="applicant-type-title">นิติบุคคล</div>
                  <div className="applicant-type-description">
                    บริษัท ห้างหุ้นส่วน<br/>
                    ต้องแนบหนังสือรับรองบริษัท และบริคณห์สนธิ
                  </div>
                </div>
              </div>
              
              {errors.applicantType && (
                <div className="field-error">{errors.applicantType}</div>
              )}

              {/* Individual Fields */}
              {formData.applicantType === 'individual' && (
                <>
                  <h3>ข้อมูลส่วนตัว</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="firstName">ชื่อ *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={fieldErrors.firstName || errors.firstName ? 'error' : ''}
                        placeholder="สมชาย"
                      />
                      {(fieldErrors.firstName || errors.firstName) && (
                        <div className="field-error">{fieldErrors.firstName || errors.firstName}</div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="lastName">นามสกุล *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={fieldErrors.lastName || errors.lastName ? 'error' : ''}
                        placeholder="ใจดี"
                      />
                      {(fieldErrors.lastName || errors.lastName) && (
                        <div className="field-error">{fieldErrors.lastName || errors.lastName}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="idCard">เลขบัตรประชาชน *</label>
                    <input
                      type="text"
                      id="idCard"
                      name="idCard"
                      value={formData.idCard}
                      onChange={handleInputChange}
                      className={fieldErrors.idCard || errors.idCard ? 'error' : ''}
                      placeholder="1234567890123"
                      maxLength="13"
                    />
                    {(fieldErrors.idCard || errors.idCard) && (
                      <div className="field-error">{fieldErrors.idCard || errors.idCard}</div>
                    )}
                  </div>
                </>
              )}

              {/* Company Fields */}
              {formData.applicantType === 'company' && (
                <>
                  <h3>ข้อมูลบริษัท</h3>
                  <div className="form-group">
                    <label htmlFor="companyName">ชื่อบริษัท *</label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={fieldErrors.companyName || errors.companyName ? 'error' : ''}
                      placeholder="บริษัท ABC จำกัด"
                    />
                    {(fieldErrors.companyName || errors.companyName) && (
                      <div className="field-error">{fieldErrors.companyName || errors.companyName}</div>
                    )}
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="businessType">ประเภทธุรกิจ *</label>
                      <select
                        id="businessType"
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className={fieldErrors.businessType || errors.businessType ? 'error' : ''}
                      >
                        <option value="">เลือกประเภทธุรกิจ</option>
                        <option value="บริษัทจำกัด">บริษัทจำกัด</option>
                        <option value="ห้างหุ้นส่วนจำกัด">ห้างหุ้นส่วนจำกัด</option>
                        <option value="ห้างหุ้นส่วนสามัญ">ห้างหุ้นส่วนสามัญ</option>
                        <option value="สหกรณ์">สหกรณ์</option>
                        <option value="อื่นๆ">อื่นๆ</option>
                      </select>
                      {(fieldErrors.businessType || errors.businessType) && (
                        <div className="field-error">{fieldErrors.businessType || errors.businessType}</div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="taxId">เลขประจำตัวผู้เสียภาษี *</label>
                      <input
                        type="text"
                        id="taxId"
                        name="taxId"
                        value={formData.taxId}
                        onChange={handleInputChange}
                        className={fieldErrors.taxId || errors.taxId ? 'error' : ''}
                        placeholder="1234567890123"
                        maxLength="13"
                      />
                      {(fieldErrors.taxId || errors.taxId) && (
                        <div className="field-error">{fieldErrors.taxId || errors.taxId}</div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tab 1: Contact Information */}
          {currentTab === 1 && (
            <div className="form-section">
              <h2>📞 ข้อมูลติดต่อ</h2>
              
              <div className="form-group full-width">
                <label htmlFor="address">ที่อยู่ *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={fieldErrors.address || errors.address ? 'error' : ''}
                  placeholder="123/45 ถนนสุขุมวิท แขวงคลองตัน เขตวัฒนา กรุงเทพมหานคร 10110"
                />
                {(fieldErrors.address || errors.address) && (
                  <div className="field-error">{fieldErrors.address || errors.address}</div>
                )}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="contactName">ชื่อผู้ติดต่อ *</label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    className={fieldErrors.contactName || errors.contactName ? 'error' : ''}
                    placeholder="นายสมชาย ใจดี"
                  />
                  {(fieldErrors.contactName || errors.contactName) && (
                    <div className="field-error">{fieldErrors.contactName || errors.contactName}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="position">ตำแหน่ง *</label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className={fieldErrors.position || errors.position ? 'error' : ''}
                    placeholder="ผู้จัดการฝ่ายขาย"
                  />
                  {(fieldErrors.position || errors.position) && (
                    <div className="field-error">{fieldErrors.position || errors.position}</div>
                  )}
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
                  className={fieldErrors.email || errors.email ? 'error' : ''}
                  placeholder="contact@company.com"
                />
                {(fieldErrors.email || errors.email) && (
                  <div className="field-error">{fieldErrors.email || errors.email}</div>
                )}
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
                    className={fieldErrors.phone || errors.phone ? 'error' : ''}
                    placeholder="02-123-4567"
                  />
                  {(fieldErrors.phone || errors.phone) && (
                    <div className="field-error">{fieldErrors.phone || errors.phone}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="mobile">เบอร์มือถือ *</label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={fieldErrors.mobile || errors.mobile ? 'error' : ''}
                    placeholder="0891234567"
                    maxLength="10"
                  />
                  {(fieldErrors.mobile || errors.mobile) && (
                    <div className="field-error">{fieldErrors.mobile || errors.mobile}</div>
                  )}
                </div>
              </div>

              <div className="form-grid">
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
                
                <div className="form-group">
                  <label htmlFor="website">เว็บไซต์</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className={fieldErrors.website || errors.website ? 'error' : ''}
                    placeholder="https://www.company.com"
                  />
                  {(fieldErrors.website || errors.website) && (
                    <div className="field-error">{fieldErrors.website || errors.website}</div>
                  )}
                </div>
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
                  className={fieldErrors.productCategories || errors.productCategories ? 'error' : ''}
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
                {(fieldErrors.productCategories || errors.productCategories) && (
                  <div className="field-error">{fieldErrors.productCategories || errors.productCategories}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="productDescription">รายละเอียดสินค้า *</label>
                <textarea
                  id="productDescription"
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleInputChange}
                  className={fieldErrors.productDescription || errors.productDescription ? 'error' : ''}
                  placeholder="อธิบายประเภทสินค้า Surplus ที่ต้องการขาย เช่น สินค้าเหลือจากการผลิต สินค้าที่มีข้อบกพร่องเล็กน้อย ฯลฯ"
                />
                {(fieldErrors.productDescription || errors.productDescription) && (
                  <div className="field-error">{fieldErrors.productDescription || errors.productDescription}</div>
                )}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="monthlyVolume">ปริมาณสินค้าต่อเดือน (โดยประมาณ) *</label>
                  <select
                    id="monthlyVolume"
                    name="monthlyVolume"
                    value={formData.monthlyVolume}
                    onChange={handleInputChange}
                    className={fieldErrors.monthlyVolume || errors.monthlyVolume ? 'error' : ''}
                  >
                    <option value="">เลือกปริมาณ</option>
                    <option value="น้อยกว่า 100 ชิ้น">น้อยกว่า 100 ชิ้น</option>
                    <option value="100-500 ชิ้น">100-500 ชิ้น</option>
                    <option value="500-1,000 ชิ้น">500-1,000 ชิ้น</option>
                    <option value="1,000-5,000 ชิ้น">1,000-5,000 ชิ้น</option>
                    <option value="มากกว่า 5,000 ชิ้น">มากกว่า 5,000 ชิ้น</option>
                  </select>
                  {(fieldErrors.monthlyVolume || errors.monthlyVolume) && (
                    <div className="field-error">{fieldErrors.monthlyVolume || errors.monthlyVolume}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="experience">ประสบการณ์การขายออนไลน์</label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
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

          {/* Tab 3: Document Upload */}
          {currentTab === 3 && formData.applicantType && (
            <div className="form-section">
              <h2>📄 เอกสารแนบ</h2>
              <p style={{marginBottom: '2rem', color: '#666'}}>
                กรุณาแนบเอกสารตามประเภทผู้สมัครที่เลือก ไฟล์ต้องเป็น PDF, JPG หรือ PNG เท่านั้น
              </p>
              
              {Object.entries(documentCategories[formData.applicantType]).map(([docType, config]) => (
                <DocumentUpload key={docType} docType={docType} config={config} />
              ))}
            </div>
          )}

          {/* Tab 4: Additional Information */}
          {currentTab === 4 && (
            <div className="form-section">
              <h2>📝 ข้อมูลเพิ่มเติม</h2>
              <div className="form-group">
                <label htmlFor="motivation">เหตุผลที่ต้องการเข้าร่วมเป็น Vendor *</label>
                <textarea
                  id="motivation"
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  className={fieldErrors.motivation || errors.motivation ? 'error' : ''}
                  placeholder="อธิบายเหตุผลที่ต้องการขายสินค้าผ่าน MTP Supply และเป้าหมายทางธุรกิจ"
                />
                {(fieldErrors.motivation || errors.motivation) && (
                  <div className="field-error">{fieldErrors.motivation || errors.motivation}</div>
                )}
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
                />
                <label htmlFor="terms">
                  ยอมรับ <a href="#" style={{color: '#10b981'}}>ข้อตกลงและเงื่อนไข</a> การเป็น Vendor *
                </label>
              </div>
              {errors.terms && (
                <div className="field-error">{errors.terms}</div>
              )}

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="newsletter"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleInputChange}
                />
                <label htmlFor="newsletter">
                  รับข่าวสารและโปรโมชั่นจาก MTP Supply
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

