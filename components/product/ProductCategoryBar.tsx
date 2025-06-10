'use client'

/*
File: /components/product/ProductCategoryBar.tsx
Version: 1.0 | 2025-06-02
note: Bar สำหรับเลือกหมวดหมู่สินค้า | สามารถดึง categories จริงจาก Firestore ได้ในภายหลัง
*/

const categories = [
  'ทั้งหมด',
  'เหล็ก',
  'ไฟฟ้า',
  'เครื่องมือ',
  'วัสดุก่อสร้าง',
  'อื่น ๆ',
]

export default function ProductCategoryBar() {
  return (
    <div className="w-full bg-gray-50 border-b px-4 py-2 flex gap-2 overflow-x-auto">
      {categories.map(cat => (
        <button
          key={cat}
          className="px-4 py-1 bg-white border rounded text-gray-700 hover:bg-blue-50"
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
