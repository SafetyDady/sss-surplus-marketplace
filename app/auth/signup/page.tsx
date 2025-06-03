'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../components/auth/AuthProvider'

/*
File: /app/auth/signup/page.tsx
Version: 1.2 | 2025-06-03
note: [Fix] ลบ err ที่ไม่ได้ใช้ (no-unused-vars) | Sign Up เชื่อม Auth จริง | Production-ready
*/

export default function SignUpPage() {
  const router = useRouter()
  const { signUp, user, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await signUp(email, password)
      router.push('/')
    } catch {
      setError('สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่')
    }
  }

  // ถ้า login แล้ว redirect
  if (user) {
    router.replace('/')
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-10">
      <div className="bg-white shadow rounded px-8 py-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-blue-700">สมัครสมาชิก</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="อีเมล"
            className="border p-2 rounded w-full mb-3"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            className="border p-2 rounded w-full mb-4"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
            disabled={loading}
          >
            {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
          </button>
        </form>
        {error && <div className="text-red-600 mt-3">{error}</div>}
        <div className="text-sm text-gray-500 mt-3">
          มีบัญชีอยู่แล้ว? <a href="/auth/signin" className="text-blue-600 underline">เข้าสู่ระบบ</a>
        </div>
      </div>
    </div>
  )
}
