import ProductDetailSection from '../../../components/product/ProductDetailSection'

/*
File: /app/product/[id]/page.tsx
Version: 1.0 | 2025-06-02
note: หน้ารายละเอียดสินค้าแต่ละชิ้น (Dynamic route) | รับ id จาก URL | พร้อมขยายเชื่อม Firestore ในอนาคต
*/

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  // TODO: ดึงข้อมูลสินค้าโดยใช้ params.id ในอนาคต
  return (
    <div className="pt-6 min-h-screen pb-16">
      <ProductDetailSection />
    </div>
  )
}
