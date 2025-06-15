import '../styles/globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

/*
File: /app/layout.tsx
Version: 2.0 | 2025-06-05
note:
- Minimal Root Layout: ไม่มี main/container/padding ใดๆ, ทุก section อิสระ 100%
- Provider หรือ Global CSS เท่านั้น, เหมาะสำหรับ production จริง
*/

export const metadata = {
  title: 'sss-surplus-marketplace',
  description: 'Marketplace ระบบ Surplus/สินค้าคงเหลือ | Next.js 14+',
}

import AuthProvider from '../components/auth/AuthProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}