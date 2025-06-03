/*
File: /app/page.tsx
Version: 1.0 | 2025-06-02
note: หน้า Home (Landing Page) สำหรับ Next.js 14+ | ยังไม่แสดงสินค้า/feature จริง | พร้อมขยาย section เพิ่มเติม
*/

export default function HomePage() {
  return (
    <section className="w-full bg-white rounded shadow p-6 my-4 min-h-[400px] flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">
        sss-surplus-marketplace
      </h1>
      <p className="text-gray-700 text-center mb-8">
        ระบบ Marketplace สินค้าคงเหลือสำหรับธุรกิจ B2B/B2C<br />
        (โครงสร้างใหม่ Next.js 14+ | TypeScript | Tailwind | Firebase)
      </p>
      {/* เพิ่ม Section หรือ Feature อื่น ๆ ได้ที่นี่ */}
    </section>
  )
}
