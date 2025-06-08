import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white text-blue-600 w-10 h-10 rounded-lg flex items-center justify-center font-bold">
              SSS
            </div>
            <span className="text-xl font-bold">SSS Supply</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="/" className="hover:text-blue-200 transition-colors">หน้าหลัก</a>
            <a href="/products" className="hover:text-blue-200 transition-colors">สินค้า</a>
            <a href="/about" className="text-blue-200 font-semibold">เกี่ยวกับเรา</a>
            <a href="/contact" className="hover:text-blue-200 transition-colors">ติดต่อเรา</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            เกี่ยวกับ <span className="text-blue-600">SSS Supply</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            ผู้นำด้านการจัดหาและจำหน่ายสินค้าคุณภาพสูง ด้วยประสบการณ์กว่า 10 ปี 
            เราให้บริการลูกค้าทั่วประเทศไทยด้วยความเชี่ยวชาญและความน่าเชื่อถือ
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">เรื่องราวของเรา</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                SSS Supply ก่อตั้งขึ้นในปี 2014 ด้วยวิสัยทัศน์ในการเป็นผู้นำด้านการจัดหาสินค้าคุณภาพสูง
                เราเริ่มต้นจากธุรกิจขนาดเล็กและเติบโตมาเป็นบริษัทชั้นนำที่มีเครือข่ายกว้างขวางทั่วประเทศ
              </p>
              <p className="text-gray-600 leading-relaxed">
                ด้วยความมุ่งมั่นในการให้บริการที่เป็นเลิศและการสร้างความสัมพันธ์ที่ยั่งยืนกับลูกค้า
                เราได้รับความไว้วางใจจากพันธมิตรทางธุรกิจและลูกค้ามากมายทั่วประเทศ
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
                  <div className="text-gray-600">ปีประสบการณ์</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
                  <div className="text-gray-600">ลูกค้าพึงพอใจ</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                  <div className="text-gray-600">พันธมิตรทางธุรกิจ</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                  <div className="text-gray-600">บริการลูกค้า</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">พันธกิจ & วิสัยทัศน์</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              เราทำงานด้วยหัวใจและความมุ่งมั่นเพื่อสร้างคุณค่าให้กับลูกค้าและสังคม
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">พันธกิจ</h3>
              <p className="text-gray-600 leading-relaxed">
                มุ่งมั่นในการจัดหาและจำหน่ายสินค้าคุณภาพสูงที่ตอบสนองความต้องการของลูกค้า
                ด้วยบริการที่เป็นเลิศและราคาที่เป็นธรรม เพื่อสร้างความพึงพอใจสูงสุดให้กับลูกค้า
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">วิสัยทัศน์</h3>
              <p className="text-gray-600 leading-relaxed">
                เป็นผู้นำด้านการจัดหาสินค้าในประเทศไทย ที่ได้รับการยอมรับในระดับสากล
                ด้วยนวัตกรรมและเทคโนโลยีที่ทันสมัย เพื่อสร้างอนาคตที่ยั่งยืนร่วมกัน
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">ค่านิยมองค์กร</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              หลักการสำคัญที่เป็นรากฐานในการดำเนินธุรกิจและสร้างความสำเร็จร่วมกัน
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">คุณภาพ</h3>
              <p className="text-gray-600">
                มุ่งมั่นในการให้บริการและสินค้าที่มีคุณภาพสูงสุด
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">ความน่าเชื่อถือ</h3>
              <p className="text-gray-600">
                สร้างความไว้วางใจผ่านการปฏิบัติที่โปร่งใสและซื่อสัตย์
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">นวัตกรรม</h3>
              <p className="text-gray-600">
                พัฒนาและปรับปรุงอย่างต่อเนื่องเพื่อตอบสนองความต้องการ
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">การบริการ</h3>
              <p className="text-gray-600">
                ให้บริการด้วยใจและความเอาใจใส่ในทุกรายละเอียด
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">ทีมผู้บริหาร</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ทีมงานมืออาชีพที่มีประสบการณ์และความเชี่ยวชาญในการนำพาองค์กรสู่ความสำเร็จ
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                สม
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">สมชาย วิทยากุล</h3>
              <p className="text-blue-600 font-semibold mb-4">ประธานเจ้าหน้าที่บริหาร</p>
              <p className="text-gray-600 text-sm">
                ประสบการณ์กว่า 15 ปีในอุตสาหกรรมการจัดหาสินค้า 
                ผู้นำองค์กรด้วยวิสัยทัศน์และความเชี่ยวชาญ
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                อน
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">อนุชา ธุรกิจดี</h3>
              <p className="text-purple-600 font-semibold mb-4">ผู้อำนวยการฝ่ายขาย</p>
              <p className="text-gray-600 text-sm">
                เชี่ยวชาญด้านการขายและการตลาด มีเครือข่ายลูกค้า
                กว้างขวางทั่วประเทศ
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                ปร
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">ประยุทธ คุณภาพดี</h3>
              <p className="text-green-600 font-semibold mb-4">ผู้อำนวยการฝ่ายปฏิบัติการ</p>
              <p className="text-gray-600 text-sm">
                ผู้เชี่ยวชาญด้านการจัดการห่วงโซ่อุปทานและ
                การควบคุมคุณภาพสินค้า
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">พร้อมเริ่มต้นร่วมกับเราแล้วหรือยัง?</h2>
          <p className="text-xl mb-8 opacity-90">
            ติดต่อเราวันนี้เพื่อรับคำปรึกษาและข้อเสนอพิเศษสำหรับลูกค้าใหม่
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              ติดต่อเรา
            </a>
            <a 
              href="/products" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              ดูสินค้าของเรา
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold">
                  SSS
                </div>
                <span className="text-xl font-bold">SSS Supply</span>
              </div>
              <p className="text-gray-400">
                ผู้นำด้านการจัดหาสินค้าคุณภาพสูง ด้วยประสบการณ์และความเชี่ยวชาญ
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">เมนูหลัก</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">หน้าหลัก</a></li>
                <li><a href="/products" className="hover:text-white transition-colors">สินค้า</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">เกี่ยวกับเรา</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">ติดต่อเรา</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">บริการ</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">จัดหาสินค้า</a></li>
                <li><a href="#" className="hover:text-white transition-colors">คลังสินค้า</a></li>
                <li><a href="#" className="hover:text-white transition-colors">จัดส่งสินค้า</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ให้คำปรึกษา</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">ติดต่อเรา</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📞 02-123-4567</li>
                <li>📧 info@ssssupply.com</li>
                <li>📍 กรุงเทพมหานคร</li>
                <li>🕒 จันทร์-ศุกร์ 8:00-17:00</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SSS Supply. สงวนลิขสิทธิ์.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

