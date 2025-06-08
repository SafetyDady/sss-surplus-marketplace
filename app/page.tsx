// /app/page.tsx - Complete Landing Page

import Link from 'next/link'
import { Search, TrendingUp, Shield, Truck, FileText, Star, MessageCircle, BarChart3 } from 'lucide-react'

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
                <a href="#" className="text-gray-600 hover:text-purple-600">หิเงอร์</a>
                <a href="#" className="text-gray-600 hover:text-purple-600">วิธีการใช้งาน</a>
                <a href="#" className="text-gray-600 hover:text-purple-600">รีวิว</a>
                <a href="#" className="text-gray-600 hover:text-purple-600">ติดต่อ</a>
              </nav>
            </div>
            <div className="flex space-x-3">
              <Link href="/auth/signin" className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50">
                เข้าสู่ระบบ
              </Link>
              <Link href="/auth/signup" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                สมัครฟรี
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                แพลตฟอร์มซื้อขาย<br />
                สินค้าเหลือใช้ สำหรับ<br />
                ธุรกิจ
              </h1>
              <p className="text-xl mb-8 opacity-90">
                เพิ่มรายได้จากสินค้าเหลือสต็อก หรือประหยัดต้นทุนด้วยการซื้อ
                สินค้าคุณภาพในราคาดี ผ่านระบบที่ปลอดภัยและเชื่อถือได้
              </p>
              <div className="flex space-x-4 mb-8">
                <Link href="/auth/signup" className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
                  เริ่มขายวันนี้
                </Link>
                <Link href="/auth/signin" className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600">
                  เริ่มซื้อวันนี้
                </Link>
              </div>
              
              {/* Search Bar */}
              <div className="bg-white rounded-lg p-2 flex items-center max-w-lg">
                <input 
                  type="text" 
                  placeholder="ค้นหาสินค้าที่ต้องการ เช่น อิเล็กทรอนิกส์, เครื่องจักร"
                  className="flex-1 px-4 py-2 text-gray-700 outline-none"
                />
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  ค้นหา
                </button>
              </div>
            </div>

            {/* Dashboard Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Dashboard</h3>
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">50+</div>
                  <div className="text-sm opacity-80">Vendors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">200+</div>
                  <div className="text-sm opacity-80">Buyers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">฿2.5M</div>
                  <div className="text-sm opacity-80">GMV/เดือน</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">98%</div>
                  <div className="text-sm opacity-80">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-purple-600 mb-4">
              ทำไมต้องเลือก MTP Supply?
            </h2>
            <p className="text-xl text-gray-600">
              ระบบที่ครบครันและปลอดภัย เพื่อการซื้อขายที่มีประสิทธิภาพ
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">ระบบ Escrow ปลอดภัย</h3>
              <p className="text-gray-600">
                เงินของคุณปลอดภัยด้วยระบบ Escrow ที่เก็บเงินกว่าจะได้รับสินค้าและยืนยันความพอใจ
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Truck className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">จัดส่งหลายช่องทาง</h3>
              <p className="text-gray-600">
                เลือกผู้ให้บริการโลจิสติกส์ต่อการ ไปรษณีย์ไทย Kerry J&T Flash พร้อมระบบติดตามแบบ Real-time
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">ใบเสร็จครบถ้วน</h3>
              <p className="text-gray-600">
                รองรับใบกำกับภาษีและใบกำกับภาษี เก็บรายละเอียดพลาดแบบได้ความสะดวกการ
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">ระบบรีวิวและเรตติ้ง</h3>
              <p className="text-gray-600">
                สร้างความเชื่อมั่นด้วยระบบรีวิวจากผู้ซื้อจริง ช่วยให้เลือกผู้ขายที่เชื่อถือได้
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <MessageCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">แชทในระบบ</h3>
              <p className="text-gray-600">
                สื่อสารกับผู้ขายได้โดยตรงในระบบ ปลอดภัยและสะดวก ไม่ต้องแลกเปลี่ยนข้อมูลส่วนตัว
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Analytics Dashboard</h3>
              <p className="text-gray-600">
                ติดตามยอดขาย วิเคราะห์กลุ่ม และดูประสิทธิภาพการขายผ่าน Dashboard ที่ครบครัน
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            พร้อมเริ่มต้นแล้วหรือยัง?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            เข้าร่วมกับผู้ประกอบการหลายพันรายที่เชื่อใจ MTP Supply
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/signup" className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100">
              เริ่มขายเลย
            </Link>
            <Link href="/auth/signin" className="border border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-600">
              เริ่มซื้อเลย
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MTP Supply</h3>
              <p className="text-gray-400">
                แพลตฟอร์มซื้อขายสินค้าเหลือใช้ สำหรับธุรกิจและองค์กร
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">บริการ</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">ซื้อสินค้า</a></li>
                <li><a href="#" className="hover:text-white">ขายสินค้า</a></li>
                <li><a href="#" className="hover:text-white">ระบบ Escrow</a></li>
                <li><a href="#" className="hover:text-white">จัดส่งสินค้า</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">สนับสนุน</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">ศูนย์ช่วยเหลือ</a></li>
                <li><a href="#" className="hover:text-white">วิธีการใช้งาน</a></li>
                <li><a href="#" className="hover:text-white">ติดต่อเรา</a></li>
                <li><a href="#" className="hover:text-white">เงื่อนไขการใช้งาน</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">ติดต่อ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>อีเมล: support@mtpsupply.com</li>
                <li>โทร: 02-xxx-xxxx</li>
                <li>LINE: @mtpsupply</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MTP Supply. สงวนลิขสิทธิ์.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

