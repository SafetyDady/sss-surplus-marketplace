import AuthProvider from '../../components/auth/AuthProvider'
import ClientHeaderSwitcher from '../../components/header/ClientHeaderSwitcher'

/*
File: /app/(main)/layout.tsx
Version: 1.0 | 2025-06-05
note:
- Layout สำหรับ Section user/public/main
- ใส่ AuthProvider + ClientHeaderSwitcher เฉพาะกลุ่มนี้เท่านั้น (admin ไม่เกี่ยว)
*/

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ClientHeaderSwitcher />
      {children}
    </AuthProvider>
  )
}
