'use client'

import Image from 'next/image'

/*
File: /components/product/ProductDetailSection.tsx
Version: 1.1 | 2025-06-03
note: [Fix] เปลี่ยน <img> → <Image /> สำหรับ production (LCP/Core Web Vitals) | พร้อมใช้ | Mockup | รอ prop จริง/Firestore
*/

const product = {
  name: 'เหล็กกล่อง',
  price: 250,
  mainImageUrl: '/images/product1.jpg',
  description: 'เหล็กกล่องคุณภาพสูง สำหรับงานโครงสร้าง',
}

export default function ProductDetailSection() {
  return (
    <section className="bg-white rounded shadow p-6 my-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 w-full md:w-1/3">
          <Image
            src={product.mainImageUrl}
            alt={product.name}
            className="aspect-square object-cover rounded w-full"
            width={500}
            height={500}
            priority
          />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
          <div className="text-blue-700 font-bold text-xl">{product.price} บาท</div>
          <div className="text-gray-700">{product.description}</div>
          {/* ปุ่มซื้อ/ตะกร้า */}
          <div className="flex gap-2 mt-4">
            <button className="bg-blue-700 text-white px-5 py-2 rounded hover:bg-blue-800">ซื้อเลย</button>
            <button className="bg-gray-200 text-gray-800 px-5 py-2 rounded hover:bg-gray-300">ใส่ตะกร้า</button>
          </div>
        </div>
      </div>
    </section>
  )
}
