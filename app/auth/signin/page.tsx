'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/*
File: /app/auth/signin/page.tsx
Version: 2.0 | 2025-06-13
note: Redirect to unified login page - no separate customer signin needed
*/

export default function CustomerSignin() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to unified login page
    router.replace('/login')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
          <svg className="animate-spin w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">กำลังเปลี่ยนเส้นทาง...</h3>
        <p className="text-gray-600">กำลังนำคุณไปยังหน้าเข้าสู่ระบบแบบรวม</p>
      </div>
    </div>
  )
}

