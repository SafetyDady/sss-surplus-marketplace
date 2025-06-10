import ProductDetailSection from '../../../components/product/ProductDetailSection'

/*
File: /app/product/[id]/page.tsx
Version: 1.1 | 2025-06-03
note: [Fix] ลบ params ที่ไม่ได้ใช้ (no-unused-vars) | หน้ารายละเอียดสินค้า (Dynamic) | รอเชื่อม Firestore ในอนาคต
*/

export default function ProductDetailPage() {
  // TODO: ดึงข้อมูลสินค้าโดยใช้ params.id ในอนาคต
  return (
    <div className="pt-6 min-h-screen pb-16">
      <ProductDetailSection />
    </div>
  )
}
