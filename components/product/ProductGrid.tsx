'use client'

import { useEffect, useState } from 'react'
import { getProducts, ProductDoc } from '../../services/productService'

/*
File: /components/product/ProductGrid.tsx
Version: 1.1 | 2025-06-02
note: ดึงสินค้า (products) จาก Firestore จริง | แสดง loading/error | ใช้กับ Product Page
*/

export default function ProductGrid() {
  const [products, setProducts] = useState<ProductDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    getProducts()
      .then(setProducts)
      .catch(() => setError('เกิดข้อผิดพลาดในการโหลดสินค้า'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="text-gray-500 py-8 text-center">กำลังโหลดสินค้า...</div>
  }
  if (error) {
    return <div className="text-red-600 py-8 text-center">{error}</div>
  }

  if (!products.length) {
    return <div className="text-gray-500 py-8 text-center">ไม่มีสินค้าพร้อมแสดง</div>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
      {products.map(product => (
        <div
          key={product.id}
          className="bg-white border rounded shadow-sm flex flex-col p-2 hover:shadow-lg transition"
        >
          <img
            src={product.mainImageUrl}
            alt={product.name}
            className="aspect-square object-cover rounded mb-2"
          />
          <div className="font-medium">{product.name}</div>
          <div className="text-blue-700 font-bold">{product.price} บาท</div>
        </div>
      ))}
    </div>
  )
}
