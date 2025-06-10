'use client'

/*
File: /components/common/AdminCardContainer.tsx
Version: 2.0 | 2025-06-07
note:
- แก้ไขปัญหา layout ไม่ลงตัว เพิ่ม width constraints และ responsive design
- เพิ่ม max-width และ min-width เพื่อควบคุมขนาด container
- ปรับปรุง spacing และ shadow สำหรับ professional look
*/

export default function AdminCardContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl min-w-[350px] mx-auto">
      {children}
    </div>
  )
}

