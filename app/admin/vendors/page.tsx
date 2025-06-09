'use client';

import React, { useState, useEffect } from 'react';
import { 
  getVendorApplications, 
  updateVendorApplicationStatus, 
  getVendorApplicationStats,
  searchVendorApplications 
} from '../../../lib/vendorService';

export default function AdminVendorPage() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load vendor applications
      const applicationsResult = await getVendorApplications({ limit: 100 });
      if (applicationsResult.success) {
        setApplications(applicationsResult.data);
      }

      // Load statistics
      const statsResult = await getVendorApplicationStats();
      if (statsResult.success) {
        setStats(statsResult.data);
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
      const result = await searchVendorApplications(searchTerm);
      if (result.success) {
        setApplications(result.data);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const result = await updateVendorApplicationStatus(applicationId, {
        status: newStatus,
        notes: reviewNotes,
        reviewedBy: 'admin'
      });

      if (result.success) {
        setSelectedApplication(null);
        setReviewNotes('');
        loadData(); // Reload data
        alert(`อัพเดทสถานะเป็น "${newStatus}" เรียบร้อยแล้ว`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('เกิดข้อผิดพลาดในการอัพเดทสถานะ');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('th-TH') + ' ' + date.toLocaleTimeString('th-TH');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'รอพิจารณา' },
      approved: { color: 'bg-green-100 text-green-800', text: 'อนุมัติ' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'ปฏิเสธ' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const filteredApplications = applications.filter(application => {
    if (statusFilter !== 'all' && application.systemInfo?.status !== statusFilter) return false;
    if (typeFilter !== 'all' && application.applicantType !== typeFilter) return false;
    return true;
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
            <h1 className="text-3xl font-bold text-gray-900">จัดการ Vendor Applications</h1>
            <p className="mt-2 text-gray-600">จัดการใบสมัครและอนุมัติ Vendor</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📋</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">ทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">⏳</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">รอพิจารณา</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending || 0}</p>
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
                <p className="text-sm font-medium text-gray-500">อนุมัติ</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">❌</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">ปฏิเสธ</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">👤</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">บุคคลธรรมดา</p>
                <p className="text-2xl font-bold text-gray-900">{stats.byType?.individual || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ค้นหาชื่อบริษัท, ผู้ติดต่อ, อีเมล..."
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
              <option value="pending">รอพิจารณา</option>
              <option value="approved">อนุมัติ</option>
              <option value="rejected">ปฏิเสธ</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">ทุกประเภท</option>
              <option value="individual">บุคคลธรรมดา</option>
              <option value="company">นิติบุคคล</option>
            </select>

            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              ค้นหา
            </button>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                    สินค้า
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
                {filteredApplications.map((application) => (
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
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {application.productInfo?.productDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(application.systemInfo?.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(application.systemInfo?.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedApplication(application)}
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

          {filteredApplications.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">ไม่พบใบสมัคร Vendor</p>
            </div>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">รายละเอียดใบสมัคร Vendor</h3>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Company Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">ข้อมูลบริษัท</h4>
                  <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ประเภทผู้สมัคร:</label>
                      <p className="text-sm text-gray-900">
                        {selectedApplication.applicantType === 'individual' ? 'บุคคลธรรมดา' : 'นิติบุคคล'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ชื่อบริษัท:</label>
                      <p className="text-sm text-gray-900">{selectedApplication.companyInfo?.companyName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ประเภทธุรกิจ:</label>
                      <p className="text-sm text-gray-900">{selectedApplication.companyInfo?.businessType}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ที่อยู่:</label>
                      <p className="text-sm text-gray-900">{selectedApplication.companyInfo?.companyAddress}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">เลขประจำตัวผู้เสียภาษี:</label>
                      <p className="text-sm text-gray-900">{selectedApplication.companyInfo?.taxId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">เว็บไซต์:</label>
                      <p className="text-sm text-gray-900">{selectedApplication.companyInfo?.website}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">ข้อมูลผู้ติดต่อ</h4>
                  <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ชื่อ-นามสกุล:</label>
                      <p className="text-sm text-gray-900">{selectedApplication.contactInfo?.contactName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ตำแหน่ง:</label>
                      <p className="text-sm text-gray-900">{selectedApplication.contactInfo?.position}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">อีเมล:</label>
                      <p className="text-sm text-gray-900">{selectedApplication.contactInfo?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">โทรศัพท์:</label>
                      <p className="text-sm text-gray-900">{selectedApplication.contactInfo?.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">มือถือ:</label>
                      <p className="text-sm text-gray-900">{selectedApplication.contactInfo?.mobile}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Line ID:</label>
                      <p className="text-sm text-gray-900">{selectedApplication.contactInfo?.lineId}</p>
                    </div>
                  </div>
                </div>

                {/* Product Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">ข้อมูลสินค้า</h4>
                  <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">หมวดหมู่สินค้า:</label>
                      <p className="text-sm text-gray-900">
                        {selectedApplication.productInfo?.productCategories?.join(', ')}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">รายละเอียดสินค้า:</label>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">
                        {selectedApplication.productInfo?.productDescription}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ปริมาณต่อเดือน:</label>
                      <p className="text-sm text-gray-900">{selectedApplication.productInfo?.monthlyVolume}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ประสบการณ์:</label>
                      <p className="text-sm text-gray-900">{selectedApplication.productInfo?.experience}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">ข้อมูลเพิ่มเติม</h4>
                  <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">เหตุผลที่ต้องการเป็น Vendor:</label>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">
                        {selectedApplication.additionalInfo?.motivation}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">แพลตฟอร์มอื่น:</label>
                      <p className="text-sm text-gray-900">{selectedApplication.additionalInfo?.otherPlatforms}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">สถานะ:</label>
                      <div className="mt-1">{getStatusBadge(selectedApplication.systemInfo?.status)}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">วันที่สมัคร:</label>
                      <p className="text-sm text-gray-900">
                        {formatDate(selectedApplication.systemInfo?.submittedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              {selectedApplication.documents && Object.keys(selectedApplication.documents).length > 0 && (
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">เอกสารแนบ</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(selectedApplication.documents).map(([docType, docInfo]) => (
                      <div key={docType} className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-gray-700">{docType}</p>
                        <a
                          href={docInfo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          ดูเอกสาร →
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Section */}
              <div className="mt-6 border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">การพิจารณา</h4>
                
                {selectedApplication.systemInfo?.notes && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">หมายเหตุเดิม:</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                      {selectedApplication.systemInfo.notes}
                    </p>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">หมายเหตุ:</label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="เพิ่มหมายเหตุ..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    ปฏิเสธ
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedApplication.id, 'approved')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    อนุมัติ
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

