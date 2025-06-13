'use client'

import { ReactNode, createContext, useContext, useEffect, useState, useRef } from 'react'
import { auth } from '../../firebase/firebase'
import { User, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'

/*
File: /components/auth/AuthProvider.tsx
Version: 3.1 | 2025-06-13
note: Enhanced AuthProvider with robust token handling, improved claims extraction, better error recovery, and Super Admin support
*/

type AuthContextType = {
  user: User | null
  loading: boolean
  role: string | null
  permissions: string[] | null
  signInWithGoogle: () => Promise<User | null>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  role: null,
  permissions: null,
  signInWithGoogle: async () => null,
  signOut: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Use refs to track token verification attempts and prevent duplicate calls
  const verifyingToken = useRef(false)
  const verificationAttempts = useRef(0)
  const maxVerificationAttempts = 3

  // Extract custom claims from user's ID token with enhanced retry mechanism
  const extractCustomClaims = async (user: User, retryCount = 0, maxRetries = 5) => {
    try {
      console.log(`🔑 [Auth] Extracting custom claims (attempt ${retryCount + 1}/${maxRetries})...`)
      
      // Force token refresh to ensure we get the latest claims
      await user.getIdToken(true)
      
      const idTokenResult = await user.getIdTokenResult()
      const customClaims = idTokenResult.claims
      
      console.log('🔑 [Auth] Custom claims extracted:', {
        role: customClaims.role || 'not set',
        permissions: customClaims.permissions || 'not set',
        updatedAt: customClaims.updatedAt || 'not set'
      })
      
      // If role is missing but we haven't exceeded max retries, try again
      if (!customClaims.role && retryCount < maxRetries) {
        console.log(`🔑 [Auth] Role not found in claims, retrying... (${retryCount + 1}/${maxRetries})`)
        // Wait longer between retries to allow Firebase to propagate claims
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000) // Exponential backoff with max 10s
        console.log(`🔑 [Auth] Waiting ${delay}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        return extractCustomClaims(user, retryCount + 1, maxRetries)
      }
      
      // Set role and permissions with fallbacks
      const extractedRole = customClaims.role || 'user'
      const extractedPermissions = customClaims.permissions || []
      
      setRole(extractedRole)
      setPermissions(extractedPermissions)
      
      console.log(`🔑 [Auth] Final role set: ${extractedRole}`)
      
      return { role: extractedRole, permissions: extractedPermissions }
    } catch (error) {
      console.error('🔑 [Auth] Error extracting custom claims:', error)
      
      // If we haven't exceeded max retries, try again
      if (retryCount < maxRetries) {
        console.log(`🔑 [Auth] Retrying after error... (${retryCount + 1}/${maxRetries})`)
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000)
        await new Promise(resolve => setTimeout(resolve, delay))
        return extractCustomClaims(user, retryCount + 1, maxRetries)
      }
      
      // Set default role and permissions as fallback
      console.log('🔑 [Auth] Using fallback role: user')
      setRole('user')
      setPermissions([])
      return { role: 'user', permissions: [] }
    }
  }

  // Verify token with backend and update claims
  const verifyTokenWithBackend = async (user: User): Promise<boolean> => {
    // Prevent concurrent verification attempts
    if (verifyingToken.current) {
      console.log('🔑 [Auth] Token verification already in progress, skipping...')
      return false
    }
    
    verifyingToken.current = true
    verificationAttempts.current += 1
    
    try {
      console.log('🔑 [Auth] Sending ID token to backend for verification...')
      const idToken = await user.getIdToken()
      
      const response = await fetch('/api/auth/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      })
      
      if (response.ok) {
        const responseData = await response.json()
        console.log('🔑 [Auth] Backend verification successful:', responseData)
        
        // Wait to allow Firebase to update the token
        const delay = 2000 // 2 seconds
        console.log(`🔑 [Auth] Waiting ${delay}ms for token propagation...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        
        verifyingToken.current = false
        return true
      } else {
        const errorData = await response.json()
        console.error('🔑 [Auth] Backend verification failed:', errorData)
        
        verifyingToken.current = false
        return false
      }
    } catch (error) {
      console.error('🔑 [Auth] Error during token verification:', error)
      verifyingToken.current = false
      return false
    }
  }

  // Monitor auth state changes
  useEffect(() => {
    console.log('🔑 [Auth] Setting up auth state listener...')
    
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      console.log('🔑 [Auth] Auth state changed:', fbUser ? `User logged in: ${fbUser.email}` : 'User logged out')
      setUser(fbUser)
      
      if (fbUser) {
        setLoading(true)
        
        try {
          // Reset verification attempts on new login
          verificationAttempts.current = 0
          
          // Verify token with backend
          const verificationSuccess = await verifyTokenWithBackend(fbUser)
          
          if (verificationSuccess) {
            // Extract custom claims with retry mechanism
            const claimsResult = await extractCustomClaims(fbUser)
            console.log('🔑 [Auth] Final claims result:', claimsResult)
          } else if (verificationAttempts.current < maxVerificationAttempts) {
            // Retry verification if failed
            console.log(`🔑 [Auth] Verification failed, retrying... (${verificationAttempts.current}/${maxVerificationAttempts})`)
            const delay = 2000
            await new Promise(resolve => setTimeout(resolve, delay))
            await verifyTokenWithBackend(fbUser)
            await extractCustomClaims(fbUser)
          } else {
            console.error('🔑 [Auth] Max verification attempts reached, using fallback role')
            setRole('user')
            setPermissions([])
          }
        } catch (error) {
          console.error('🔑 [Auth] Critical error in auth flow:', error)
          // Set fallback role
          setRole('user')
          setPermissions([])
        }
        
        setLoading(false)
      } else {
        // Clear user state on logout
        setRole(null)
        setPermissions(null)
        setLoading(false)
      }
    })
    
    return () => {
      console.log('🔑 [Auth] Cleaning up auth state listener')
      unsubscribe()
    }
  }, [])

  const signInWithGoogle = async () => {
    console.log('🔑 [Auth] signInWithGoogle called')
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      provider.addScope('email')
      provider.addScope('profile')
      
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      console.log('🔑 [Auth] Google sign in successful:', user.email)
      setUser(user)
      return user
    } catch (error) {
      console.error('🔑 [Auth] Error signing in with Google:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  const signOutUser = async () => {
    setLoading(true)
    try {
      await signOut(auth)
      setUser(null)
      setRole(null)
      setPermissions(null)
      console.log('🔑 [Auth] User signed out successfully')
    } catch (error) {
      console.error('🔑 [Auth] Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      role, 
      permissions, 
      signInWithGoogle, 
      signOut: signOutUser 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

