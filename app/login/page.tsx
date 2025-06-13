'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import UnifiedLogin from '../../components/auth/UnifiedLogin'

/*
File: /app/login/page.tsx
Version: 1.0 | 2025-06-13
note: Unified login page for all user types using social authentication
*/

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    // This will be handled by the AuthProvider context
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            SSS Surplus Marketplace
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ตลาดสินค้า Surplus คุณภาพดี
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <UnifiedLogin />
        </div>
        
        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            ← กลับไปหน้าหลัก
          </a>
        </div>
      </div>
    </div>
  )
}

