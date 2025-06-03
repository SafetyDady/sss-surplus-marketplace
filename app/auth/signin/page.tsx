'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../components/auth/AuthProvider'
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth'

/*
File: /app/auth/signin/page.tsx
Version: 1.4 | 2025-06-03
note: [Fix] ลบ err ที่ไม่ได้ใช้ (no-unused-vars) | เปลี่ยน <img> เป็น <Image /> | Social Login Production-ready
*/

export default function SignInPage() {
  const router = useRouter()
  const { signIn, user, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [socialLoading, setSocialLoading] = useState(false)

  // ฟังก์ชัน login ด้วย Google
  const handleGoogleSignIn = async () => {
    setSocialLoading(true)
    setError(null)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(getAuth(), provider)
      router.push('/')
    } catch {
      setError('เข้าสู่ระบบด้วย Google ไม่สำเร็จ')
    } finally {
      setSocialLoading(false)
    }
  }

  // ฟังก์ชัน login ด้วย Facebook
  const handleFacebookSignIn = async () => {
    setSocialLoading(true)
    setError(null)
    try {
      const provider = new FacebookAuthProvider()
      await signInWithPopup(getAuth(), provider)
      router.push('/')
    } catch {
      setError('เข้าสู่ระบบด้วย Facebook ไม่สำเร็จ')
    } finally {
      setSocialLoading(false)
    }
  }

  // Email/Password login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await signIn(email, password)
      router.push('/')
    } catch {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
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
        <h2 className="text-xl font-bold mb-4 text-blue-700">เข้าสู่ระบบ</h2>
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
            autoComplete="current-password"
          />
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
            disabled={loading}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
        <div className="flex flex-col gap-2 my-4">
          <button
            type="button"
            className="w-full bg-white border border-gray-300 text-gray-800 py-2 rounded hover:bg-gray-100 flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
            disabled={socialLoading}
          >
            <Image
              src="/images/google.svg"
              alt="Google"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            {socialLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบด้วย Google'}
          </button>
          <button
            type="button"
            className="w-full bg-white border border-gray-300 text-gray-800 py-2 rounded hover:bg-gray-100 flex items-center justify-center gap-2"
            onClick={handleFacebookSignIn}
            disabled={socialLoading}
          >
            <Image
              src="/images/facebook.svg"
              alt="Facebook"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            {socialLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบด้วย Facebook'}
          </button>
        </div>
        {error && <div className="text-red-600 mt-3">{error}</div>}
        <div className="text-sm text-gray-500 mt-3">
          ยังไม่มีบัญชี? <a href="/auth/signup" className="text-blue-600 underline">สมัครสมาชิก</a>
        </div>
      </div>
    </div>
  )
}
