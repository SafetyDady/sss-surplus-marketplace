'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../auth/AuthProvider'

/*
File: /components/header/UserMenu.tsx
Version: 1.1 | 2025-06-02
note: เชื่อมต่อ Auth จริง | แสดงชื่อผู้ใช้/Sign out | ถ้ายังไม่ login ให้ลิงก์ไป Sign in
*/

export default function UserMenu() {
  const { user, signOut, loading } = useAuth()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    setOpen(false)
    router.push('/')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100 border border-gray-200"
      >
        <span className="material-icons">account_circle</span>
        <span className="hidden md:inline">
          {user ? (user.email ?? 'บัญชีผู้ใช้') : 'Sign in'}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded z-10">
          {!user ? (
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-50"
              onClick={() => router.push('/auth/signin')}
            >
              เข้าสู่ระบบ
            </button>
          ) : (
            <>
              <div className="px-4 py-2 border-b text-gray-700 truncate">{user.email}</div>
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
