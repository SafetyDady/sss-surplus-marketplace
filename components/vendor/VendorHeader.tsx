'use client'

import UserStatusHeader from '../admin/UserStatusHeader'

/*
File: /components/vendor/VendorHeader.tsx
Version: 1.0 | 2025-06-07
note: 
- Header สำหรับ Vendor Dashboard
- ใช้ UserStatusHeader เดียวกันกับ Admin
- ปรับ branding และ colors สำหรับ Vendor
*/

export default function VendorHeader() {
  // Mock vendor user data - ในการใช้งานจริงจะดึงจาก Firebase Auth
  const mockVendorUser = {
    name: 'Vendor User',
    email: 'vendor@sss-supply.com',
    photoURL: '', // จะใช้ Google Profile Picture
    role: 'vendor' as const
  }

  const handleLogout = () => {
    // Handle logout logic
    console.log('Vendor logout clicked')
  }

  const handleProfileClick = () => {
    // Handle profile click
    console.log('Vendor profile clicked')
  }

  const handleSettingsClick = () => {
    // Handle settings click
    console.log('Vendor settings clicked')
  }

  return (
    <header className="h-16 bg-gradient-to-r from-[#3B82F6] via-[#1E40AF] to-[#1E3A8A] shadow-lg">
      <div className="flex items-center justify-between px-6 h-full">
        {/* Logo + System Name */}
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-lg w-9 h-9 flex items-center justify-center">
            <span className="text-[#3B82F6] font-bold text-lg">V</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-white text-xl font-bold tracking-wide">sss SUPPLY</h1>
            <p className="text-white/70 text-xs">Vendor Dashboard</p>
          </div>
        </div>

        {/* Center Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button className="bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-2 font-medium transition flex items-center gap-2">
            <span className="text-lg">+</span>
            เพิ่มสินค้า
          </button>
        </div>

        {/* User Status */}
        <UserStatusHeader
          user={mockVendorUser}
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettingsClick}
        />
      </div>
    </header>
  )
}

