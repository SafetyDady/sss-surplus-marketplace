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

const ContactContentAdmin = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // State for each section
  const [heroData, setHeroData] = useState<HeroData>({
    title: '',
    subtitle: ''
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phones: { office: '', mobile: '' },
    emails: { general: '', sales: '', support: '' },
    social: { line: '', facebook: '' }
  });

  const [vendorData, setVendorData] = useState<VendorData>({
    title: '',
    subtitle: '',
    features: [
      { icon: '🌟', title: '', description: '' },
      { icon: '💰', title: '', description: '' },
      { icon: '🚀', title: '', description: '' },
      { icon: '💎', title: '', description: '' }
    ]
  });

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState('');

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadHeroData(),
        loadContactInfo(),
        loadVendorData(),
        loadSubjects()
      ]);
    } catch (error) {
      showMessage('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadHeroData = async () => {
    try {
      const response = await fetch('/api/contact-content/hero');
      const result = await response.json();
      if (result.success) {
        setHeroData(result.data);
      }
    } catch (error) {
      console.error('Error loading hero data:', error);
    }
  };

  const loadContactInfo = async () => {
    try {
      const response = await fetch('/api/contact-content/info');
      const result = await response.json();
      if (result.success) {
        setContactInfo(result.data);
      }
    } catch (error) {
      console.error('Error loading contact info:', error);
    }
  };

  const loadVendorData = async () => {
    try {
      const response = await fetch('/api/contact-content/vendor');
      const result = await response.json();
      if (result.success) {
        setVendorData(result.data);
      }
    } catch (error) {
      console.error('Error loading vendor data:', error);
    }
  };

  const loadSubjects = async () => {
    try {
      const response = await fetch('/api/contact-content/subjects');
      const result = await response.json();
      if (result.success) {
        setSubjects(result.data);
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const saveHeroData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/contact-content/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroData)
      });
      const result = await response.json();
      if (result.success) {
        showMessage('บันทึก Hero Section เรียบร้อยแล้ว', 'success');
      } else {
        showMessage(result.error || 'เกิดข้อผิดพลาด', 'error');
      }
    } catch (error) {
      showMessage('เกิดข้อผิดพลาดในการบันทึก', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveContactInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/contact-content/info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactInfo)
      });
      const result = await response.json();
      if (result.success) {
        showMessage('บันทึกข้อมูลติดต่อเรียบร้อยแล้ว', 'success');
      } else {
        showMessage(result.error || 'เกิดข้อผิดพลาด', 'error');
      }
    } catch (error) {
      showMessage('เกิดข้อผิดพลาดในการบันทึก', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveVendorData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/contact-content/vendor', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorData)
      });
      const result = await response.json();
      if (result.success) {
        showMessage('บันทึก Vendor Section เรียบร้อยแล้ว', 'success');
      } else {
        showMessage(result.error || 'เกิดข้อผิดพลาด', 'error');
      }
    } catch (error) {
      showMessage('เกิดข้อผิดพลาดในการบันทึก', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addSubject = async () => {
    if (!newSubject.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/contact-content/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSubject })
      });
      const result = await response.json();
      if (result.success) {
        setNewSubject('');
        await loadSubjects();
        showMessage('เพิ่มหัวข้อใหม่เรียบร้อยแล้ว', 'success');
      } else {
        showMessage(result.error || 'เกิดข้อผิดพลาด', 'error');
      }
    } catch (error) {
      showMessage('เกิดข้อผิดพลาดในการเพิ่มหัวข้อ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteSubject = async (id: string) => {
    if (!confirm('คุณต้องการลบหัวข้อนี้หรือไม่?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/contact-content/subjects?id=${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        await loadSubjects();
        showMessage('ลบหัวข้อเรียบร้อยแล้ว', 'success');
      } else {
        showMessage(result.error || 'เกิดข้อผิดพลาด', 'error');
      }
    } catch (error) {
      showMessage('เกิดข้อผิดพลาดในการลบหัวข้อ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const editSubject = async (id: string, currentName: string) => {
    const newName = prompt('แก้ไขหัวข้อ:', currentName);
    if (!newName || newName.trim() === '' || newName === currentName) return;
    
    setLoading(true);
    try {
      const subject = subjects.find(s => s.id === id);
      const response = await fetch('/api/contact-content/subjects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name: newName,
          active: subject?.active || true,
          order: subject?.order || 1
        })
      });
      const result = await response.json();
      if (result.success) {
        await loadSubjects();
        showMessage('แก้ไขหัวข้อเรียบร้อยแล้ว', 'success');
      } else {
        showMessage(result.error || 'เกิดข้อผิดพลาด', 'error');
      }
    } catch (error) {
      showMessage('เกิดข้อผิดพลาดในการแก้ไขหัวข้อ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        .admin-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        
        .page-title {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #374151;
          font-weight: bold;
        }
        
        .page-subtitle {
          color: #6b7280;
          margin-bottom: 2rem;
        }
        
        .tabs {
          display: flex;
          background: white;
          border-radius: 8px 8px 0 0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .tab {
          flex: 1;
          padding: 1rem;
          text-align: center;
          background: #f9fafb;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s;
          border-right: 1px solid #e5e7eb;
        }
        
        .tab:last-child {
          border-right: none;
        }
        
        .tab.active {
          background: white;
          color: #667eea;
          border-bottom: 3px solid #667eea;
        }
        
        .tab:hover:not(.active) {
          background: #f3f4f6;
        }
        
        .tab-content {
          background: white;
          border-radius: 0 0 8px 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 2rem;
          display: none;
        }
        
        .tab-content.active {
          display: block;
        }
        
        .form-section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }
        
        .form-section h3 {
          color: #374151;
          margin-bottom: 1rem;
          font-size: 1.2rem;
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
        
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
        }
        
        .form-group textarea {
          height: 100px;
          resize: vertical;
        }
        
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }
        
        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .btn-primary {
          background: #667eea;
          color: white;
        }
        
        .btn-primary:hover {
          background: #5a67d8;
          transform: translateY(-1px);
        }
        
        .btn-success {
          background: #10b981;
          color: white;
        }
        
        .btn-success:hover {
          background: #059669;
        }
        
        .btn-danger {
          background: #ef4444;
          color: white;
        }
        
        .btn-danger:hover {
          background: #dc2626;
        }
        
        .btn-secondary {
          background: #6b7280;
          color: white;
        }
        
        .btn-secondary:hover {
          background: #4b5563;
        }
        
        .btn-sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
        }
        
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .status-message {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
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
        
        .subject-list {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .subject-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .subject-item:last-child {
          border-bottom: none;
        }
        
        .subject-name {
          font-weight: 500;
        }
        
        .subject-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .add-subject-form {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .add-subject-form input {
          flex: 1;
        }
        
        @media (max-width: 768px) {
          .tabs {
            flex-direction: column;
          }
          
          .contact-grid {
            grid-template-columns: 1fr;
          }
          
          .add-subject-form {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="admin-container">
        <h1 className="page-title">จัดการหน้า Contact Us</h1>
        <p className="page-subtitle">แก้ไขข้อมูลและเนื้อหาในหน้าติดต่อเรา</p>

        {/* Status Messages */}
        {message.text && (
          <div className={`status-message status-${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveTab('hero')}
          >
            Hero Section
          </button>
          <button 
            className={`tab ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            ข้อมูลติดต่อ
          </button>
          <button 
            className={`tab ${activeTab === 'vendor' ? 'active' : ''}`}
            onClick={() => setActiveTab('vendor')}
          >
            Vendor Section
          </button>
          <button 
            className={`tab ${activeTab === 'subjects' ? 'active' : ''}`}
            onClick={() => setActiveTab('subjects')}
          >
            หัวข้อ Dropdown
          </button>
        </div>

        {/* Hero Section Tab */}
        <div className={`tab-content ${activeTab === 'hero' ? 'active' : ''}`}>
          <form onSubmit={saveHeroData}>
            <div className="form-section">
              <h3>🎯 Hero Section</h3>
              
              <div className="form-group">
                <label htmlFor="heroTitle">หัวข้อหลัก</label>
                <input 
                  type="text" 
                  id="heroTitle" 
                  value={heroData.title}
                  onChange={(e) => setHeroData({...heroData, title: e.target.value})}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="heroSubtitle">ข้อความรอง</label>
                <textarea 
                  id="heroSubtitle" 
                  value={heroData.subtitle}
                  onChange={(e) => setHeroData({...heroData, subtitle: e.target.value})}
                  required 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'กำลังบันทึก...' : '💾 บันทึกการเปลี่ยนแปลง'}
            </button>
          </form>
        </div>

        {/* Contact Info Tab */}
        <div className={`tab-content ${activeTab === 'contact' ? 'active' : ''}`}>
          <form onSubmit={saveContactInfo}>
            <div className="form-section">
              <h3>📞 ข้อมูลติดต่อ</h3>
              
              <div className="contact-grid">
                <div>
                  <h4>เบอร์โทรศัพท์</h4>
                  <div className="form-group">
                    <label htmlFor="officePhone">โทรศัพท์สำนักงาน</label>
                    <input 
                      type="text" 
                      id="officePhone" 
                      value={contactInfo.phones.office}
                      onChange={(e) => setContactInfo({
                        ...contactInfo, 
                        phones: {...contactInfo.phones, office: e.target.value}
                      })}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="mobilePhone">มือถือ</label>
                    <input 
                      type="text" 
                      id="mobilePhone" 
                      value={contactInfo.phones.mobile}
                      onChange={(e) => setContactInfo({
                        ...contactInfo, 
                        phones: {...contactInfo.phones, mobile: e.target.value}
                      })}
                      required 
                    />
                  </div>
                </div>

                <div>
                  <h4>อีเมล</h4>
                  <div className="form-group">
                    <label htmlFor="generalEmail">อีเมลทั่วไป</label>
                    <input 
                      type="email" 
                      id="generalEmail" 
                      value={contactInfo.emails.general}
                      onChange={(e) => setContactInfo({
                        ...contactInfo, 
                        emails: {...contactInfo.emails, general: e.target.value}
                      })}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="salesEmail">อีเมลขาย</label>
                    <input 
                      type="email" 
                      id="salesEmail" 
                      value={contactInfo.emails.sales}
                      onChange={(e) => setContactInfo({
                        ...contactInfo, 
                        emails: {...contactInfo.emails, sales: e.target.value}
                      })}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="supportEmail">อีเมลสนับสนุน</label>
                    <input 
                      type="email" 
                      id="supportEmail" 
                      value={contactInfo.emails.support}
                      onChange={(e) => setContactInfo({
                        ...contactInfo, 
                        emails: {...contactInfo.emails, support: e.target.value}
                      })}
                      required 
                    />
                  </div>
                </div>

                <div>
                  <h4>ช่องทางออนไลน์</h4>
                  <div className="form-group">
                    <label htmlFor="lineId">Line ID</label>
                    <input 
                      type="text" 
                      id="lineId" 
                      value={contactInfo.social.line}
                      onChange={(e) => setContactInfo({
                        ...contactInfo, 
                        social: {...contactInfo.social, line: e.target.value}
                      })}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="facebook">Facebook</label>
                    <input 
                      type="text" 
                      id="facebook" 
                      value={contactInfo.social.facebook}
                      onChange={(e) => setContactInfo({
                        ...contactInfo, 
                        social: {...contactInfo.social, facebook: e.target.value}
                      })}
                      required 
                    />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'กำลังบันทึก...' : '💾 บันทึกการเปลี่ยนแปลง'}
            </button>
          </form>
        </div>

        {/* Vendor Section Tab */}
        <div className={`tab-content ${activeTab === 'vendor' ? 'active' : ''}`}>
          <form onSubmit={saveVendorData}>
            <div className="form-section">
              <h3>🤝 Vendor Section</h3>
              
              <div className="form-group">
                <label htmlFor="vendorTitle">หัวข้อ</label>
                <input 
                  type="text" 
                  id="vendorTitle" 
                  value={vendorData.title}
                  onChange={(e) => setVendorData({...vendorData, title: e.target.value})}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="vendorSubtitle">ข้อความรอง</label>
                <textarea 
                  id="vendorSubtitle" 
                  value={vendorData.subtitle}
                  onChange={(e) => setVendorData({...vendorData, subtitle: e.target.value})}
                  required 
                />
              </div>

              <h4>ฟีเจอร์ 4 ข้อ</h4>
              <div className="contact-grid">
                {vendorData.features.map((feature, index) => (
                  <div key={index} className="form-group">
                    <label htmlFor={`feature${index + 1}`}>ฟีเจอร์ที่ {index + 1}</label>
                    <input 
                      type="text" 
                      id={`feature${index + 1}`} 
                      value={feature.title}
                      onChange={(e) => {
                        const newFeatures = [...vendorData.features];
                        newFeatures[index] = {...feature, title: e.target.value};
                        setVendorData({...vendorData, features: newFeatures});
                      }}
                      required 
                    />
                    <textarea 
                      placeholder="คำอธิบาย"
                      value={feature.description}
                      onChange={(e) => {
                        const newFeatures = [...vendorData.features];
                        newFeatures[index] = {...feature, description: e.target.value};
                        setVendorData({...vendorData, features: newFeatures});
                      }}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'กำลังบันทึก...' : '💾 บันทึกการเปลี่ยนแปลง'}
            </button>
          </form>
        </div>

        {/* Subjects Tab */}
        <div className={`tab-content ${activeTab === 'subjects' ? 'active' : ''}`}>
          <div className="form-section">
            <h3>📝 จัดการหัวข้อ Dropdown</h3>
            
            <div className="add-subject-form">
              <input 
                type="text" 
                placeholder="เพิ่มหัวข้อใหม่..." 
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSubject()}
              />
              <button 
                type="button" 
                className="btn btn-success" 
                onClick={addSubject}
                disabled={loading}
              >
                ➕ เพิ่ม
              </button>
            </div>

            <div className="subject-list">
              {subjects.map((subject) => (
                <div key={subject.id} className="subject-item">
                  <span className="subject-name">{subject.name}</span>
                  <div className="subject-actions">
                    <button 
                      className="btn btn-secondary btn-sm" 
                      onClick={() => editSubject(subject.id, subject.name)}
                      disabled={loading}
                    >
                      ✏️ แก้ไข
                    </button>
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => deleteSubject(subject.id)}
                      disabled={loading}
                    >
                      🗑️ ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactContentAdmin;

