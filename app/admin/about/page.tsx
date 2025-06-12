'use client';

import React, { useState, useEffect } from 'react';

export default function AboutUsManagement() {
  const [aboutUsData, setAboutUsData] = useState({
    companyName: '',
    foundedYear: '',
    description: '',
    history: '',
    mission: '',
    vision: '',
    values: [],
    teamMembers: [],
    statistics: {
      customers: '',
      partners: '',
      serviceHours: '',
      yearsOfExperience: ''
    }
  });

  const [activeTab, setActiveTab] = useState('company');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load data from API
  useEffect(() => {
    fetchAboutUsData();
  }, []);

  const fetchAboutUsData = async () => {
    try {
      const response = await fetch('/api/about-us');
      if (response.ok) {
        const data = await response.json();
        setAboutUsData(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/about-us', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aboutUsData),
      });

      if (response.ok) {
        alert('บันทึกข้อมูลเรียบร้อยแล้ว!');
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSaving(false);
    }
  };

  const addValue = () => {
    const newValues = [...(aboutUsData.values || []), { icon: '', title: '', description: '' }];
    setAboutUsData({ ...aboutUsData, values: newValues });
  };

  const updateValue = (index, field, value) => {
    const newValues = [...(aboutUsData.values || [])];
    newValues[index] = { ...newValues[index], [field]: value };
    setAboutUsData({ ...aboutUsData, values: newValues });
  };

  const removeValue = (index) => {
    const newValues = (aboutUsData.values || []).filter((_, i) => i !== index);
    setAboutUsData({ ...aboutUsData, values: newValues });
  };

  const addTeamMember = () => {
    const newMembers = [...(aboutUsData.teamMembers || []), { 
      name: '', 
      position: '', 
      bio: '', 
      image: '', 
      visible: true 
    }];
    setAboutUsData({ ...aboutUsData, teamMembers: newMembers });
  };

  const updateTeamMember = (index, field, value) => {
    const newMembers = [...(aboutUsData.teamMembers || [])];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setAboutUsData({ ...aboutUsData, teamMembers: newMembers });
  };

  const removeTeamMember = (index) => {
    const newMembers = (aboutUsData.teamMembers || []).filter((_, i) => i !== index);
    setAboutUsData({ ...aboutUsData, teamMembers: newMembers });
  };

  const toggleMemberVisibility = (index) => {
    const newMembers = [...(aboutUsData.teamMembers || [])];
    newMembers[index] = { ...newMembers[index], visible: !newMembers[index].visible };
    setAboutUsData({ ...aboutUsData, teamMembers: newMembers });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">จัดการหน้า About Us</h1>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">Admin Panel</span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={addValue}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                +เพิ่มข้อมูล
              </button>
              <button
                onClick={() => window.open('/about', '_blank')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                👁️ ดูตัวอย่าง
              </button>
              <button
                onClick={saveData}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {saving ? '💾 กำลังบันทึก...' : '💾 บันทึกข้อมูล'}
              </button>
              <a
                href="/admin"
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                ← กลับ Dashboard
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('company')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'company'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🏢 ข้อมูลบริษัท
          </button>
          <button
            onClick={() => setActiveTab('mission')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'mission'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🎯 พันธกิจ & วิสัยทัศน์
          </button>
          <button
            onClick={() => setActiveTab('values')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'values'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            💎 ค่านิยม
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'team'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            👥 ทีมงาน
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'statistics'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 สถิติ
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {/* Company Tab */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">ข้อมูลบริษัท</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อบริษัท</label>
                  <input
                    type="text"
                    value={aboutUsData.companyName}
                    onChange={(e) => setAboutUsData({ ...aboutUsData, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ชื่อบริษัท"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ปีที่ก่อตั้ง</label>
                  <input
                    type="number"
                    value={aboutUsData.foundedYear}
                    onChange={(e) => setAboutUsData({ ...aboutUsData, foundedYear: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2024"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">คำอธิบายบริษัท</label>
                <textarea
                  value={aboutUsData.description}
                  onChange={(e) => setAboutUsData({ ...aboutUsData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="คำอธิบายสั้นๆ เกี่ยวกับบริษัท"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ประวัติบริษัท</label>
                <textarea
                  value={aboutUsData.history}
                  onChange={(e) => setAboutUsData({ ...aboutUsData, history: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ประวัติและการเริ่มต้นของบริษัท"
                />
              </div>

              <button
                onClick={saveData}
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                {saving ? '💾 กำลังบันทึก...' : '💾 บันทึกการเปลี่ยนแปลง'}
              </button>
            </div>
          )}

          {/* Mission Tab */}
          {activeTab === 'mission' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">พันธกิจ & วิสัยทัศน์</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">พันธกิจ</label>
                <textarea
                  value={aboutUsData.mission}
                  onChange={(e) => setAboutUsData({ ...aboutUsData, mission: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="พันธกิจของบริษัท"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">วิสัยทัศน์</label>
                <textarea
                  value={aboutUsData.vision}
                  onChange={(e) => setAboutUsData({ ...aboutUsData, vision: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="วิสัยทัศน์ของบริษัท"
                />
              </div>

              <button
                onClick={saveData}
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                {saving ? '💾 กำลังบันทึก...' : '💾 บันทึกการเปลี่ยนแปลง'}
              </button>
            </div>
          )}

          {/* Values Tab */}
          {activeTab === 'values' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">ค่านิยมองค์กร</h2>
                <button
                  onClick={addValue}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  + เพิ่มค่านิยม
                </button>
              </div>
              
              {(aboutUsData.values || []).map((value, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-900">ค่านิยมที่ {index + 1}</h3>
                    <button
                      onClick={() => removeValue(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ลบ
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ไอคอน</label>
                      <input
                        type="text"
                        value={value.icon || ''}
                        onChange={(e) => updateValue(index, 'icon', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="🎯"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">หัวข้อ</label>
                      <input
                        type="text"
                        value={value.title || ''}
                        onChange={(e) => updateValue(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="ชื่อค่านิยม"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">คำอธิบาย</label>
                      <textarea
                        value={value.description || ''}
                        onChange={(e) => updateValue(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="คำอธิบายค่านิยม"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={saveData}
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                {saving ? '💾 กำลังบันทึก...' : '💾 บันทึกการเปลี่ยนแปลง'}
              </button>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">ทีมผู้บริหาร</h2>
                <button
                  onClick={addTeamMember}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  + เพิ่มสมาชิก
                </button>
              </div>
              
              {(aboutUsData.teamMembers || []).map((member, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-900">สมาชิกทีมที่ {index + 1}</h3>
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={member.visible !== false}
                          onChange={() => toggleMemberVisibility(index)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">แสดงในหน้าเว็บ</span>
                      </label>
                      <button
                        onClick={() => removeTeamMember(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ</label>
                      <input
                        type="text"
                        value={member.name || ''}
                        onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="ชื่อสมาชิก"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ตำแหน่ง</label>
                      <input
                        type="text"
                        value={member.position || ''}
                        onChange={(e) => updateTeamMember(index, 'position', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="ตำแหน่งงาน"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">ประวัติ</label>
                      <textarea
                        value={member.bio || ''}
                        onChange={(e) => updateTeamMember(index, 'bio', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="ประวัติและประสบการณ์"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">URL รูปภาพ</label>
                      <input
                        type="url"
                        value={member.image || ''}
                        onChange={(e) => updateTeamMember(index, 'image', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={saveData}
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                {saving ? '💾 กำลังบันทึก...' : '💾 บันทึกการเปลี่ยนแปลง'}
              </button>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'statistics' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">สถิติบริษัท</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">จำนวนลูกค้า</label>
                  <input
                    type="text"
                    value={aboutUsData.statistics?.customers || ''}
                    onChange={(e) => setAboutUsData({ 
                      ...aboutUsData, 
                      statistics: { ...aboutUsData.statistics, customers: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1000+"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">จำนวนพาร์ทเนอร์</label>
                  <input
                    type="text"
                    value={aboutUsData.statistics?.partners || ''}
                    onChange={(e) => setAboutUsData({ 
                      ...aboutUsData, 
                      statistics: { ...aboutUsData.statistics, partners: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="50+"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ชั่วโมงการให้บริการ</label>
                  <input
                    type="text"
                    value={aboutUsData.statistics?.serviceHours || ''}
                    onChange={(e) => setAboutUsData({ 
                      ...aboutUsData, 
                      statistics: { ...aboutUsData.statistics, serviceHours: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10000+"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ปีของประสบการณ์</label>
                  <input
                    type="text"
                    value={aboutUsData.statistics?.yearsOfExperience || ''}
                    onChange={(e) => setAboutUsData({ 
                      ...aboutUsData, 
                      statistics: { ...aboutUsData.statistics, yearsOfExperience: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10+"
                  />
                </div>
              </div>

              <button
                onClick={saveData}
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                {saving ? '💾 กำลังบันทึก...' : '💾 บันทึกการเปลี่ยนแปลง'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

