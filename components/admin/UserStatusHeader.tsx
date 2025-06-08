'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, User, Settings, LogOut, Shield, Store } from 'lucide-react'

/*
File: /components/admin/UserStatusHeader.tsx
Version: 1.0 | 2025-06-07
note: 
- User Status Header Component สำหรับแสดงสถานะผู้ใช้
- รองรับ Google Profile Picture และ Role indicators
- มี dropdown menu สำหรับ user actions
*/

interface UserStatusHeaderProps {
  user?: {
    name?: string
    email?: string
    photoURL?: string
    role?: 'admin' | 'vendor' | 'user'
  }
  onLogout?: () => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
}

const roleConfig = {
  admin: {
    label: 'Admin',
    color: 'bg-red-500',
    icon: <Shield size={14} />,
    textColor: 'text-red-600'
  },
  vendor: {
    label: 'Vendor',
    color: 'bg-blue-500',
    icon: <Store size={14} />,
    textColor: 'text-blue-600'
  },
  user: {
    label: 'User',
    color: 'bg-green-500',
    icon: <User size={14} />,
    textColor: 'text-green-600'
  }
}

export default function UserStatusHeader({ 
  user, 
  onLogout, 
  onProfileClick, 
  onSettingsClick 
}: UserStatusHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
          เข้าสู่ระบบ
        </button>
      </div>
    )
  }

  const roleInfo = roleConfig[user.role || 'user']
  const displayName = user.name || user.email?.split('@')[0] || 'ผู้ใช้'

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 transition-all"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {/* User Avatar */}
        <div className="relative">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <User size={16} className="text-gray-600" />
            </div>
          )}
          
          {/* Role Indicator Ring */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${roleInfo.color} rounded-full border-2 border-white flex items-center justify-center`}>
            <span className="text-white text-xs">
              {roleInfo.icon}
            </span>
          </div>
          
          {/* Online Status Dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
        </div>

        {/* User Info */}
        <div className="hidden sm:block text-left">
          <div className="text-white font-medium text-sm">{displayName}</div>
          <div className={`text-xs ${roleInfo.textColor} bg-white/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1`}>
            {roleInfo.icon}
            {roleInfo.label}
          </div>
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown 
          size={16} 
          className={`text-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User size={20} className="text-gray-600" />
                </div>
              )}
              <div>
                <div className="font-medium text-gray-900">{displayName}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
                <div className={`text-xs ${roleInfo.textColor} inline-flex items-center gap-1 mt-1`}>
                  {roleInfo.icon}
                  {roleInfo.label}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3"
              onClick={() => {
                onProfileClick?.()
                setIsDropdownOpen(false)
              }}
            >
              <User size={16} />
              โปรไฟล์
            </button>
            
            <button
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3"
              onClick={() => {
                onSettingsClick?.()
                setIsDropdownOpen(false)
              }}
            >
              <Settings size={16} />
              ตั้งค่า
            </button>

            {/* Role Switch (if applicable) */}
            {user.role === 'admin' && (
              <div className="border-t border-gray-100 mt-1 pt-1">
                <div className="px-4 py-2 text-xs text-gray-500 font-medium">สลับบทบาท</div>
                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                  <Store size={16} />
                  ดูในฐานะ Vendor
                </button>
                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                  <User size={16} />
                  ดูในฐานะ User
                </button>
              </div>
            )}

            <div className="border-t border-gray-100 mt-1 pt-1">
              <button
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-3"
                onClick={() => {
                  onLogout?.()
                  setIsDropdownOpen(false)
                }}
              >
                <LogOut size={16} />
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

