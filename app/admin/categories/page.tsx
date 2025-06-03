"use client";
import CategoryAdmin from '../../../components/admin/CategoryAdmin'

/*
File: /app/admin/categories/page.tsx
Version: 1.0 | 2025-06-03
note: หน้า Admin จัดการหมวดหมู่ (Category) | ต้องเป็น admin เท่านั้นที่เข้าถึง | รองรับการเชื่อม Firestore จริง
*/

export default function CategoryAdminPage() {
  return (
    <div className="py-10">
      <CategoryAdmin />
    </div>
  )
}
