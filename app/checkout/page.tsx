'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Phone, MessageCircle, Star, Shield, Truck, CreditCard, Calendar, Users, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function CheckoutPage() {
  const [selectedShipping, setSelectedShipping] = useState('professional');
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [selectedSelfOption, setSelectedSelfOption] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [showSellerContact, setShowSellerContact] = useState(false);

  // Mock product data
  const product = {
    id: 1,
    name: "iPhone 13 Pro Max 256GB สีน้ำเงิน",
    price: 28500,
    originalPrice: 42900,
    discount: 34,
    image: "/api/placeholder/150/150",
    seller: {
      name: "TechSurplus Store",
      rating: 4.8,
      reviews: 156,
      location: "กรุงเทพฯ",
      phone: "02-123-4567",
      line: "@techsurplus"
    },
    condition: "Like New",
    quantity: 1
  };

  // Shipping rates (mock data)
  const shippingRates = {
    kerry: { name: "Kerry Express", price: 50, time: "1-2 วัน" },
    flash: { name: "Flash Express", price: 45, time: "1-2 วัน" },
    thailand_post: { name: "Thailand Post", price: 35, time: "2-3 วัน" }
  };

  const selfServiceOptions = [
    {
      id: 'self_pickup',
      name: 'Self Pickup',
      description: 'มารับสินค้าเอง ณ ที่ผู้ขาย',
      price: 0,
      icon: MapPin,
      requiresAppointment: true
    },
    {
      id: 'peer_delivery',
      name: 'Peer Delivery',
      description: 'หาคนไปทิศทางเดียวกัน แบ่งค่าน้ำมัน',
      price: 25,
      icon: Users,
      requiresAppointment: false
    },
    {
      id: 'meet_up',
      name: 'Meet Up Point',
      description: 'นัดรับส่งจุดกลาง เช่น BTS, MRT',
      price: 15,
      icon: MapPin,
      requiresAppointment: true
    }
  ];

  useEffect(() => {
    if (selectedShipping === 'professional' && selectedCarrier) {
      setShippingCost(shippingRates[selectedCarrier].price);
    } else if (selectedShipping === 'self' && selectedSelfOption) {
      const option = selfServiceOptions.find(opt => opt.id === selectedSelfOption);
      setShippingCost(option ? option.price : 0);
    } else {
      setShippingCost(0);
    }
  }, [selectedShipping, selectedCarrier, selectedSelfOption]);

  const totalAmount = product.price + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg mr-4">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MTP Supply</span>
            </div>
            <div className="ml-auto">
              <h1 className="text-lg font-semibold text-gray-900">ชำระเงิน</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">สินค้าที่สั่งซื้อ</h2>
              <div className="flex items-center space-x-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-lg font-bold text-purple-600">
                      ฿{product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ฿{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                      -{product.discount}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span>สภาพ: {product.condition}</span>
                    <span>จำนวน: {product.quantity}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">ข้อมูลผู้ขาย</h2>
                <button
                  onClick={() => setShowSellerContact(!showSellerContact)}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  {showSellerContact ? 'ซ่อนข้อมูลติดต่อ' : 'ดูข้อมูลติดต่อ'}
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">
                    {product.seller.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{product.seller.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{product.seller.rating} ({product.seller.reviews} รีวิว)</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{product.seller.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {showSellerContact && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button className="flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>แชท</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg transition-colors">
                      <Phone className="w-4 h-4" />
                      <span>โทร</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>Line</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Shipping Options */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                เลือกวิธีการจัดส่ง
              </h2>

              {/* Shipping Type Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setSelectedShipping('professional')}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    selectedShipping === 'professional'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedShipping === 'professional' ? 'bg-purple-500 text-white' : 'bg-gray-100'
                    }`}>
                      <Truck className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">Professional Delivery</h3>
                      <p className="text-sm text-gray-600">บริการขนส่งมืออาชีพ</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedShipping('self')}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    selectedShipping === 'self'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedShipping === 'self' ? 'bg-purple-500 text-white' : 'bg-gray-100'
                    }`}>
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">Self Service</h3>
                      <p className="text-sm text-gray-600">รับส่งด้วยตนเอง</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Professional Delivery Options */}
              {selectedShipping === 'professional' && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">เลือกบริษัทขนส่ง</h4>
                  {Object.entries(shippingRates).map(([key, carrier]) => (
                    <label key={key} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="carrier"
                        value={key}
                        checked={selectedCarrier === key}
                        onChange={(e) => setSelectedCarrier(e.target.value)}
                        className="accent-purple-600"
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <span className="font-medium">{carrier.name}</span>
                          <span className="text-sm text-gray-600 ml-2">({carrier.time})</span>
                        </div>
                        <span className="font-medium text-purple-600">฿{carrier.price}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Self Service Options */}
              {selectedShipping === 'self' && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">เลือกวิธีการรับส่ง</h4>
                  {selfServiceOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <label key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="selfOption"
                          value={option.id}
                          checked={selectedSelfOption === option.id}
                          onChange={(e) => setSelectedSelfOption(e.target.value)}
                          className="accent-purple-600"
                        />
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">{option.name}</span>
                              <p className="text-sm text-gray-600">{option.description}</p>
                            </div>
                            <span className="font-medium text-purple-600">
                              {option.price === 0 ? 'ฟรี' : `฿${option.price}`}
                            </span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Appointment Scheduling */}
              {selectedShipping === 'self' && selectedSelfOption && 
               selfServiceOptions.find(opt => opt.id === selectedSelfOption)?.requiresAppointment && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    นัดหมายเวลา
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">วันที่</label>
                      <input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เวลา</label>
                      <select
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">เลือกเวลา</option>
                        <option value="09:00">09:00</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                        <option value="17:00">17:00</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                วิธีการชำระเงิน
              </h2>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="radio" name="payment" value="escrow" defaultChecked className="accent-purple-600" />
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <span className="font-medium">ระบบ Escrow (แนะนำ)</span>
                      <p className="text-sm text-gray-600">เงินจะถูกโอนให้ผู้ขายเมื่อคุณได้รับสินค้าแล้ว</p>
                    </div>
                  </div>
                </label>
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-green-600 mt-0.5" />
                  <div className="text-sm text-green-700">
                    <p className="font-medium">ระบบ Escrow คืออะไร?</p>
                    <p>เงินของคุณจะถูกเก็บไว้อย่างปลอดภัย และจะโอนให้ผู้ขายเมื่อคุณยืนยันว่าได้รับสินค้าแล้ว</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border sticky top-24">
              <h2 className="text-lg font-semibold mb-4">สรุปคำสั่งซื้อ</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>ราคาสินค้า</span>
                  <span>฿{product.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>ค่าจัดส่ง</span>
                  <span>{shippingCost === 0 ? 'ฟรี' : `฿${shippingCost}`}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>รวมทั้งสิ้น</span>
                    <span className="text-purple-600">฿{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="mb-6 space-y-2">
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>ระบบ Escrow ปลอดภัย</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>การันตีคืนเงิน 100%</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>ข้อมูลเข้ารหัส SSL</span>
                </div>
              </div>

              {/* Validation Messages */}
              {selectedShipping === 'professional' && !selectedCarrier && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-yellow-700">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">กรุณาเลือกบริษัทขนส่ง</span>
                  </div>
                </div>
              )}

              {selectedShipping === 'self' && !selectedSelfOption && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-yellow-700">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">กรุณาเลือกวิธีการรับส่ง</span>
                  </div>
                </div>
              )}

              <button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={
                  (selectedShipping === 'professional' && !selectedCarrier) ||
                  (selectedShipping === 'self' && !selectedSelfOption)
                }
              >
                ดำเนินการชำระเงิน
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                การคลิกชำระเงินแสดงว่าคุณยอมรับ
                <a href="#" className="text-purple-600 hover:underline">ข้อกำหนดการใช้งาน</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

