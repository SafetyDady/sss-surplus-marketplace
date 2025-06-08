'use client'
import Header from './Header'
import { usePathname } from 'next/navigation'

export default function ClientHeaderSwitcher() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  // สามารถเพิ่ม vendor ได้ เช่น const isVendor = pathname.startsWith('/vendor')
  if (isAdmin) return null
  return <Header />
}
