'use client'

import UserStatusHeader from '../admin/UserStatusHeader'
import { useAuth } from '../auth/AuthProvider'

/*
File: /components/product/ProductHeader.tsx
Version: 2.0 | 2025-06-13
note: Header เฉพาะหน้าสินค้า (Product Page) | สามารถเพิ่มปุ่ม/ค้นหา/หมวดหมู่ในภายหลัง
update: เพิ่ม UserStatusHeader เพื่อแสดงสถานะผู้ใช้ที่มุมบนขวา
*/

export default function ProductHeader() {
  const { user, role, signOut } = useAuth()
  
  const userData = user ? {
    name: user.displayName || undefined,
    email: user.email || undefined,
    photoURL: user.photoURL || undefined,
    role: role || 'user'
  } : undefined
  
  const handleLogout = () => {
    signOut()
  }
  
  const handleProfileClick = () => {
    console.log('Profile clicked')
  }
  
  const handleSettingsClick = () => {
    console.log('Settings clicked')
  }
  
  return (
    <div className="w-full bg-white border-b py-3 px-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">สินค้า</h1>
      
      {/* User Status */}
      <UserStatusHeader
        user={userData}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
      />
    </div>
  )
}
