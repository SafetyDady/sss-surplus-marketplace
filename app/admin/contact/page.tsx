'use client';

import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: any;
  isRead: boolean;
  status: 'new' | 'inProgress' | 'completed';
}

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  googleMapsUrl: string;
  socialMedia: {
    facebook: string;
    line: string;
    instagram: string;
  };
}

export default function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: '',
    phone: '',
    email: '',
    googleMapsUrl: '',
    socialMedia: {
      facebook: '',
      line: '',
      instagram: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);

  // Fetch contact messages and info on component mount
  useEffect(() => {
    fetchContactMessages();
    fetchContactInfo();
  }, []);

  const fetchContactMessages = async () => {
    try {
      // This will be implemented with the actual API endpoint
      // const response = await fetch('/api/contact/messages');
      // const data = await response.json();
      // setMessages(data);
      
      // For now, using mock data
      const mockMessages: ContactMessage[] = [
        {
          id: '1',
          name: 'ธนพล สมบูรณ์',
          email: 'thanapon@example.com',
          phone: '081-234-5678',
          message: 'สนใจสินค้าประเภทอุปกรณ์สำนักงาน มีรายการใดบ้างที่พร้อมส่งทันที',
          createdAt: { seconds: Date.now() / 1000 },
          isRead: false,
          status: 'new'
        },
        {
          id: '2',
          name: 'สมศรี มีทรัพย์',
          email: 'somsri@example.com',
          phone: '089-876-5432',
          message: 'ต้องการสอบถามราคาสินค้าจำนวนมาก สามารถขอส่วนลดได้หรือไม่',
          createdAt: { seconds: (Date.now() - 86400000) / 1000 },
          isRead: true,
          status: 'inProgress'
        },
        {
          id: '3',
          name: 'วิชัย ใจดี',
          email: 'wichai@example.com',
          phone: '062-345-6789',
          message: 'ขอบคุณสำหรับบริการที่ดีเยี่ยม สินค้าคุณภาพดีมาก จะกลับมาอุดหนุนอีกแน่นอน',
          createdAt: { seconds: (Date.now() - 172800000) / 1000 },
          isRead: true,
          status: 'completed'
        }
      ];
      
      setMessages(mockMessages);
    } catch (err) {
      console.error('Error fetching contact messages:', err);
      setError('ไม่สามารถโหลดข้อความติดต่อได้');
    }
  };

  const fetchContactInfo = async () => {
    try {
      // This will be implemented with the actual API endpoint
      // const response = await fetch('/api/contact/info');
      // const data = await response.json();
      // setContactInfo(data);
      
      // For now, using mock data
      const mockContactInfo: ContactInfo = {
        address: '123 ถนนสุขุมวิท, แขวงคลองเตย, เขตคลองเตย, กรุงเทพมหานคร 10110',
        phone: '02-123-4567',
        email: 'contact@mtpsurplus.com',
        googleMapsUrl: 'https://goo.gl/maps/example',
        socialMedia: {
          facebook: 'https://facebook.com/mtpsurplus',
          line: 'https://line.me/mtpsurplus',
          instagram: 'https://instagram.com/mtpsurplus'
        }
      };
      
      setContactInfo(mockContactInfo);
    } catch (err) {
      console.error('Error fetching contact info:', err);
      setError('ไม่สามารถโหลดข้อมูลติดต่อได้');
    } finally {
      setLoading(false);
    }
  };

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('socialMedia.')) {
      const socialMediaKey = name.split('.')[1];
      setContactInfo({
        ...contactInfo,
        socialMedia: {
          ...contactInfo.socialMedia,
          [socialMediaKey]: value
        }
      });
    } else {
      setContactInfo({
        ...contactInfo,
        [name]: value
      });
    }
  };

  const saveContactInfo = async () => {
    try {
      setSaveStatus('saving');
      
      // This will be implemented with the actual API endpoint
      // await fetch('/api/contact/info', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(contactInfo)
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error('Error saving contact info:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      // This will be implemented with the actual API endpoint
      // await fetch(`/api/contact/messages/${messageId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ isRead: true })
      // });
      
      // Update local state
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ));
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  const updateMessageStatus = async (messageId: string, status: 'new' | 'inProgress' | 'completed') => {
    try {
      // This will be implemented with the actual API endpoint
      // await fetch(`/api/contact/messages/${messageId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status })
      // });
      
      // Update local state
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      ));
    } catch (err) {
      console.error('Error updating message status:', err);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อความนี้?')) return;
    
    try {
      // This will be implemented with the actual API endpoint
      // await fetch(`/api/contact/messages/${messageId}`, {
      //   method: 'DELETE'
      // });
      
      // Update local state
      setMessages(messages.filter(msg => msg.id !== messageId));
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const formatDate = (seconds: number) => {
    const date = new Date(seconds * 1000);
    return date.toLocaleDateString('th-TH', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'inProgress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new':
        return 'ใหม่';
      case 'inProgress':
        return 'กำลังดำเนินการ';
      case 'completed':
        return 'เสร็จสิ้น';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchContactMessages();
              fetchContactInfo();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">จัดการข้อมูลติดต่อ</h1>
        
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/10 p-1 mb-8">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                ${selected 
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'
                }`
              }
            >
              ข้อความติดต่อ
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                ${selected 
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'
                }`
              }
            >
              ข้อมูลติดต่อบริษัท
            </Tab>
          </Tab.List>
          
          <Tab.Panels>
            {/* Messages Panel */}
            <Tab.Panel>
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">ข้อความติดต่อทั้งหมด</h2>
                  
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">ไม่มีข้อความติดต่อ</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`border rounded-lg p-4 ${message.isRead ? 'bg-white' : 'bg-blue-50'}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg">{message.name}</h3>
                            <div className="flex space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(message.status)}`}>
                                {getStatusText(message.status)}
                              </span>
                              {!message.isRead && (
                                <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                  ใหม่
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-500 mb-2">
                            <p>อีเมล: {message.email}</p>
                            {message.phone && <p>โทรศัพท์: {message.phone}</p>}
                            <p>วันที่: {formatDate(message.createdAt.seconds)}</p>
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded-lg mb-3">
                            <p className="text-gray-700">{message.message}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {!message.isRead && (
                              <button 
                                onClick={() => markAsRead(message.id)}
                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg text-sm transition-colors"
                              >
                                ทำเครื่องหมายว่าอ่านแล้ว
                              </button>
                            )}
                            
                            <select 
                              value={message.status}
                              onChange={(e) => updateMessageStatus(message.id, e.target.value as any)}
                              className="bg-gray-100 border border-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm"
                            >
                              <option value="new">ใหม่</option>
                              <option value="inProgress">กำลังดำเนินการ</option>
                              <option value="completed">เสร็จสิ้น</option>
                            </select>
                            
                            <button 
                              onClick={() => deleteMessage(message.id)}
                              className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg text-sm transition-colors"
                            >
                              ลบ
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Tab.Panel>
            
            {/* Contact Info Panel */}
            <Tab.Panel>
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">ข้อมูลติดต่อบริษัท</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
                      <textarea 
                        id="address" 
                        name="address" 
                        rows={3} 
                        value={contactInfo.address} 
                        onChange={handleContactInfoChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                      <input 
                        type="text" 
                        id="phone" 
                        name="phone" 
                        value={contactInfo.phone} 
                        onChange={handleContactInfoChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={contactInfo.email} 
                        onChange={handleContactInfoChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="googleMapsUrl" className="block text-sm font-medium text-gray-700 mb-1">URL Google Maps</label>
                      <input 
                        type="text" 
                        id="googleMapsUrl" 
                        name="googleMapsUrl" 
                        value={contactInfo.googleMapsUrl} 
                        onChange={handleContactInfoChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-3">โซเชียลมีเดีย</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                          <input 
                            type="text" 
                            id="facebook" 
                            name="socialMedia.facebook" 
                            value={contactInfo.socialMedia.facebook} 
                            onChange={handleContactInfoChange} 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="line" className="block text-sm font-medium text-gray-700 mb-1">Line</label>
                          <input 
                            type="text" 
                            id="line" 
                            name="socialMedia.line" 
                            value={contactInfo.socialMedia.line} 
                            onChange={handleContactInfoChange} 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                          <input 
                            type="text" 
                            id="instagram" 
                            name="socialMedia.instagram" 
                            value={contactInfo.socialMedia.instagram} 
                            onChange={handleContactInfoChange} 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button 
                        onClick={saveContactInfo}
                        disabled={saveStatus === 'saving'}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {saveStatus === 'saving' ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                      </button>
                      
                      {saveStatus === 'success' && (
                        <span className="ml-3 text-green-600">บันทึกข้อมูลสำเร็จ</span>
                      )}
                      
                      {saveStatus === 'error' && (
                        <span className="ml-3 text-red-600">เกิดข้อผิดพลาดในการบันทึกข้อมูล</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
