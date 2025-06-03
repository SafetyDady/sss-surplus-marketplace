import './globals.css'

export const metadata = {
  title: 'SSS Surplus Marketplace',
  description: 'ระบบ Marketplace สินค้าคงเหลือสำหรับธุรกิจ B2B/B2C',
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}
