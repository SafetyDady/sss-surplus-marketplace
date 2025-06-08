'use client';

import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, Star, Shield, Truck, Receipt, MessageCircle, BarChart3, ArrowRight, CheckCircle, Users, TrendingUp, Award } from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "ระบบ Escrow ปลอดภัย",
      description: "เงินของคุณปลอดภัย จ่ายเมื่อได้รับสินค้าแล้วเท่านั้น",
      status: "available"
    },
    {
      icon: Truck,
      title: "จัดส่งหลายช่องทาง",
      description: "เลือกได้ทั้ง Professional Delivery และ Self Pickup",
      status: "available"
    },
    {
      icon: Receipt,
      title: "ใบเสร็จครบถ้วน",
      description: "ใบเสร็จอิเล็กทรอนิกส์ พร้อมรายละเอียดสมบูรณ์",
      status: "available"
    },
    {
      icon: Star,
      title: "ระบบรีวิวโปร่งใส",
      description: "รีวิวจากผู้ซื้อจริง ช่วยตัดสินใจได้ง่ายขึ้น",
      status: "available"
    },
    {
      icon: MessageCircle,
      title: "แชทในระบบ",
      description: "สื่อสารกับผู้ขายได้โดยตรง ปลอดภัยและสะดวก",
      status: "available"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "ติดตามยอดขาย วิเคราะห์ลูกค้า สำหรับผู้ขาย",
      status: "available"
    }
  ];

  const stats = [
    { number: "300+", label: "ผู้ใช้งาน", icon: Users },
    { number: "150+", label: "ผู้ขาย", icon: TrendingUp },
    { number: "฿5M+", label: "GMV/เดือน", icon: Award },
    { number: "98%", label: "ความพึงพอใจ", icon: Star }
  ];

  const categories = [
    "อิเล็กทรอนิกส์",
    "เครื่องใช้ไฟฟ้า", 
    "แฟชั่น",
    "บ้านและสวน",
    "กีฬาและสุขภาพ",
    "หนังสือและสื่อ",
    "อื่นๆ"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-r from-purple-600 to-purple-800'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                isScrolled ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'
              }`}>
                M
              </div>
              <span className={`text-xl font-bold ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                MTP Supply
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-700 hover:text-purple-600' : 'text-white/90 hover:text-white'
              }`}>
                ฟีเจอร์
              </a>
              <a href="#how-it-works" className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-700 hover:text-purple-600' : 'text-white/90 hover:text-white'
              }`}>
                วิธีการใช้งาน
              </a>
              <a href="#categories" className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-700 hover:text-purple-600' : 'text-white/90 hover:text-white'
              }`}>
                หมวดหมู่
              </a>
              <a href="#contact" className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-700 hover:text-purple-600' : 'text-white/90 hover:text-white'
              }`}>
                ติดต่อ
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white/90 hover:bg-white/10'
              }`}>
                เข้าสู่ระบบ
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105">
                สมัครฟรี
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/20">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-white/90 hover:text-white font-medium">ฟีเจอร์</a>
                <a href="#how-it-works" className="text-white/90 hover:text-white font-medium">วิธีการใช้งาน</a>
                <a href="#categories" className="text-white/90 hover:text-white font-medium">หมวดหมู่</a>
                <a href="#contact" className="text-white/90 hover:text-white font-medium">ติดต่อ</a>
                <div className="flex flex-col space-y-2 pt-4 border-t border-white/20">
                  <button className="text-white/90 hover:text-white font-medium text-left">เข้าสู่ระบบ</button>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium">
                    สมัครฟรี
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  แพลตฟอร์มซื้อขาย
                  <span className="block text-orange-400">สินค้าเหลือใช้</span>
                  <span className="block">สำหรับธุรกิจ</span>
                </h1>
                <p className="text-xl lg:text-2xl text-purple-100 leading-relaxed">
                  ค้นหาสินค้า Surplus คุณภาพดี ราคาประหยัด 
                  จากผู้ขายที่เชื่อถือได้ทั่วประเทศ
                </p>
              </div>

              {/* Search Bar */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="ค้นหาสินค้าที่ต้องการ..."
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 4).map((category, index) => (
                    <button
                      key={index}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
                  <span>เริ่มค้นหาสินค้า</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border-2 border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all">
                  เริ่มขายสินค้า
                </button>
              </div>
            </div>

            {/* Stats Dashboard */}
            <div className="lg:justify-self-end">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 space-y-6">
                <h3 className="text-2xl font-bold text-center mb-6">Dashboard สถิติ</h3>
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={index} className="text-center space-y-2">
                        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-3xl font-bold">{stat.number}</div>
                        <div className="text-purple-200 text-sm">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-center pt-4 border-t border-white/20">
                  <p className="text-purple-200 text-sm">อัปเดตล่าสุด: วันนี้</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              ฟีเจอร์ที่พร้อมใช้งาน
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ระบบที่ครบครันสำหรับการซื้อขายสินค้า Surplus อย่างปลอดภัยและมีประสิทธิภาพ
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group">
                  <div className="bg-gray-50 hover:bg-white rounded-2xl p-8 transition-all duration-300 hover:shadow-xl border border-gray-100 hover:border-purple-200 h-full">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              วิธีการใช้งาน
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              เริ่มต้นซื้อขายสินค้า Surplus ได้ง่ายๆ ใน 3 ขั้นตอน
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "สมัครสมาชิก",
                description: "สร้างบัญชีฟรี ใช้เวลาไม่ถึง 2 นาที",
                icon: User
              },
              {
                step: "02", 
                title: "ค้นหาสินค้า",
                description: "เลือกสินค้าจากผู้ขายที่เชื่อถือได้",
                icon: Search
              },
              {
                step: "03",
                title: "ซื้อขายปลอดภัย",
                description: "ชำระเงินผ่านระบบ Escrow ปลอดภัย",
                icon: ShoppingCart
              }
            ].map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{step.step}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              หมวดหมู่สินค้า
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              สินค้า Surplus หลากหลายประเภท พร้อมส่งทั่วประเทศ
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category, index) => (
              <button
                key={index}
                className="bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg group"
              >
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 group-hover:from-purple-500 group-hover:to-purple-600 rounded-xl mx-auto transition-all duration-300"></div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
                    {category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold">
            พร้อมเริ่มต้นแล้วหรือยัง?
          </h2>
          <p className="text-xl text-purple-100 leading-relaxed">
            เข้าร่วมกับผู้ซื้อและผู้ขายหลายร้อยคนที่เชื่อใจ MTP Supply
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105">
              เริ่มซื้อสินค้า
            </button>
            <button className="border-2 border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all">
              เริ่มขายสินค้า
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-lg">
                  M
                </div>
                <span className="text-xl font-bold">MTP Supply</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                แพลตฟอร์มซื้อขายสินค้า Surplus ที่ใหญ่ที่สุดในประเทศไทย
              </p>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">บริการ</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">ซื้อสินค้า</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ขายสินค้า</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ระบบ Escrow</a></li>
                <li><a href="#" className="hover:text-white transition-colors">จัดส่งสินค้า</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">ช่วยเหลือ</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">คู่มือการใช้งาน</a></li>
                <li><a href="#" className="hover:text-white transition-colors">คำถามที่พบบ่อย</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ติดต่อเรา</a></li>
                <li><a href="#" className="hover:text-white transition-colors">รายงานปัญหา</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">ติดต่อเรา</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📧 support@mtpsupply.com</li>
                <li>📞 02-123-4567</li>
                <li>📱 Line: @mtpsupply</li>
                <li>🕒 จันทร์-ศุกร์ 9:00-18:00</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MTP Supply. สงวนลิขสิทธิ์ทุกประการ</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

