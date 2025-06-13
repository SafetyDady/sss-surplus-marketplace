'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../auth/AuthProvider'

/*
File: /components/header/UserMenu.tsx
Version: 2.0 | 2025-06-13
note: เชื่อมต่อ Auth จริง | แสดงชื่อผู้ใช้/Sign out | ถ้ายังไม่ login ให้ลิงก์ไป Sign in | แสดง Status ของ User ที่มุมบนขวา
*/

export default function UserMenu() {
  const { user, signOut, loading, role } = useAuth()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    setOpen(false)
    router.push('/')
  }

  // Function to get role display name and color
  const getRoleDisplay = () => {
    switch(role) {
      case 'super_admin':
        return { name: 'Super Admin', color: 'bg-purple-600' }
      case 'admin':
        return { name: 'Admin', color: 'bg-blue-600' }
      case 'vendor':
        return { name: 'Vendor', color: 'bg-green-600' }
      default:
        return { name: 'User', color: 'bg-gray-600' }
    }
  }

  const roleDisplay = getRoleDisplay()

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100 border border-gray-200 bg-white"
      >
        <span className="material-icons">account_circle</span>
        <span className="hidden md:inline">
          {user ? (user.email ?? 'บัญชีผู้ใช้') : 'Sign in'}
        </span>
        {user && role && (
          <span className={`${roleDisplay.color} text-white text-xs px-2 py-0.5 rounded-full hidden md:inline-block`}>
            {roleDisplay.name}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded z-10">
          {!user ? (
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-50"
              onClick={() => router.push('/login')}
            >
              เข้าสู่ระบบ
            </button>
          ) : (
            <>
              <div className="px-4 py-2 border-b text-gray-700 truncate">{user.email}</div>
              {role && (
                <div className="px-4 py-2 border-b flex items-center">
                  <span className="text-sm text-gray-700">สถานะ:</span>
                  <span className={`${roleDisplay.color} text-white text-xs px-2 py-0.5 rounded-full ml-2`}>
                    {roleDisplay.name}
                  </span>
                </div>
              )}
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                onClick={handleSignOut}
                disabled={loading}
              >
                {loading ? 'ออกจากระบบ...' : 'ออกจากระบบ'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
