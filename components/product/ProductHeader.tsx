'use client'

/*
File: /components/product/ProductHeader.tsx
Version: 1.0 | 2025-06-02
note: Header เฉพาะหน้าสินค้า (Product Page) | สามารถเพิ่มปุ่ม/ค้นหา/หมวดหมู่ในภายหลัง
*/

export default function ProductHeader() {
  return (
    <div className="w-full bg-white border-b py-3 px-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">สินค้า</h1>
      {/* เพิ่มปุ่ม/Filter/ค้นหาได้ที่นี่ */}
    </div>
  )
}
