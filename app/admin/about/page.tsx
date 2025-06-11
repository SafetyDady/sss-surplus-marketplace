'use client';

import React, { useState, useEffect } from 'react';

export default function AdminAboutPage() {
  const [activeTab, setActiveTab] = useState('story');
  const [formData, setFormData] = useState({
    story: {
      title: 'เรื่องราวของเรา',
      paragraph1: 'MTP Supply ก่อตั้งขึ้นในปี 2014 ด้วยวิสัยทัศน์ในการเป็นผู้นำด้านการจัดหาสินค้าคุณภาพสูง เราเริ่มต้นจากธุรกิจขนาดเล็กและเติบโตมาเป็นบริษัทชั้นนำที่มีเครือข่ายกว้างขวางทั่วประเทศ',
      paragraph2: 'ด้วยความมุ่งมั่นในการให้บริการที่เป็นเลิศและการสร้างความสัมพันธ์ที่ยั่งยืนกับลูกค้า เราได้รับความไว้วางใจจากพันธมิตรทางธุรกิจและลูกค้ามากมายทั่วประเทศ'
    },
    mission: {
      missionText: 'มุ่งมั่นในการจัดหาและจำหน่ายสินค้าคุณภาพสูงที่ตอบสนองความต้องการของลูกค้า ด้วยบริการที่เป็นเลิศและราคาที่เป็นธรรม เพื่อสร้างความพึงพอใจสูงสุดให้กับลูกค้า',
      visionText: 'เป็นผู้นำด้านการจัดหาสินค้าในประเทศไทย ที่ได้รับการยอมรับในระดับสากล ด้วยนวัตกรรมและเทคโนโลยีที่ทันสมัย เพื่อสร้างอนาคตที่ยั่งยืนร่วมกัน'
    },
    values: [
      { icon: '✅', title: 'คุณภาพ', description: 'มุ่งมั่นในการให้บริการและสินค้าที่มีคุณภาพสูงสุด' },
      { icon: '🔒', title: 'ความน่าเชื่อถือ', description: 'สร้างความไว้วางใจผ่านการปฏิบัติที่โปร่งใสและซื่อสัตย์' },
      { icon: '⚡', title: 'นวัตกรรม', description: 'พัฒนาและปรับปรุงอย่างต่อเนื่องเพื่อตอบสนองความต้องการ' },
      { icon: '👥', title: 'การบริการ', description: 'ให้บริการด้วยใจและความเอาใจใส่ในทุกรายละเอียด' }
    ],
    team: [
      { name: 'สมชาย วิทยากุล', position: 'ประธานเจ้าหน้าที่บริหาร', description: 'ประสบการณ์กว่า 15 ปีในอุตสาหกรรมการจัดหาสินค้า ผู้นำองค์กรด้วยวิสัยทัศน์และความเชี่ยวชาญ', avatar: 'สม' },
      { name: 'อนุชา ธุรกิจดี', position: 'ผู้อำนวยการฝ่ายขาย', description: 'เชี่ยวชาญด้านการขายและการตลาด มีเครือข่ายลูกค้ากว้างขวางทั่วประเทศ', avatar: 'อน' },
      { name: 'ประยุทธ คุณภาพดี', position: 'ผู้อำนวยการฝ่ายปฏิบัติการ', description: 'ผู้เชี่ยวชาญด้านการจัดการห่วงโซ่อุปทานและการควบคุมคุณภาพสินค้า', avatar: 'ปร' }
    ],
    stats: [
      { number: '10+', label: 'ปีประสบการณ์' },
      { number: '1000+', label: 'ลูกค้าพึงพอใจ' },
      { number: '50+', label: 'พันธมิตรทางธุรกิจ' },
      { number: '24/7', label: 'บริการลูกค้า' }
    ]
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('aboutUsData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // Save data to localStorage
  const saveData = (section) => {
    localStorage.setItem('aboutUsData', JSON.stringify(formData));
    alert(`บันทึกข้อมูล${section}เรียบร้อยแล้ว`);
  };

  // Handle form input changes
  const handleInputChange = (section, field, value, index = null) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (index !== null) {
        newData[section][index][field] = value;
      } else {
        newData[section][field] = value;
      }
      return newData;
    });
  };

  // Preview function
  const previewAboutUs = () => {
    window.open('/about', '_blank');
  };

  // Publish function
  const publishChanges = () => {
    localStorage.setItem('aboutUsData', JSON.stringify(formData));
    alert('เผยแพร่การเปลี่ยนแปลงเรียบร้อยแล้ว!');
  };

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
            <div className="flex items-center space-x-4">
              <button
                onClick={previewAboutUs}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                👁️ ดูตัวอย่าง
              </button>
              <button
                onClick={publishChanges}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🚀 เผยแพร่
              </button>
              <a
                href="/admin"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ← กลับ Dashboard
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'story', label: '📖 เรื่องราว', icon: '📖' },
                { id: 'mission', label: '🎯 พันธกิจ & วิสัยทัศน์', icon: '🎯' },
                { id: 'values', label: '💎 ค่านิยม', icon: '💎' },
                { id: 'team', label: '👥 ทีมงาน', icon: '👥' },
                { id: 'stats', label: '📊 สถิติ', icon: '📊' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Story Tab */}
          {activeTab === 'story' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">จัดการเรื่องราวของเรา</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">หัวข้อหลัก</label>
                <input
                  type="text"
                  value={formData.story.title}
                  onChange={(e) => handleInputChange('story', 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ย่อหน้าที่ 1</label>
                <textarea
                  rows={4}
                  value={formData.story.paragraph1}
                  onChange={(e) => handleInputChange('story', 'paragraph1', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ย่อหน้าที่ 2</label>
                <textarea
                  rows={4}
                  value={formData.story.paragraph2}
                  onChange={(e) => handleInputChange('story', 'paragraph2', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => saveData('เรื่องราว')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                💾 บันทึกเรื่องราว
              </button>
            </div>
          )}

          {/* Mission & Vision Tab */}
          {activeTab === 'mission' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">จัดการพันธกิจ & วิสัยทัศน์</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">พันธกิจ</label>
                <textarea
                  rows={4}
                  value={formData.mission.missionText}
                  onChange={(e) => handleInputChange('mission', 'missionText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">วิสัยทัศน์</label>
                <textarea
                  rows={4}
                  value={formData.mission.visionText}
                  onChange={(e) => handleInputChange('mission', 'visionText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => saveData('พันธกิจ & วิสัยทัศน์')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                💾 บันทึกพันธกิจ & วิสัยทัศน์
              </button>
            </div>
          )}

          {/* Values Tab */}
          {activeTab === 'values' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">จัดการค่านิยมองค์กร</h2>
              
              {formData.values.map((value, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4">ค่านิยมที่ {index + 1}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ไอคอน</label>
                      <input
                        type="text"
                        value={value.icon}
                        onChange={(e) => handleInputChange('values', 'icon', e.target.value, index)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">หัวข้อ</label>
                      <input
                        type="text"
                        value={value.title}
                        onChange={(e) => handleInputChange('values', 'title', e.target.value, index)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">คำอธิบาย</label>
                      <textarea
                        rows={2}
                        value={value.description}
                        onChange={(e) => handleInputChange('values', 'description', e.target.value, index)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => saveData('ค่านิยม')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                💾 บันทึกค่านิยม
              </button>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">จัดการทีมผู้บริหาร</h2>
              
              {formData.team.map((member, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4">สมาชิกทีมที่ {index + 1}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ-นามสกุล</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleInputChange('team', 'name', e.target.value, index)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ตำแหน่ง</label>
                      <input
                        type="text"
                        value={member.position}
                        onChange={(e) => handleInputChange('team', 'position', e.target.value, index)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">อักษรย่อ (Avatar)</label>
                      <input
                        type="text"
                        value={member.avatar}
                        onChange={(e) => handleInputChange('team', 'avatar', e.target.value, index)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={2}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">คำอธิบาย</label>
                      <textarea
                        rows={3}
                        value={member.description}
                        onChange={(e) => handleInputChange('team', 'description', e.target.value, index)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => saveData('ทีมงาน')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                💾 บันทึกทีมงาน
              </button>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">จัดการสถิติองค์กร</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.stats.map((stat, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-4">สถิติที่ {index + 1}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ตัวเลข</label>
                        <input
                          type="text"
                          value={stat.number}
                          onChange={(e) => handleInputChange('stats', 'number', e.target.value, index)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ป้ายกำกับ</label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => handleInputChange('stats', 'label', e.target.value, index)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => saveData('สถิติ')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                💾 บันทึกสถิติ
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={previewAboutUs}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg transition-colors text-lg"
          >
            👁️ ดูตัวอย่างหน้าเว็บ
          </button>
          <button
            onClick={publishChanges}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-colors text-lg"
          >
            🚀 เผยแพร่การเปลี่ยนแปลงทั้งหมด
          </button>
        </div>
      </div>
    </div>
  );
}

