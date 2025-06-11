'use client'

import { useEffect, useState } from 'react'
import UserStatusHeader from './UserStatusHeader'

/*
File: /components/admin/AdminHeader.tsx
Version: 5.2 | 2025-06-11
note: 
- ปรับปรุง AdminHeader ให้รวม UserStatusHeader
- เพิ่ม responsive design และ modern styling
- รองรับ user authentication และ role management
- ดึงข้อมูล user จาก JWT token แทน mock data
- แก้ไขให้แสดงข้อมูล System Admin ที่ถูกต้อง
*/

export default function AdminHeader() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // ดึงข้อมูล user จาก JWT token
    const token = localStorage.getItem('admin_token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        
        // ตรวจสอบว่าเป็น super_admin หรือไม่
        if (payload.role === 'super_admin') {
          // กรณีเป็น super_admin ให้แสดงเป็น System Admin
          setUser({
            name: 'System Administrator',
            email: 'sanchai5651@gmail.com',
            photoURL: '',
            role: 'System Admin'
          })
        } else {
          // กรณีเป็น role อื่นๆ
          setUser({
            name: payload.name || 'User',
            email: payload.email || '',
            photoURL: payload.photoURL || '',
            role: payload.role || 'user'
          })
        }
      } catch (error) {
        console.error('Error decoding token:', error)
        // Fallback ให้เป็น System Admin เสมอ (สำหรับ super admin page)
        setUser({
          name: 'System Administrator',
          email: 'sanchai5651@gmail.com',
          photoURL: '',
          role: 'System Admin'
        })
      }
    }
  }, [])

  const handleLogout = () => {
    // Handle logout logic
    localStorage.removeItem('admin_token')
    window.location.href = '/admin/login'
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
        {user && (
          <UserStatusHeader
            user={user}
            onLogout={handleLogout}
            onProfileClick={handleProfileClick}
            onSettingsClick={handleSettingsClick}
          />
        )}
      </div>
    </header>
  )
}

