'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, MapPin, Clock, Heart, ShoppingCart, ArrowLeft, Grid, List, SlidersHorizontal } from 'lucide-react';

export default function ProductSelection() {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(new Set());

  const categories = [
    { id: 'all', name: 'ทั้งหมด', count: 156 },
    { id: 'electronics', name: 'อิเล็กทรอนิกส์', count: 45 },
    { id: 'appliances', name: 'เครื่องใช้ไฟฟ้า', count: 32 },
    { id: 'fashion', name: 'แฟชั่น', count: 28 },
    { id: 'home', name: 'บ้านและสวน', count: 23 },
    { id: 'sports', name: 'กีฬาและสุขภาพ', count: 18 },
    { id: 'books', name: 'หนังสือและสื่อ', count: 10 }
  ];

  const products = [
    {
      id: 1,
      name: "iPhone 13 Pro Max 256GB สีน้ำเงิน",
      price: 28500,
      originalPrice: 42900,
      discount: 34,
      rating: 4.8,
      reviews: 24,
      location: "กรุงเทพฯ",
      seller: "TechSurplus Store",
      image: "/api/placeholder/300/300",
      condition: "Like New",
      stock: 3,
      category: "electronics",
      tags: ["ยอดนิยม", "ลดราคา"],
      description: "iPhone 13 Pro Max สภาพใหม่ 95% ใช้งานเพียง 3 เดือน มีกล่องครบ"
    },
    {
      id: 2,
      name: "MacBook Air M2 8GB/256GB สีเงิน",
      price: 32900,
      originalPrice: 42900,
      discount: 23,
      rating: 4.9,
      reviews: 18,
      location: "เชียงใหม่",
      seller: "Apple Surplus",
      image: "/api/placeholder/300/300",
      condition: "Excellent",
      stock: 2,
      category: "electronics",
      tags: ["ของใหม่"],
      description: "MacBook Air M2 สภาพใหม่ 98% ยังอยู่ในประกัน Apple Care"
    },
    {
      id: 3,
      name: "เครื่องซักผ้า Samsung 8kg",
      price: 8500,
      originalPrice: 15900,
      discount: 47,
      rating: 4.6,
      reviews: 12,
      location: "ขอนแก่น",
      seller: "Home Appliance Plus",
      image: "/api/placeholder/300/300",
      condition: "Good",
      stock: 1,
      category: "appliances",
      tags: ["ลดราคา"],
      description: "เครื่องซักผ้า Samsung ใช้งาน 1 ปี สภาพดี ทำงานปกติ"
    },
    {
      id: 4,
      name: "Nike Air Max 270 ไซส์ 42",
      price: 2800,
      originalPrice: 4500,
      discount: 38,
      rating: 4.7,
      reviews: 8,
      location: "ภูเก็ต",
      seller: "Fashion Outlet",
      image: "/api/placeholder/300/300",
      condition: "Very Good",
      stock: 5,
      category: "fashion",
      tags: ["ยอดนิยม"],
      description: "รองเท้า Nike Air Max 270 สภาพดีมาก ใส่เพียงไม่กี่ครั้ง"
    },
    {
      id: 5,
      name: "ชุดโซฟา 3+2+1 หนังแท้",
      price: 15900,
      originalPrice: 28000,
      discount: 43,
      rating: 4.5,
      reviews: 6,
      location: "นครราชสีมา",
      seller: "Furniture Surplus",
      image: "/api/placeholder/300/300",
      condition: "Good",
      stock: 1,
      category: "home",
      tags: ["ของใหม่"],
      description: "ชุดโซฟาหนังแท้ สภาพดี ใช้งานเพียง 6 เดือน"
    },
    {
      id: 6,
      name: "ลู่วิ่งไฟฟ้า Horizon T101",
      price: 12500,
      originalPrice: 22000,
      discount: 43,
      rating: 4.4,
      reviews: 9,
      location: "สงขลา",
      seller: "Fitness Equipment",
      image: "/api/placeholder/300/300",
      condition: "Very Good",
      stock: 2,
      category: "sports",
      tags: ["ลดราคา"],
      description: "ลู่วิ่งไฟฟ้า Horizon T101 สภาพดีมาก ใช้งานน้อย"
    }
  ];

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'discount':
        return b.discount - a.discount;
      default:
        return b.id - a.id; // newest first
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-xl font-bold text-gray-900">MTP Supply</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="ค้นหาสินค้า..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                ตัวกรอง
              </h3>
              
              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">หมวดหมู่</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-purple-100 text-purple-700 font-medium'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <span className="text-sm text-gray-500">({category.count})</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">ช่วงราคา</h4>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="ต่ำสุด"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="สูงสุด"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100000])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    ฿{priceRange[0].toLocaleString()} - ฿{priceRange[1].toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Condition */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">สภาพสินค้า</h4>
                <div className="space-y-2">
                  {['Like New', 'Excellent', 'Very Good', 'Good'].map(condition => (
                    <label key={condition} className="flex items-center">
                      <input type="checkbox" className="mr-2 accent-purple-600" />
                      <span className="text-sm">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <h4 className="font-medium mb-3">พื้นที่</h4>
                <div className="space-y-2">
                  {['กรุงเทพฯ', 'เชียงใหม่', 'ขอนแก่น', 'ภูเก็ต', 'นครราชสีมา'].map(location => (
                    <label key={location} className="flex items-center">
                      <input type="checkbox" className="mr-2 accent-purple-600" />
                      <span className="text-sm">{location}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">สินค้า Surplus</h2>
                <p className="text-gray-600">พบ {sortedProducts.length} รายการ</p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="newest">ใหม่ล่าสุด</option>
                  <option value="price-low">ราคาต่ำ-สูง</option>
                  <option value="price-high">ราคาสูง-ต่ำ</option>
                  <option value="rating">คะแนนสูงสุด</option>
                  <option value="discount">ส่วนลดสูงสุด</option>
                </select>

                {/* View Mode */}
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {sortedProducts.map(product => (
                <div key={product.id} className={`bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 ${
                  viewMode === 'list' ? 'flex' : ''
                }`}>
                  {/* Product Image */}
                  <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`w-full object-cover ${
                        viewMode === 'list' ? 'h-48 rounded-l-xl' : 'h-48 rounded-t-xl'
                      }`}
                    />
                    
                    {/* Discount Badge */}
                    {product.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-medium">
                        -{product.discount}%
                      </div>
                    )}
                    
                    {/* Tags */}
                    <div className="absolute top-3 right-3 flex flex-col space-y-1">
                      {product.tags.map(tag => (
                        <span key={tag} className="bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                      <Heart className={`w-4 h-4 ${
                        favorites.has(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                      }`} />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="space-y-3">
                      {/* Product Name */}
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      {/* Price */}
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-purple-600">
                          ฿{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ฿{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      
                      {/* Rating & Reviews */}
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium ml-1">{product.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({product.reviews} รีวิว)</span>
                      </div>
                      
                      {/* Seller & Location */}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{product.seller}</span>
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{product.location}</span>
                        </div>
                      </div>
                      
                      {/* Condition & Stock */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg">
                          {product.condition}
                        </span>
                        <span className="text-gray-600">
                          เหลือ {product.stock} ชิ้น
                        </span>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-2">
                        <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                          ดูรายละเอียด
                        </button>
                        <button className="px-4 py-2 border border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors">
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="bg-white hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg border border-gray-300 font-medium transition-colors">
                โหลดสินค้าเพิ่มเติม
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

