"use client";
import ProductHeader from '../../components/product/ProductHeader'
import ProductCategoryBar from '../../components/product/ProductCategoryBar'
import ProductGrid from '../../components/product/ProductGrid'

/*
File: /app/product/page.tsx
Version: 1.0 | 2025-06-02
note: หน้าแสดงสินค้า (Product Page) | ใช้ Header, CategoryBar, Grid | พร้อมขยายเชื่อม Firestore
*/

export default function ProductPage() {
  return (
    <div className="pt-2 min-h-screen pb-16">
      <ProductHeader />
      <ProductCategoryBar />
      <div className="mt-4 w-full px-4 lg:px-0 mx-auto lg:w-[70%]">
        <h2 className="text-xl font-semibold mb-4">รายการสินค้า</h2>
        <ProductGrid />
      </div>
    </div>
  )
}
