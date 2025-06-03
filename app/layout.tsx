
import '../styles/globals.css'
import Header from '../components/header/Header'
import AuthProvider from '../components/auth/AuthProvider'

/*
File: /app/layout.tsx
Version: 1.1 | 2025-06-02
note: ห่อทุกหน้า/Component ด้วย AuthProvider เพื่อใช้งาน useAuth() ได้ทุกที่ใน App
*/

export const metadata = {
  title: 'sss-surplus-marketplace',
  description: 'Marketplace ระบบ Surplus/สินค้าคงเหลือ | Next.js 14+',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* <link rel="icon" type="image/svg+xml" href="/favicon.svg" /> */}
      </head>
      <body className="bg-gray-100 min-h-screen">
        <AuthProvider>
          <Header />
          <main className="pt-20 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
