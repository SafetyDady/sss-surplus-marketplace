'use client'

import UserStatusHeader from '../admin/UserStatusHeader'
import { useAuth } from '../auth/AuthProvider'

/*
File: /components/user/UserHeader.tsx
Version: 2.0 | 2025-06-13
note: Header user เฉพาะ section user, โทน clean, logo, ชื่อ, โปรไฟล์, responsive
update: เพิ่ม UserStatusHeader เพื่อแสดงสถานะผู้ใช้ที่มุมบนขวา
*/

export default function UserHeader() {
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
    <header className="w-full h-16 bg-white shadow flex items-center">
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between px-6">
        {/* Logo + ชื่อเว็บ */}
        <div className="flex items-center gap-3">
          <span className="inline-block bg-[#8268fa] rounded-lg w-8 h-8"></span>
          <span className="text-[#5B5FC7] text-xl font-bold tracking-wide">sss-surplus-marketplace</span>
        </div>
        
        {/* User Status */}
        <UserStatusHeader
          user={userData}
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettingsClick}
        />
      </div>
    </header>
  )
}
