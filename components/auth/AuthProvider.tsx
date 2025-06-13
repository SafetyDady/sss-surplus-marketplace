'use client'

import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../../firebase/firebase'
import { User, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'

/*
File: /components/auth/AuthProvider.tsx
Version: 4.0 | 2025-06-13
note: Simplified AuthProvider - Removed complex retry logic, race condition prevention, and multiple token refresh
Changes:
- Removed extractCustomClaims with retry mechanism
- Removed verifyTokenWithBackend with concurrent prevention
- Simplified to single API call per auth state change
- Reduced from 200+ lines to ~80 lines
- Improved performance and maintainability
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

// Simple API call to verify user and get role
const verifyUserRole = async (user: User): Promise<{ role: string; permissions: string[] }> => {
  try {
    console.log('🔑 [Auth] Verifying user role for:', user.email)
    
    const idToken = await user.getIdToken()
    
    const response = await fetch('/api/auth/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('🔑 [Auth] Role verification successful:', data)
      return {
        role: data.role || 'user',
        permissions: data.permissions || []
      }
    } else {
      console.error('🔑 [Auth] Role verification failed:', response.status)
      return { role: 'user', permissions: [] }
    }
  } catch (error) {
    console.error('🔑 [Auth] Error verifying user role:', error)
    return { role: 'user', permissions: [] }
  }
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(true)

  // Monitor auth state changes - simplified version
  useEffect(() => {
    console.log('🔑 [Auth] Setting up auth state listener...')
    
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      console.log('🔑 [Auth] Auth state changed:', fbUser ? `User logged in: ${fbUser.email}` : 'User logged out')
      
      if (fbUser) {
        setLoading(true)
        setUser(fbUser)
        
        // Single API call to verify user and get role
        const { role: userRole, permissions: userPermissions } = await verifyUserRole(fbUser)
        
        setRole(userRole)
        setPermissions(userPermissions)
        
        console.log(`🔑 [Auth] User role set: ${userRole}`)
      } else {
        // Clear user state on logout
        setUser(null)
        setRole(null)
        setPermissions(null)
      }
      
      setLoading(false)
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
      
      // Note: onAuthStateChanged will handle the role verification
      return user
    } catch (error) {
      console.error('🔑 [Auth] Error signing in with Google:', error)
      setLoading(false)
      return null
    }
  }

  const signOutUser = async () => {
    setLoading(true)
    try {
      await signOut(auth)
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

