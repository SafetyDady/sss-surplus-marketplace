import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Search, Filter, Edit, Trash2, Eye, 
  Upload, Download, Save, X, AlertCircle, CheckCircle,
  Image, DollarSign, BarChart3, TrendingUp, Calendar,
  Tag, Layers, Star, Heart, ShoppingCart
} from 'lucide-react';

const VendorProductManagement = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add', 'edit', 'view'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [products, setProducts] = useState([
    {
      id: 'P001',
      name: 'เสื้อยืดสีขาว Premium',
      description: 'เสื้อยืดคุณภาพสูง ผ้าฝ้าย 100% นุ่มสบาย ระบายอากาศดี',
      category: 'เสื้อผ้า',
      subcategory: 'เสื้อยืด',
      price: 299,
      originalPrice: 399,
      cost: 150,
      stock: 50,
      sku: 'TS-WHT-001',
      images: ['product1.jpg', 'product1-2.jpg'],
      status: 'active',
      featured: true,
      tags: ['ฝ้าย', 'สบาย', 'คุณภาพ'],
      weight: 200,
      dimensions: { length: 30, width: 25, height: 2 },
      createdDate: '2024-05-15',
      lastModified: '2024-06-01',
      views: 1250,
      sales: 45,
      rating: 4.8,
      reviews: 23
    },
    {
      id: 'P002',
      name: 'รองเท้าผ้าใบสีดำ',
      description: 'รองเท้าผ้าใบแฟชั่น สไตล์เกาหลี ใส่สบาย เหมาะกับทุกโอกาส',
      category: 'รองเท้า',
      subcategory: 'ผ้าใบ',
      price: 1299,
      originalPrice: 1599,
      cost: 800,
      stock: 25,
      sku: 'SH-BLK-002',
      images: ['product2.jpg'],
      status: 'pending',
      featured: false,
      tags: ['แฟชั่น', 'เกาหลี', 'สบาย'],
      weight: 500,
      dimensions: { length: 30, width: 12, height: 10 },
      createdDate: '2024-06-01',
      lastModified: '2024-06-01',
      views: 89,
      sales: 0,
      rating: 0,
      reviews: 0
    },
    {
      id: 'P003',
      name: 'กระเป๋าเป้เดินทาง',
      description: 'กระเป๋าเป้ขนาดใหญ่ เหมาะสำหรับเดินทาง มีช่องใส่ของมากมาย',
      category: 'กระเป๋า',
      subcategory: 'เป้',
      price: 899,
      originalPrice: 1199,
      cost: 500,
      stock: 15,
      sku: 'BG-TRV-003',
      images: ['product3.jpg', 'product3-2.jpg', 'product3-3.jpg'],
      status: 'active',
      featured: true,
      tags: ['เดินทาง', 'ใหญ่', 'ทนทาน'],
      weight: 800,
      dimensions: { length: 45, width: 30, height: 20 },
      createdDate: '2024-04-20',
      lastModified: '2024-05-15',
      views: 890,
      sales: 28,
      rating: 4.5,
      reviews: 15
    }
  ]);

  const categories = [
    'เสื้อผ้า', 'รองเท้า', 'กระเป๋า', 'อิเล็กทรอนิกส์', 
    'อุปกรณ์กีฬา', 'เครื่องสำอาง', 'หนังสือ', 'อื่นๆ'
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'ใช้งาน';
      case 'pending': return 'รอตรวจสอบ';
      case 'inactive': return 'ไม่ใช้งาน';
      case 'draft': return 'แบบร่าง';
      default: return 'ไม่ทราบ';
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || product.category === filterCategory;
    const matchesStatus = !filterStatus || product.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleProductAction = (product, action) => {
    setSelectedProduct(product);
    setModalType(action);
    setShowModal(true);
  };

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <Image className="h-16 w-16 text-gray-400" />
        </div>
        {product.featured && (
          <div className="absolute top-2 left-2">
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              ⭐ แนะนำ
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(product.status)}`}>
            {getStatusText(product.status)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
          <div className="flex items-center space-x-1 text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm text-gray-600">{product.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-lg font-bold text-gray-900">฿{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ฿{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500">SKU: {product.sku}</span>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>คงเหลือ: {product.stock}</span>
            <span>ขายแล้ว: {product.sales}</span>
          </div>
          <span className="text-xs text-gray-500">{product.category}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button 
              onClick={() => handleProductAction(product, 'view')}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handleProductAction(product, 'edit')}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handleProductAction(product, 'delete')}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Eye className="h-4 w-4" />
            <span>{product.views}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const ProductModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalType === 'add' && 'เพิ่มสินค้าใหม่'}
                {modalType === 'edit' && 'แก้ไขสินค้า'}
                {modalType === 'view' && 'รายละเอียดสินค้า'}
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
            {modalType === 'view' && selectedProduct && (
              <div className="space-y-6">
                {/* Product Images */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">รูปภาพสินค้า</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedProduct.images.map((image, index) => (
                      <div key={index} className="h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Image className="h-8 w-8 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลพื้นฐาน</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ชื่อสินค้า</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProduct.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">SKU</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProduct.sku}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">หมวดหมู่</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProduct.category}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">หมวดหมู่ย่อย</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProduct.subcategory}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">คำอธิบาย</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProduct.description}</p>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">ราคาและต้นทุน</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ราคาขาย</label>
                      <p className="mt-1 text-sm text-gray-900">฿{selectedProduct.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ราคาเดิม</label>
                      <p className="mt-1 text-sm text-gray-900">฿{selectedProduct.originalPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ต้นทุน</label>
                      <p className="mt-1 text-sm text-gray-900">฿{selectedProduct.cost.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Inventory */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">สต็อกและการขาย</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">คงเหลือ</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProduct.stock} ชิ้น</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ขายแล้ว</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProduct.sales} ชิ้น</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">เรตติ้ง</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProduct.rating}/5.0</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">รีวิว</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProduct.reviews} รีวิว</p>
                    </div>
                  </div>
                </div>

                {/* Shipping */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลการจัดส่ง</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">น้ำหนัก</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProduct.weight} กรัม</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ความยาว</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProduct.dimensions.length} ซม.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ความกว้าง</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProduct.dimensions.width} ซม.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ความสูง</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProduct.dimensions.height} ซม.</p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">แท็ก</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(modalType === 'add' || modalType === 'edit') && (
              <form className="space-y-6">
                {/* Product Images Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">รูปภาพสินค้า</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">คลิกเพื่ออัปโหลดรูปภาพ หรือลากไฟล์มาวาง</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF ขนาดไม่เกิน 10MB</p>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อสินค้า *</label>
                    <input
                      type="text"
                      defaultValue={selectedProduct?.name || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ชื่อสินค้า"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
                    <input
                      type="text"
                      defaultValue={selectedProduct?.sku || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="SKU"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่ *</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                      <option value="">เลือกหมวดหมู่</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่ย่อย</label>
                    <input
                      type="text"
                      defaultValue={selectedProduct?.subcategory || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="หมวดหมู่ย่อย"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">คำอธิบายสินค้า</label>
                  <textarea
                    rows={4}
                    defaultValue={selectedProduct?.description || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="คำอธิบายสินค้า"
                  />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ราคาขาย *</label>
                    <input
                      type="number"
                      defaultValue={selectedProduct?.price || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ราคาเดิม</label>
                    <input
                      type="number"
                      defaultValue={selectedProduct?.originalPrice || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ต้นทุน</label>
                    <input
                      type="number"
                      defaultValue={selectedProduct?.cost || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Inventory */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">จำนวนสต็อก *</label>
                    <input
                      type="number"
                      defaultValue={selectedProduct?.stock || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">น้ำหนัก (กรัม)</label>
                    <input
                      type="number"
                      defaultValue={selectedProduct?.weight || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ความยาว (ซม.)</label>
                    <input
                      type="number"
                      defaultValue={selectedProduct?.dimensions?.length || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ความกว้าง (ซม.)</label>
                    <input
                      type="number"
                      defaultValue={selectedProduct?.dimensions?.width || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ความสูง (ซม.)</label>
                    <input
                      type="number"
                      defaultValue={selectedProduct?.dimensions?.height || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">แท็ก</label>
                  <input
                    type="text"
                    defaultValue={selectedProduct?.tags?.join(', ') || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="แท็ก1, แท็ก2, แท็ก3"
                  />
                  <p className="text-xs text-gray-500 mt-1">แยกแท็กด้วยเครื่องหมายจุลภาค</p>
                </div>

                {/* Status and Featured */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
                    <select 
                      defaultValue={selectedProduct?.status || 'draft'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="draft">แบบร่าง</option>
                      <option value="pending">รอตรวจสอบ</option>
                      <option value="active">ใช้งาน</option>
                      <option value="inactive">ไม่ใช้งาน</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={selectedProduct?.featured || false}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">สินค้าแนะนำ</label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4" />
                    <span>{modalType === 'add' ? 'เพิ่มสินค้า' : 'บันทึกการแก้ไข'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    pending: products.filter(p => p.status === 'pending').length,
    totalViews: products.reduce((sum, p) => sum + p.views, 0),
    totalSales: products.reduce((sum, p) => sum + p.sales, 0)
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">จัดการสินค้า</h1>
              <p className="text-sm text-gray-600">จัดการสินค้าของคุณในระบบ</p>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="h-4 w-4" />
                <span>ส่งออก</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Upload className="h-4 w-4" />
                <span>นำเข้า</span>
              </button>
              <button 
                onClick={() => handleProductAction(null, 'add')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>เพิ่มสินค้าใหม่</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">สินค้าทั้งหมด</p>
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
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">รอตรวจสอบ</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">ยอดวิว</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <ShoppingCart className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">ขายแล้ว</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSales}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ค้นหาสินค้า</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="ชื่อสินค้า, SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">ทั้งหมด</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">ทั้งหมด</option>
                <option value="active">ใช้งาน</option>
                <option value="pending">รอตรวจสอบ</option>
                <option value="inactive">ไม่ใช้งาน</option>
                <option value="draft">แบบร่าง</option>
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่พบสินค้า</h3>
            <p className="mt-1 text-sm text-gray-500">ไม่มีสินค้าที่ตรงกับเงื่อนไขการค้นหา</p>
            <div className="mt-6">
              <button 
                onClick={() => handleProductAction(null, 'add')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto"
              >
                <Plus className="h-4 w-4" />
                <span>เพิ่มสินค้าแรก</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <ProductModal />
    </div>
  );
};

export default VendorProductManagement;

