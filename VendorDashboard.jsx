import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  Package, DollarSign, ShoppingCart, TrendingUp, 
  Bell, Settings, Plus, Eye, Edit, Trash2,
  Calendar, Filter, Download, Upload
} from 'lucide-react';

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'order', message: 'คำสั่งซื้อใหม่ #12345', time: '5 นาทีที่แล้ว', unread: true },
    { id: 2, type: 'product', message: 'สินค้า "เสื้อยืดสีขาว" ได้รับการอนุมัติ', time: '1 ชั่วโมงที่แล้ว', unread: true },
    { id: 3, type: 'payment', message: 'ได้รับการชำระเงิน ฿2,500', time: '3 ชั่วโมงที่แล้ว', unread: false }
  ]);

  // Sample data for charts
  const salesData = [
    { month: 'ม.ค.', sales: 12000, orders: 45 },
    { month: 'ก.พ.', sales: 15000, orders: 52 },
    { month: 'มี.ค.', sales: 18000, orders: 61 },
    { month: 'เม.ย.', sales: 22000, orders: 73 },
    { month: 'พ.ค.', sales: 25000, orders: 84 },
    { month: 'มิ.ย.', sales: 28000, orders: 92 }
  ];

  const productCategoryData = [
    { name: 'เสื้อผ้า', value: 35, color: '#8884d8' },
    { name: 'อุปกรณ์กีฬา', value: 25, color: '#82ca9d' },
    { name: 'เครื่องใช้ไฟฟ้า', value: 20, color: '#ffc658' },
    { name: 'อื่นๆ', value: 20, color: '#ff7300' }
  ];

  const recentProducts = [
    { id: 1, name: 'เสื้อยืดสีขาว', category: 'เสื้อผ้า', price: 299, stock: 50, status: 'active' },
    { id: 2, name: 'รองเท้าผ้าใบ', category: 'รองเท้า', price: 1299, stock: 25, status: 'pending' },
    { id: 3, name: 'กระเป๋าเป้', category: 'กระเป๋า', price: 899, stock: 15, status: 'active' },
    { id: 4, name: 'หูฟังบลูทูธ', category: 'อิเล็กทรอนิกส์', price: 1599, stock: 8, status: 'inactive' }
  ];

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{change}% จากเดือนที่แล้ว
          </p>
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: color + '20' }}>
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
      </div>
    </div>
  );

  const NotificationItem = ({ notification }) => (
    <div className={`p-4 border-l-4 ${notification.unread ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'} mb-3 rounded-r-lg`}>
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-sm ${notification.unread ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
        </div>
        {notification.unread && (
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        )}
      </div>
    </div>
  );

  const ProductRow = ({ product }) => (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{product.name}</div>
        <div className="text-sm text-gray-500">{product.category}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ฿{product.price.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {product.stock}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          product.status === 'active' ? 'bg-green-100 text-green-800' :
          product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {product.status === 'active' ? 'ใช้งาน' : 
           product.status === 'pending' ? 'รอตรวจสอบ' : 'ไม่ใช้งาน'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-900">
            <Eye className="h-4 w-4" />
          </button>
          <button className="text-green-600 hover:text-green-900">
            <Edit className="h-4 w-4" />
          </button>
          <button className="text-red-600 hover:text-red-900">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
              <p className="text-sm text-gray-600">ยินดีต้อนรับ, คุณสมชาย (Vendor ID: V001)</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'ภาพรวม', icon: BarChart },
              { id: 'products', label: 'สินค้า', icon: Package },
              { id: 'orders', label: 'คำสั่งซื้อ', icon: ShoppingCart },
              { id: 'analytics', label: 'วิเคราะห์', icon: TrendingUp }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="ยอดขายรวม"
                value="฿125,000"
                change={12.5}
                icon={DollarSign}
                color="#10b981"
              />
              <StatCard
                title="คำสั่งซื้อ"
                value="342"
                change={8.2}
                icon={ShoppingCart}
                color="#3b82f6"
              />
              <StatCard
                title="สินค้าทั้งหมด"
                value="156"
                change={5.1}
                icon={Package}
                color="#8b5cf6"
              />
              <StatCard
                title="อัตราการเติบโต"
                value="15.3%"
                change={2.4}
                icon={TrendingUp}
                color="#f59e0b"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">ยอดขายรายเดือน</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`฿${value.toLocaleString()}`, 'ยอดขาย']} />
                    <Bar dataKey="sales" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Category Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">การกระจายสินค้าตามหมวดหมู่</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productCategoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {productCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Notifications */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">การแจ้งเตือนล่าสุด</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-800">ดูทั้งหมด</button>
                </div>
                <div className="space-y-3">
                  {notifications.map(notification => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
                </div>
              </div>

              {/* Recent Products */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">สินค้าล่าสุด</h3>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="h-4 w-4" />
                    <span>เพิ่มสินค้า</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {recentProducts.slice(0, 4).map(product => (
                    <div key={product.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.category} • ฿{product.price.toLocaleString()}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' :
                        product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.status === 'active' ? 'ใช้งาน' : 
                         product.status === 'pending' ? 'รอตรวจสอบ' : 'ไม่ใช้งาน'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Products Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">จัดการสินค้า</h2>
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="h-4 w-4" />
                  <span>ส่งออก</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Upload className="h-4 w-4" />
                  <span>นำเข้า</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                  <span>เพิ่มสินค้าใหม่</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ค้นหาสินค้า</label>
                  <input
                    type="text"
                    placeholder="ชื่อสินค้า, SKU..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option value="">ทั้งหมด</option>
                    <option value="clothing">เสื้อผ้า</option>
                    <option value="electronics">อิเล็กทรอนิกส์</option>
                    <option value="sports">อุปกรณ์กีฬา</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option value="">ทั้งหมด</option>
                    <option value="active">ใช้งาน</option>
                    <option value="pending">รอตรวจสอบ</option>
                    <option value="inactive">ไม่ใช้งาน</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                    <Filter className="h-4 w-4" />
                    <span>กรองข้อมูล</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สินค้า
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ราคา
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      คงเหลือ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สถานะ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      การจัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentProducts.map(product => (
                    <ProductRow key={product.id} product={product} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">
                แสดง <span className="font-medium">1</span> ถึง <span className="font-medium">4</span> จาก{' '}
                <span className="font-medium">156</span> รายการ
              </p>
              <div className="flex space-x-2">
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">ก่อนหน้า</button>
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">ถัดไป</button>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs content would go here */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">คำสั่งซื้อ</h2>
            <p className="text-gray-600">ส่วนนี้จะแสดงรายการคำสั่งซื้อทั้งหมด</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">วิเคราะห์และรายงาน</h2>
            <p className="text-gray-600">ส่วนนี้จะแสดงข้อมูลวิเคราะห์และรายงานต่างๆ</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default VendorDashboard;

