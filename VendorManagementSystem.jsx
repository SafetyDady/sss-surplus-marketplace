import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Plus, Eye, Edit, Trash2, Check, X, 
  Mail, Phone, MapPin, Calendar, DollarSign, Package,
  TrendingUp, AlertCircle, CheckCircle, Clock, Ban
} from 'lucide-react';

const VendorManagementSystem = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'view', 'edit', 'approve', 'reject'
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [vendors, setVendors] = useState([
    {
      id: 'V001',
      name: 'บริษัท เอบีซี จำกัด',
      contactPerson: 'คุณสมชาย ใจดี',
      email: 'somchai@abc.com',
      phone: '02-123-4567',
      address: '123 ถนนสุขุมวิท กรุงเทพฯ 10110',
      category: 'เสื้อผ้า',
      status: 'active',
      joinDate: '2024-01-15',
      totalProducts: 156,
      totalSales: 125000,
      commission: 5.5,
      rating: 4.8,
      documents: ['business_license.pdf', 'tax_id.pdf'],
      bankAccount: {
        bank: 'ธนาคารกสิกรไทย',
        accountNumber: '123-4-56789-0',
        accountName: 'บริษัท เอบีซี จำกัด'
      }
    },
    {
      id: 'V002',
      name: 'ร้านเดฟ อีคอมเมิร์ซ',
      contactPerson: 'คุณมาลี สวยงาม',
      email: 'malee@def.com',
      phone: '02-234-5678',
      address: '456 ถนนพหลโยธิน กรุงเทพฯ 10400',
      category: 'อิเล็กทรอนิกส์',
      status: 'pending',
      joinDate: '2024-06-01',
      totalProducts: 0,
      totalSales: 0,
      commission: 0,
      rating: 0,
      documents: ['business_license.pdf'],
      bankAccount: null
    },
    {
      id: 'V003',
      name: 'กีเอชไอ สปอร์ต',
      contactPerson: 'คุณวิชัย แข็งแรง',
      email: 'wichai@ghi.com',
      phone: '02-345-6789',
      address: '789 ถนนรัชดาภิเษก กรุงเทพฯ 10310',
      category: 'อุปกรณ์กีฬา',
      status: 'suspended',
      joinDate: '2024-03-20',
      totalProducts: 89,
      totalSales: 67000,
      commission: 4.0,
      rating: 3.2,
      documents: ['business_license.pdf', 'tax_id.pdf'],
      bankAccount: {
        bank: 'ธนาคารไทยพาณิชย์',
        accountNumber: '987-6-54321-0',
        accountName: 'กีเอชไอ สปอร์ต'
      }
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'suspended': return <Ban className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'ใช้งาน';
      case 'pending': return 'รอตรวจสอบ';
      case 'suspended': return 'ระงับ';
      case 'rejected': return 'ปฏิเสธ';
      default: return 'ไม่ทราบ';
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && vendor.status === activeTab;
  });

  const handleVendorAction = (vendor, action) => {
    setSelectedVendor(vendor);
    setModalType(action);
    setShowModal(true);
  };

  const handleStatusChange = (vendorId, newStatus) => {
    setVendors(vendors.map(vendor => 
      vendor.id === vendorId ? { ...vendor, status: newStatus } : vendor
    ));
    setShowModal(false);
  };

  const VendorCard = ({ vendor }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
          <p className="text-sm text-gray-600">{vendor.contactPerson}</p>
          <p className="text-sm text-gray-500">ID: {vendor.id}</p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(vendor.status)}
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vendor.status)}`}>
            {getStatusText(vendor.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{vendor.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{vendor.phone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{vendor.totalProducts} สินค้า</span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">฿{vendor.totalSales.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          เข้าร่วมเมื่อ: {new Date(vendor.joinDate).toLocaleDateString('th-TH')}
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => handleVendorAction(vendor, 'view')}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleVendorAction(vendor, 'edit')}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
          >
            <Edit className="h-4 w-4" />
          </button>
          {vendor.status === 'pending' && (
            <>
              <button 
                onClick={() => handleVendorAction(vendor, 'approve')}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
              >
                <Check className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleVendorAction(vendor, 'reject')}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const VendorModal = () => {
    if (!showModal || !selectedVendor) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalType === 'view' && 'ข้อมูล Vendor'}
                {modalType === 'edit' && 'แก้ไขข้อมูล Vendor'}
                {modalType === 'approve' && 'อนุมัติ Vendor'}
                {modalType === 'reject' && 'ปฏิเสธ Vendor'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {modalType === 'view' && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลพื้นฐาน</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ชื่อบริษัท</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVendor.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ผู้ติดต่อ</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVendor.contactPerson}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">อีเมล</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVendor.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">เบอร์โทร</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVendor.phone}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">ที่อยู่</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVendor.address}</p>
                    </div>
                  </div>
                </div>

                {/* Business Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลธุรกิจ</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">หมวดหมู่สินค้า</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVendor.category}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">วันที่เข้าร่วม</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedVendor.joinDate).toLocaleDateString('th-TH')}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">จำนวนสินค้า</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVendor.totalProducts} รายการ</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ยอดขายรวม</label>
                      <p className="mt-1 text-sm text-gray-900">฿{selectedVendor.totalSales.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Bank Account */}
                {selectedVendor.bankAccount && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลบัญชีธนาคาร</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">ธนาคาร</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedVendor.bankAccount.bank}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">เลขที่บัญชี</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedVendor.bankAccount.accountNumber}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">ชื่อบัญชี</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedVendor.bankAccount.accountName}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Documents */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">เอกสารประกอบ</h3>
                  <div className="space-y-2">
                    {selectedVendor.documents.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-900">{doc}</span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">ดาวน์โหลด</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(modalType === 'approve' || modalType === 'reject') && (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        {modalType === 'approve' ? 'ยืนยันการอนุมัติ' : 'ยืนยันการปฏิเสธ'}
                      </h3>
                      <p className="mt-2 text-sm text-yellow-700">
                        {modalType === 'approve' 
                          ? `คุณต้องการอนุมัติ Vendor "${selectedVendor.name}" ใช่หรือไม่?`
                          : `คุณต้องการปฏิเสธ Vendor "${selectedVendor.name}" ใช่หรือไม่?`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">หมายเหตุ</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="เพิ่มหมายเหตุ (ไม่บังคับ)"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedVendor.id, modalType === 'approve' ? 'active' : 'rejected')}
                    className={`px-4 py-2 rounded-lg text-white ${
                      modalType === 'approve' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {modalType === 'approve' ? 'อนุมัติ' : 'ปฏิเสธ'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const stats = {
    total: vendors.length,
    active: vendors.filter(v => v.status === 'active').length,
    pending: vendors.filter(v => v.status === 'pending').length,
    suspended: vendors.filter(v => v.status === 'suspended').length
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">จัดการ Vendors</h1>
              <p className="text-sm text-gray-600">จัดการและตรวจสอบ Vendors ในระบบ</p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              <span>เพิ่ม Vendor ใหม่</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vendors ทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">ใช้งาน</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">รอตรวจสอบ</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <Ban className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">ระงับ</p>
                <p className="text-2xl font-bold text-gray-900">{stats.suspended}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex space-x-4">
              {[
                { id: 'all', label: 'ทั้งหมด', count: stats.total },
                { id: 'active', label: 'ใช้งาน', count: stats.active },
                { id: 'pending', label: 'รอตรวจสอบ', count: stats.pending },
                { id: 'suspended', label: 'ระงับ', count: stats.suspended }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
            <div className="flex space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหา Vendor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                <span>กรอง</span>
              </button>
            </div>
          </div>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredVendors.map(vendor => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>

        {filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่พบ Vendor</h3>
            <p className="mt-1 text-sm text-gray-500">ไม่มี Vendor ที่ตรงกับเงื่อนไขการค้นหา</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <VendorModal />
    </div>
  );
};

export default VendorManagementSystem;

