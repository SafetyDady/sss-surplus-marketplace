'use client'

import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../../firebase/firebase'
import { User, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'

/*
File: /components/auth/AuthProvider.tsx
Version: 2.1 | 2025-06-13
note: Simplified AuthProvider with better error handling and removed dependency on userService
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

  // Extract custom claims from user's ID token with retry mechanism
  const extractCustomClaims = async (user: User, retryCount = 0, maxRetries = 3) => {
    try {
      // Force token refresh to ensure we get the latest claims
      await user.getIdToken(true)
      
      const idTokenResult = await user.getIdTokenResult()
      const customClaims = idTokenResult.claims
      
      console.log('Custom claims extracted:', {
        role: customClaims.role,
        permissions: customClaims.permissions
      })
      
      // If role is missing but we haven't exceeded max retries, try again
      if (!customClaims.role && retryCount < maxRetries) {
        console.log(`Role not found in claims, retrying... (${retryCount + 1}/${maxRetries})`)
        // Wait a bit before retrying to allow Firebase to propagate claims
        await new Promise(resolve => setTimeout(resolve, 1000))
        return extractCustomClaims(user, retryCount + 1, maxRetries)
      }
      
      setRole(customClaims.role || 'user')
      setPermissions(customClaims.permissions || [])
      
      return { role: customClaims.role, permissions: customClaims.permissions }
    } catch (error) {
      console.error('Error extracting custom claims:', error)
      setRole('user')
      setPermissions([])
      return { role: 'user', permissions: [] }
    }
  }

  // Monitor auth state changes
  useEffect(() => {
    console.log('Setting up auth state listener...')
    
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      console.log('Auth state changed:', fbUser ? 'User logged in' : 'User logged out')
      setUser(fbUser)
      
      if (fbUser) {
        setLoading(true)
        
        try {
          // Send ID token to backend for role assignment
          const idToken = await fbUser.getIdToken()
          console.log('Sending ID token to backend for verification...')
          
          const response = await fetch('/api/auth/verify-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
          })
          
          if (response.ok) {
            console.log('Token verified with backend successfully')
            const responseData = await response.json()
            console.log('Backend response:', responseData)
            
            // Wait a moment to allow Firebase to update the token
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Extract custom claims with retry mechanism
            const claimsResult = await extractCustomClaims(fbUser)
            console.log('Final claims result:', claimsResult)
          } else {
            console.error('Failed to verify token with backend')
            const errorData = await response.json()
            console.error('Backend error:', errorData)
          }
        } catch (error) {
          console.error('Error verifying token with backend:', error)
        }
        
        setLoading(false)
      } else {
        setRole(null)
        setPermissions(null)
        setLoading(false)
      }
    })
    
    return () => {
      console.log('Cleaning up auth state listener')
      unsubscribe()
    }
  }, [])

  const signInWithGoogle = async () => {
    console.log('signInWithGoogle called from AuthProvider')
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      provider.addScope('email')
      provider.addScope('profile')
      
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      console.log('Google sign in successful:', user.email)
      setUser(user)
      return user
    } catch (error) {
      console.error('Error signing in with Google:', error)
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
      console.log('User signed out successfully')
    } catch (error) {
      console.error('Error signing out:', error)
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

