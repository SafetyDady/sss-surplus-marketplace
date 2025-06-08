'use client'

import UserStatusHeader from './UserStatusHeader'

/*
File: /components/admin/AdminHeader.tsx
Version: 5.0 | 2025-06-07
note: 
- ปรับปรุง AdminHeader ให้รวม UserStatusHeader
- เพิ่ม responsive design และ modern styling
- รองรับ user authentication และ role management
*/

export default function AdminHeader() {
  // Mock user data - ในการใช้งานจริงจะดึงจาก Firebase Auth
  const mockUser = {
    name: 'Admin User',
    email: 'admin@sss-supply.com',
    photoURL: '', // จะใช้ Google Profile Picture
    role: 'admin' as const
  }

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logout clicked')
  }

  const handleProfileClick = () => {
    // Handle profile click
    console.log('Profile clicked')
  }

  const handleSettingsClick = () => {
    // Handle settings click
    console.log('Settings clicked')
  }

  return (
    <header className="h-16 bg-gradient-to-r from-[#5B5FC7] via-[#432d6d] to-[#20253A] shadow-lg">
      <div className="flex items-center justify-between px-6 h-full">
        {/* Logo + System Name */}
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-lg w-9 h-9 flex items-center justify-center">
            <span className="text-[#5B5FC7] font-bold text-lg">S</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-white text-xl font-bold tracking-wide">sss SUPPLY</h1>
            <p className="text-white/70 text-xs">Admin Dashboard</p>
          </div>
        </div>

        {/* Center Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button className="bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-2 font-medium transition flex items-center gap-2">
            <span className="text-lg">+</span>
            เพิ่มข้อมูล
          </button>
        </div>

        {/* User Status */}
        <UserStatusHeader
          user={mockUser}
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettingsClick}
        />
      </div>
    </header>
  )
}

