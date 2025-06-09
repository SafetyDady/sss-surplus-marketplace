'use client';

import React, { useState, useEffect } from 'react';
import { 
  getContactMessages, 
  updateContactMessage, 
  getContactMessageStats,
  searchContactMessages 
} from '../../../lib/contactService';
import { 
  getVendorApplications, 
  getVendorApplicationStats 
} from '../../../lib/vendorService';

export default function AdminContactPage() {
  const [activeTab, setActiveTab] = useState('messages');
  const [loading, setLoading] = useState(true);
  const [contactMessages, setContactMessages] = useState([]);
  const [vendorApplications, setVendorApplications] = useState([]);
  const [contactStats, setContactStats] = useState({});
  const [vendorStats, setVendorStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load contact messages
      const messagesResult = await getContactMessages({ limit: 50 });
      if (messagesResult.success) {
        setContactMessages(messagesResult.data);
      }

      // Load vendor applications
      const vendorResult = await getVendorApplications({ limit: 20 });
      if (vendorResult.success) {
        setVendorApplications(vendorResult.data);
      }

      // Load statistics
      const contactStatsResult = await getContactMessageStats();
      if (contactStatsResult.success) {
        setContactStats(contactStatsResult.data);
      }

      const vendorStatsResult = await getVendorApplicationStats();
      if (vendorStatsResult.success) {
        setVendorStats(vendorStatsResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadData();
      return;
    }

    setLoading(true);
    try {
      const result = await searchContactMessages(searchTerm);
      if (result.success) {
        setContactMessages(result.data);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (messageId) => {
    if (!replyText.trim()) return;

    try {
      const result = await updateContactMessage(messageId, {
        status: 'replied',
        reply: replyText,
        repliedBy: 'admin'
      });

      if (result.success) {
        setSelectedMessage(null);
        setReplyText('');
        loadData(); // Reload data
        alert('ตอบกลับเรียบร้อยแล้ว');
      }
    } catch (error) {
      console.error('Error replying:', error);
      alert('เกิดข้อผิดพลาดในการตอบกลับ');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('th-TH') + ' ' + date.toLocaleTimeString('th-TH');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { color: 'bg-blue-100 text-blue-800', text: 'ใหม่' },
      replied: { color: 'bg-green-100 text-green-800', text: 'ตอบแล้ว' },
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'รอดำเนินการ' },
      closed: { color: 'bg-gray-100 text-gray-800', text: 'ปิด' }
    };
    
    const config = statusConfig[status] || statusConfig.new;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const filteredMessages = contactMessages.filter(message => {
    if (statusFilter === 'all') return true;
    return message.systemInfo?.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">จัดการ Contact Us</h1>
            <p className="mt-2 text-gray-600">จัดการข้อความติดต่อและใบสมัคร Vendor</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📧</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">ข้อความทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{contactStats.total || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">ตอบแล้ว</p>
                <p className="text-2xl font-bold text-gray-900">{contactStats.replied || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🤝</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">ใบสมัคร Vendor</p>
                <p className="text-2xl font-bold text-gray-900">{vendorStats.total || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">⏳</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">รอพิจารณา</p>
                <p className="text-2xl font-bold text-gray-900">{vendorStats.pending || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'messages'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📧 ข้อความจากลูกค้า ({contactStats.total || 0})
              </button>
              <button
                onClick={() => setActiveTab('vendors')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'vendors'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🤝 คำขอเป็น Vendor ({vendorStats.total || 0})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'messages' && (
              <div>
                {/* Search and Filter */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="ค้นหาข้อความ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <span className="text-gray-400">🔍</span>
                      </div>
                    </div>
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">ทุกสถานะ</option>
                    <option value="new">ใหม่</option>
                    <option value="replied">ตอบแล้ว</option>
                    <option value="pending">รอดำเนินการ</option>
                    <option value="closed">ปิด</option>
                  </select>
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    ค้นหา
                  </button>
                </div>

                {/* Messages Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ผู้ส่ง
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          หัวข้อ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ข้อความ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          สถานะ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          วันที่
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          การดำเนินการ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredMessages.map((message) => (
                        <tr key={message.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {message.senderInfo?.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {message.senderInfo?.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {message.messageInfo?.subject}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {message.messageInfo?.message}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(message.systemInfo?.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(message.systemInfo?.submittedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => setSelectedMessage(message)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              ดูรายละเอียด
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredMessages.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">ไม่พบข้อความ</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'vendors' && (
              <div>
                {/* Vendor Applications Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          บริษัท/ผู้สมัคร
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ประเภท
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ติดต่อ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          สถานะ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          วันที่สมัคร
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          การดำเนินการ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {vendorApplications.map((application) => (
                        <tr key={application.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {application.companyInfo?.companyName || application.contactInfo?.contactName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {application.companyInfo?.businessType}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {application.applicantType === 'individual' ? 'บุคคลธรรมดา' : 'นิติบุคคล'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm text-gray-900">
                                {application.contactInfo?.email}
                              </div>
                              <div className="text-sm text-gray-500">
                                {application.contactInfo?.phone}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(application.systemInfo?.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(application.systemInfo?.submittedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              ดูรายละเอียด
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {vendorApplications.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">ไม่พบใบสมัคร Vendor</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">รายละเอียดข้อความ</h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ผู้ส่ง:</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedMessage.senderInfo?.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">อีเมล:</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedMessage.senderInfo?.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">หัวข้อ:</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedMessage.messageInfo?.subject}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">ข้อความ:</label>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{selectedMessage.messageInfo?.message}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">สถานะ:</label>
                  <div className="mt-1">{getStatusBadge(selectedMessage.systemInfo?.status)}</div>
                </div>
                
                {selectedMessage.systemInfo?.reply && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">การตอบกลับ:</label>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{selectedMessage.systemInfo.reply}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">ตอบกลับ:</label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="พิมพ์การตอบกลับ..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={() => handleReply(selectedMessage.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    ส่งการตอบกลับ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

