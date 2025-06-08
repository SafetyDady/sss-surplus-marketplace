import Link from 'next/link'
import { Search, TrendingUp, Shield, Truck, FileText, Star, MessageCircle, BarChart3, Clock, Users, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-purple-600">MTP Supply</h1>
              <nav className="hidden md:flex space-x-6">
                <a href="#early-access" className="text-gray-600 hover:text-purple-600">Early Access</a>
                <a href="#timeline" className="text-gray-600 hover:text-purple-600">Timeline</a>
                <a href="#features" className="text-gray-600 hover:text-purple-600">Features</a>
                <a href="#contact" className="text-gray-600 hover:text-purple-600">ติดต่อ</a>
              </nav>
            </div>
            <div className="flex space-x-3">
              <Link href="/auth/signin" className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50">
                เข้าสู่ระบบ
              </Link>
              <Link href="/auth/signup" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Apply Early Access
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Early Access Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Clock size={20} />
            <span className="font-semibold">🚀 Early Access Program เปิดแล้ว! สมัครเป็น Vendor คนแรกๆ</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-white/20 rounded-full px-4 py-2 mb-6">
                <span className="text-sm font-medium">🎯 Pre-Launch Phase • Early Access Program</span>
              </div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                แพลตฟอร์มซื้อขาย<br />
                สินค้าเหลือใช้ สำหรับ<br />
                ธุรกิจ
              </h1>
              <p className="text-xl mb-8 opacity-90">
                เข้าร่วม Early Access Program และเป็นหนึ่งในผู้ขายคนแรกๆ 
                ที่จะได้เปรียบในการสร้างฐานลูกค้าและทดสอบระบบก่อนใคร
              </p>
              <div className="flex space-x-4 mb-8">
                <Link href="/auth/signup" className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
                  เข้าร่วม Early Access
                </Link>
                <Link href="#timeline" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10">
                  ดู Timeline
                </Link>
              </div>

              {/* Search Bar */}
              <div className="flex bg-white rounded-lg p-2 max-w-md">
                <input 
                  type="text" 
                  placeholder="ค้นหาสินค้าที่ต้องการ เช่น อิเล็กทรอนิกส์, เครื่องจักร"
                  className="flex-1 px-4 py-2 text-gray-700 outline-none"
                />
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Dashboard Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Early Access Progress</h3>
                <TrendingUp size={24} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">5+</div>
                  <div className="text-sm opacity-75">Vendors Ready</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-sm opacity-75">Products Uploaded</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">Week 2</div>
                  <div className="text-sm opacity-75">Current Phase</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-sm opacity-75">System Ready</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Early Access Timeline */}
      <section id="timeline" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Early Access Timeline</h2>
            <p className="text-xl text-gray-600">เข้าร่วมโปรแกรมและได้เปรียบคู่แข่งตั้งแต่วันแรก</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Week 1 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                <h3 className="ml-3 text-lg font-semibold">Week 1</h3>
              </div>
              <h4 className="font-semibold text-green-600 mb-2">Partner Vendor Only</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• เพิ่มสินค้าได้</li>
                <li>• จัดการสต็อก</li>
                <li>• อัปโหลดรูปภาพ</li>
                <li>• ตั้งราคาสินค้า</li>
              </ul>
              <div className="mt-4 text-xs text-green-600 font-medium">✅ เสร็จแล้ว</div>
            </div>

            {/* Week 2 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                <h3 className="ml-3 text-lg font-semibold">Week 2</h3>
              </div>
              <h4 className="font-semibold text-blue-600 mb-2">Expand Vendors</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• เชิญ Vendor เพิ่ม 5-10 ราย</li>
                <li>• Workshop การใช้งาน</li>
                <li>• สร้าง Content 100+ สินค้า</li>
                <li>• ระบบ Feedback</li>
              </ul>
              <div className="mt-4 text-xs text-blue-600 font-medium">🔄 กำลังดำเนินการ</div>
            </div>

            {/* Week 3-4 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
              <div className="flex items-center mb-4">
                <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                <h3 className="ml-3 text-lg font-semibold">Week 3-4</h3>
              </div>
              <h4 className="font-semibold text-purple-600 mb-2">Public Preview</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• เปิดให้ดูสินค้า</li>
                <li>• ระบบค้นหา</li>
                <li>• ติดต่อผู้ขาย</li>
                <li>• Wishlist</li>
              </ul>
              <div className="mt-4 text-xs text-purple-600 font-medium">⏳ เร็วๆ นี้</div>
            </div>

            {/* Week 5+ */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
              <div className="flex items-center mb-4">
                <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
                <h3 className="ml-3 text-lg font-semibold">Week 5+</h3>
              </div>
              <h4 className="font-semibold text-orange-600 mb-2">Full Launch</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• ระบบชำระเงิน</li>
                <li>• สั่งซื้อออนไลน์</li>
                <li>• จัดการออเดอร์</li>
                <li>• Analytics</li>
              </ul>
              <div className="mt-4 text-xs text-orange-600 font-medium">🚀 Coming Soon</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">ฟีเจอร์ที่พร้อมใช้งาน</h2>
            <p className="text-xl text-gray-600">ระบบที่ครบครันและปลอดภัยสำหรับการซื้อขายสินค้าเหลือใช้</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Available Features */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-green-200">
              <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Shield className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                Product Management
                <CheckCircle className="ml-2 text-green-500" size={20} />
              </h3>
              <p className="text-gray-600 mb-4">
                เพิ่ม แก้ไข และจัดการสินค้าได้อย่างง่ายดาย พร้อมระบบอัปโหลดรูปภาพและจัดการสต็อก
              </p>
              <div className="text-sm text-green-600 font-medium">✅ Available Now</div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-green-200">
              <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Search className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                Search & Browse
                <CheckCircle className="ml-2 text-green-500" size={20} />
              </h3>
              <p className="text-gray-600 mb-4">
                ค้นหาและเรียกดูสินค้าได้อย่างรวดเร็ว พร้อมระบบกรองและจัดหมวดหมู่ที่ครบถ้วน
              </p>
              <div className="text-sm text-green-600 font-medium">✅ Available Now</div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-green-200">
              <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <MessageCircle className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                Direct Contact
                <CheckCircle className="ml-2 text-green-500" size={20} />
              </h3>
              <p className="text-gray-600 mb-4">
                ติดต่อผู้ขายได้โดยตรง สอบถามรายละเอียดและต่อรองราคาผ่านระบบที่ปลอดภัย
              </p>
              <div className="text-sm text-green-600 font-medium">✅ Available Now</div>
            </div>

            {/* Coming Soon Features */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-orange-200 opacity-75">
              <div className="bg-orange-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Truck className="text-orange-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                Online Payment
                <Clock className="ml-2 text-orange-500" size={20} />
              </h3>
              <p className="text-gray-600 mb-4">
                ระบบชำระเงินออนไลน์ที่ปลอดภัย รองรับหลายช่องทาง พร้อมระบบ Escrow
              </p>
              <div className="text-sm text-orange-600 font-medium">🚀 Coming in Week 5</div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-orange-200 opacity-75">
              <div className="bg-orange-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <FileText className="text-orange-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                Order Management
                <Clock className="ml-2 text-orange-500" size={20} />
              </h3>
              <p className="text-gray-600 mb-4">
                จัดการออเดอร์ ติดตามสถานะ และออกใบเสร็จอย่างครบถ้วน
              </p>
              <div className="text-sm text-orange-600 font-medium">🚀 Coming in Week 5</div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-orange-200 opacity-75">
              <div className="bg-orange-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="text-orange-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                Analytics Dashboard
                <Clock className="ml-2 text-orange-500" size={20} />
              </h3>
              <p className="text-gray-600 mb-4">
                ติดตามยอดขาย วิเคราะห์ลูกค้า และดูประสิทธิภาพการขายแบบ Real-time
              </p>
              <div className="text-sm text-orange-600 font-medium">🚀 Coming in Week 5</div>
            </div>
          </div>
        </div>
      </section>

      {/* Early Access Benefits */}
      <section id="early-access" className="py-20 bg-gradient-to-br from-purple-600 to-indigo-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">ทำไมต้องเข้าร่วม Early Access?</h2>
            <p className="text-xl opacity-90">ได้เปรียบคู่แข่งและสร้างฐานลูกค้าตั้งแต่วันแรก</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <div className="bg-white/20 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">First Mover Advantage</h3>
              <p className="opacity-90">
                เป็นผู้ขายคนแรกๆ ในแพลตฟอร์ม ได้เปรียบในการสร้างฐานลูกค้าและ Brand Recognition
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <div className="bg-white/20 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Star className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Shape the Platform</h3>
              <p className="opacity-90">
                มีส่วนร่วมในการพัฒนาระบบ ให้ Feedback และปรับปรุงฟีเจอร์ตามความต้องการจริง
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <div className="bg-white/20 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Premium Support</h3>
              <p className="opacity-90">
                ได้รับการสนับสนุนแบบ VIP จากทีมพัฒนา พร้อมช่วยเหลือตลอด 24/7
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">พร้อมเริ่มต้นแล้วหรือยัง?</h2>
          <p className="text-xl text-gray-600 mb-8">
            เข้าร่วม Early Access Program และเป็นส่วนหนึ่งของการเปลี่ยนแปลงวงการซื้อขายสินค้าเหลือใช้
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/signup" className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700">
              เข้าร่วม Early Access
            </Link>
            <Link href="#contact" className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-50">
              ติดต่อสอบถาม
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MTP Supply</h3>
              <p className="text-gray-400 mb-4">
                แพลตฟอร์มซื้อขายสินค้าเหลือใช้ที่ใหญ่ที่สุดในประเทศไทย
              </p>
              <div className="text-sm text-gray-400">
                Early Access Program<br />
                เปิดให้สมัครแล้ว!
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Early Access</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#timeline" className="hover:text-white">Timeline</a></li>
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="/auth/signup" className="hover:text-white">Apply Now</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Vendor Guide</a></li>
                <li><a href="#" className="hover:text-white">Feedback</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <div>Email: early-access@mtpsupply.com</div>
                <div>Line: @mtpsupply</div>
                <div>Tel: 02-xxx-xxxx</div>
                <div>Hours: Mon-Fri 9AM-6PM</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MTP Supply. All rights reserved. | Early Access Program</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

