'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../../firebase/firebase'
import { useRouter } from 'next/navigation'

/*
File: /components/auth/UnifiedLogin.tsx
Version: 3.0 | 2025-06-13
note: Enhanced redirect logic with debugging and state tracking to prevent redirect loops
*/

export default function UnifiedLogin() {
  const { signInWithGoogle, user, role, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>('')
  const router = useRouter()
  
  // Use refs to track state changes and prevent redirect loops
  const hasRedirected = useRef(false)
  const redirectAttempts = useRef(0)
  const lastRole = useRef<string | null>(null)
  
  // Add debug information
  const addDebugInfo = (info: string) => {
    console.log(`[DEBUG] ${info}`)
    setDebugInfo(prev => `${prev}\n${new Date().toISOString()}: ${info}`)
  }
  
  // Manual role check function for debugging
  const checkUserRole = async () => {
    if (!user) {
      addDebugInfo('No user found for role check')
      return
    }
    
    try {
      addDebugInfo('Manually checking user role...')
      
      // Force token refresh
      await user.getIdToken(true)
      
      // Get token result with claims
      const idTokenResult = await user.getIdTokenResult()
      addDebugInfo(`Token claims: ${JSON.stringify(idTokenResult.claims)}`)
      
      // Check if role exists in claims
      if (idTokenResult.claims.role) {
        addDebugInfo(`Found role in claims: ${idTokenResult.claims.role}`)
      } else {
        addDebugInfo('No role found in claims, trying API call...')
        
        // Try API call to verify token
        try {
          const idToken = await user.getIdToken()
          addDebugInfo('Calling /api/auth/verify-token API...')
          
          const response = await fetch('/api/auth/verify-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
          })
          
          if (response.ok) {
            const data = await response.json()
            addDebugInfo(`API response: ${JSON.stringify(data)}`)
            
            // Wait for token to update
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            // Check token again
            const newTokenResult = await user.getIdTokenResult(true)
            addDebugInfo(`New token claims: ${JSON.stringify(newTokenResult.claims)}`)
          } else {
            const errorData = await response.json()
            addDebugInfo(`API error: ${JSON.stringify(errorData)}`)
          }
        } catch (apiError) {
          addDebugInfo(`API call error: ${apiError.message}`)
        }
      }
    } catch (error) {
      addDebugInfo(`Role check error: ${error.message}`)
    }
  }

  // Handle redirect based on user role after successful authentication
  useEffect(() => {
    // Reset redirect flag when user changes
    if (!user) {
      hasRedirected.current = false
      redirectAttempts.current = 0
      lastRole.current = null
      return
    }
    
    // Add debug info about user state
    addDebugInfo(`User state: ${user.email}, Loading: ${authLoading}, Role: ${role || 'undefined'}`)
    
    // Track role changes
    if (role !== lastRole.current) {
      addDebugInfo(`Role changed from ${lastRole.current} to ${role}`)
      lastRole.current = role
      // Reset redirect attempts when role changes
      redirectAttempts.current = 0
      hasRedirected.current = false
    }
    
    // Only proceed if we have a user, role, and auth is not loading
    if (user && role && !authLoading) {
      redirectAttempts.current += 1
      addDebugInfo(`Redirect attempt ${redirectAttempts.current} with role: ${role}`)
      
      // Prevent redirect loops by limiting attempts
      if (redirectAttempts.current > 3) {
        addDebugInfo(`Too many redirect attempts (${redirectAttempts.current}), stopping`)
        return
      }
      
      // Prevent multiple redirects for the same session
      if (hasRedirected.current) {
        addDebugInfo('Already redirected for this session, skipping')
        return
      }
      
      addDebugInfo(`User authenticated with role: ${role}`)
      
      // Set a small delay to ensure state is stable
      setTimeout(() => {
        // Double-check that conditions are still valid
        if (!user || !role || authLoading) {
          addDebugInfo('Conditions changed during timeout, aborting redirect')
          return
        }
        
        // Redirect based on role
        hasRedirected.current = true
        
        if (role === 'super_admin') {
          addDebugInfo('Redirecting to Super Admin Dashboard')
          window.location.href = '/admin/super/dashboard'
        } else if (role === 'admin') {
          addDebugInfo('Redirecting to Admin Dashboard')
          window.location.href = '/admin/dashboard'
        } else if (role === 'vendor') {
          addDebugInfo('Redirecting to Vendor Dashboard')
          window.location.href = '/vendor/dashboard'
        } else {
          addDebugInfo('Redirecting to Home')
          window.location.href = '/'
        }
      }, 1000) // Increased delay for better stability
    } else if (user && !role && !authLoading) {
      // If we have a user but no role, and we're not loading, try to check role manually
      addDebugInfo('User logged in but no role found, will check manually in 3 seconds...')
      setTimeout(() => {
        if (!role) { // Double check role is still missing
          checkUserRole()
        }
      }, 3000)
    }
  }, [user, role, authLoading, router])

  const handleGoogleLogin = async () => {
    addDebugInfo('Google login button clicked')
    setLoading(true)
    setError(null)
    
    try {
      addDebugInfo('Attempting Google login...')
      
      // Direct Firebase Auth approach as fallback
      const provider = new GoogleAuthProvider()
      provider.addScope('email')
      provider.addScope('profile')
      
      // Reset redirect tracking on new login attempt
      hasRedirected.current = false
      redirectAttempts.current = 0
      lastRole.current = null
      
      const result = await signInWithPopup(auth, provider)
      addDebugInfo(`Google login successful: ${result.user.email}`)
      
      // Redirect will be handled by the useEffect hook based on role
      
    } catch (error: any) {
      console.error('Google login error:', error)
      addDebugInfo(`Login error: ${error.code} - ${error.message}`)
      
      if (error.code === 'auth/popup-closed-by-user') {
        setError('การเข้าสู่ระบบถูกยกเลิก')
      } else if (error.code === 'auth/popup-blocked') {
        setError('Popup ถูกบล็อก กรุณาอนุญาต Popup สำหรับเว็บไซต์นี้')
      } else if (error.code === 'auth/network-request-failed') {
        setError('เกิดข้อผิดพลาดเครือข่าย กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต')
      } else if (error.code === 'auth/unauthorized-domain') {
        setError('โดเมนนี้ไม่ได้รับอนุญาตให้ใช้งาน Firebase Authentication กรุณาเพิ่มโดเมนนี้ใน Firebase Console')
        addDebugInfo(`Current domain: ${window.location.hostname}`)
      } else {
        setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google: ' + (error.message || 'ไม่ทราบสาเหตุ'))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFacebookLogin = async () => {
    console.log('Facebook login button clicked')
    setLoading(true)
    setError(null)
    
    try {
      const provider = new FacebookAuthProvider()
      provider.addScope('email')
      
      const result = await signInWithPopup(auth, provider)
      console.log('Facebook login successful:', result.user)
      
      // Redirect will be handled by the useEffect hook based on role
      
    } catch (error: any) {
      console.error('Facebook login error:', error)
      
      if (error.code === 'auth/popup-closed-by-user') {
        setError('การเข้าสู่ระบบถูกยกเลิก')
      } else if (error.code === 'auth/popup-blocked') {
        setError('Popup ถูกบล็อก กรุณาอนุญาต Popup สำหรับเว็บไซต์นี้')
      } else {
        setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Facebook: ' + (error.message || 'ไม่ทราบสาเหตุ'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">เข้าสู่ระบบ</h2>
        <p className="text-gray-600">เลือกวิธีการเข้าสู่ระบบที่คุณต้องการ</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {debugInfo && (
        <div className="mb-4 p-3 bg-gray-100 border border-gray-300 text-gray-700 rounded text-xs overflow-auto max-h-40">
          <pre>{debugInfo}</pre>
        </div>
      )}

      <div className="space-y-3">
        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบด้วย Google'}
        </button>

        {/* Facebook Login */}
        <button
          onClick={handleFacebookLogin}
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบด้วย Facebook'}
        </button>

        {/* Line Login - Placeholder for future implementation */}
        <button
          disabled={true}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-green-500 text-sm font-medium text-white opacity-50 cursor-not-allowed"
        >
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
          </svg>
          เข้าสู่ระบบด้วย Line (เร็วๆ นี้)
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          การเข้าสู่ระบบหมายความว่าคุณยอมรับ
          <a href="/terms" className="text-blue-600 hover:text-blue-500 ml-1">
            ข้อกำหนดการใช้งาน
          </a>
          และ
          <a href="/privacy" className="text-blue-600 hover:text-blue-500 ml-1">
            นโยบายความเป็นส่วนตัว
          </a>
        </p>
      </div>
    </div>
  )
}

