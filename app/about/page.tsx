'use client';

import React, { useState, useEffect } from 'react';

interface Value {
  title: string;
  description: string;
  icon: string;
}

interface TeamMember {
  id: string;
  name: string;
  position: string;
  description?: string;
  avatar?: string;
  visible: boolean;
}

interface Statistics {
  customers: string;
  partners: string;
  serviceHours: string;
  yearsOfExperience: string;
}

interface AboutData {
  companyName: string;
  foundedYear: string | number;
  description: string;
  history: string;
  mission: string;
  vision: string;
  values: Value[];
  teamMembers: TeamMember[];
  statistics: Statistics;
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/about-us');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Validate data structure before using
      if (!data) {
        throw new Error('No data received from API');
      }
      
      setAboutData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching about data:', err);
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
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

  if (error || !aboutData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">ไม่สามารถโหลดข้อมูลได้</h2>
          <p className="text-gray-600 mb-4">{error || 'กรุณาลองใหม่อีกครั้งในภายหลัง'}</p>
          <button 
            onClick={() => fetchAboutData()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  // Filter visible team members
  const visibleTeamMembers = aboutData.teamMembers?.filter(member => member.visible) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white text-blue-600 w-10 h-10 rounded-lg flex items-center justify-center font-bold">
              M
            </div>
            <span className="text-xl font-bold">{aboutData.companyName}</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="/" className="hover:text-blue-200 transition-colors">หน้าหลัก</a>
            <a href="/products" className="hover:text-blue-200 transition-colors">สินค้า</a>
            <a href="/about" className="text-blue-200 font-semibold">เกี่ยวกับเรา</a>
            <a href="/contact" className="hover:text-blue-200 transition-colors">ติดต่อเรา</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            เกี่ยวกับ <span className="text-blue-600">{aboutData.companyName}</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {aboutData.description}
          </p>
          <div className="inline-flex items-center bg-white px-6 py-3 rounded-full shadow-lg">
            <span className="text-blue-600 font-semibold">ก่อตั้งในปี {aboutData.foundedYear}</span>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">เรื่องราวของเรา</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {aboutData.history}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-2xl">
              <div className="grid grid-cols-2 gap-6">
                {aboutData.statistics?.customers && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{aboutData.statistics.customers}</div>
                    <div className="text-gray-600">ลูกค้า</div>
                  </div>
                )}
                {aboutData.statistics?.partners && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{aboutData.statistics.partners}</div>
                    <div className="text-gray-600">พาร์ทเนอร์</div>
                  </div>
                )}
                {aboutData.statistics?.yearsOfExperience && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{aboutData.statistics.yearsOfExperience}</div>
                    <div className="text-gray-600">ปีประสบการณ์</div>
                  </div>
                )}
                {aboutData.statistics?.serviceHours && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{aboutData.statistics.serviceHours}</div>
                    <div className="text-gray-600">ชั่วโมงบริการ</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">พันธกิจและวิสัยทัศน์</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {aboutData.mission && (
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-blue-600 text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">พันธกิจ</h3>
                <p className="text-gray-600 leading-relaxed">{aboutData.mission}</p>
              </div>
            )}
            {aboutData.vision && (
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-purple-600 text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">วิสัยทัศน์</h3>
                <p className="text-gray-600 leading-relaxed">{aboutData.vision}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Values */}
      {aboutData.values && aboutData.values.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">ค่านิยมองค์กร</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {aboutData.values.map((value, index) => (
                <div key={index} className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                  <div className="text-3xl mb-4">{value.icon || '💎'}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {visibleTeamMembers.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">ทีมผู้บริหาร</h2>
            </div>
            <div className={`grid gap-8 ${
              visibleTeamMembers.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' :
              visibleTeamMembers.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' :
              'md:grid-cols-3'
            }`}>
              {visibleTeamMembers.map((member) => (
                <div key={member.id} className="bg-white p-8 rounded-2xl shadow-lg text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {member.avatar || member.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                  {member.description && (
                    <p className="text-gray-600 text-sm">{member.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center font-bold">
              M
            </div>
            <span className="text-xl font-bold">{aboutData.companyName}</span>
          </div>
          <p className="text-gray-400 mb-6">{aboutData.description}</p>
          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500">© {new Date().getFullYear()} {aboutData.companyName}. สงวนลิขสิทธิ์.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
