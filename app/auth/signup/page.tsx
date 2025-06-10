export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-purple-600 mb-4">
              🚀 Early Access Application Form
            </h1>
            <p className="text-lg text-gray-600">
              ขอบคุณที่สนใจเข้าร่วม MTP Supply Early Access Program!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Information Required */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">📋 ข้อมูลที่ต้องการ:</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-purple-600 mb-2">ข้อมูลบริษัท/ร้านค้า:</h3>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• ชื่อบริษัท/ร้านค้า</li>
                    <li>• ประเภทธุรกิจ</li>
                    <li>• เลขประจำตัวผู้เสียภาษี</li>
                    <li>• ที่อยู่</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-purple-600 mb-2">ข้อมูลผู้ติดต่อ:</h3>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• ชื่อ-นามสกุล</li>
                    <li>• ตำแหน่ง</li>
                    <li>• อีเมล</li>
                    <li>• เบอร์โทรศัพท์</li>
                    <li>• Line ID (ถ้ามี)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-purple-600 mb-2">ข้อมูลสินค้า:</h3>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• ประเภทสินค้าที่ต้องการขาย</li>
                    <li>• จำนวนสินค้าโดยประมาณ</li>
                    <li>• มูลค่าสินค้าโดยประมาณ</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">📞 วิธีการสมัคร:</h2>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <p className="text-orange-800 font-medium mb-2">
                  ⚠️ ตอนนี้ระบบออนไลน์ยังไม่พร้อม
                </p>
                <p className="text-orange-700 text-sm">
                  กรุณาติดต่อผ่านช่องทางดังนี้:
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <span className="text-purple-600">📧</span>
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-gray-600">early-access@mtpsupply.com</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <span className="text-green-600">📱</span>
                  </div>
                  <div>
                    <div className="font-semibold">Line</div>
                    <div className="text-gray-600">@mtpsupply</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <span className="text-blue-600">☎️</span>
                  </div>
                  <div>
                    <div className="font-semibold">Tel</div>
                    <div className="text-gray-600">02-xxx-xxxx</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <span className="text-gray-600">⏰</span>
                  </div>
                  <div>
                    <div className="font-semibold">เวลาทำการ</div>
                    <div className="text-gray-600">จันทร์-ศุกร์ 9:00-18:00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Process Steps */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">🎯 ขั้นตอนถัดไป:</h2>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold text-sm">ส่งข้อมูล</h3>
                <p className="text-xs text-gray-600">ส่งข้อมูลตามรายการข้างต้น</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold text-sm">รอการติดต่อกลับ</h3>
                <p className="text-xs text-gray-600">ทีมงานจะติดต่อภายใน 24 ชั่วโมง</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold text-sm">นัดหมาย Demo</h3>
                <p className="text-xs text-gray-600">ชมระบบและอบรมการใช้งาน</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600 font-bold">4</span>
                </div>
                <h3 className="font-semibold text-sm">เริ่มใช้งาน</h3>
                <p className="text-xs text-gray-600">เพิ่มสินค้าและเริ่มขายได้เลย!</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">⚡ Early Access Benefits:</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✅</span>
                <span><strong>ไม่มีค่าสมัคร</strong> ในช่วง Early Access</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✅</span>
                <span><strong>Support พิเศษ</strong> จากทีมพัฒนา</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✅</span>
                <span><strong>ได้เปรียบคู่แข่ง</strong> เป็นผู้ขายคนแรก</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✅</span>
                <span><strong>มีส่วนร่วม</strong> ในการพัฒนาระบบ</span>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>หมายเหตุ:</strong> ระบบ Login และ Registration ออนไลน์จะเปิดใช้งานใน Week 3-4 ของ Early Access Program
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <a 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              ← กลับหน้าหลัก
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

