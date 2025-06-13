'use client'

import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../../firebase/firebase'
import { User, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { getUserProfileByUid, UserProfile } from '../../services/userService'

/*
File: /components/auth/AuthProvider.tsx
Version: 2.0 | 2025-06-13
note: Updated to use Firebase Authentication with social login and custom claims for role management
*/

type AuthContextType = {
  user: User | null
  loading: boolean
  profile: UserProfile | null
  role: string | null
  permissions: string[] | null
  signInWithGoogle: () => Promise<User | null>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  profile: null,
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
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(true)

  // Extract custom claims from user's ID token
  const extractCustomClaims = async (user: User) => {
    try {
      const idTokenResult = await user.getIdTokenResult()
      const customClaims = idTokenResult.claims
      
      setRole(customClaims.role || 'user')
      setPermissions(customClaims.permissions || [])
      
      console.log('Custom claims extracted:', {
        role: customClaims.role,
        permissions: customClaims.permissions
      })
    } catch (error) {
      console.error('Error extracting custom claims:', error)
      setRole('user')
      setPermissions([])
    }
  }

  // Sync User Profile and custom claims when user changes
  useEffect(() => {
    if (!user) {
      setProfile(null)
      setRole(null)
      setPermissions(null)
      setLoading(false)
      return
    }

    setLoading(true)
    
    // Extract custom claims and get user profile in parallel
    Promise.all([
      extractCustomClaims(user),
      getUserProfileByUid(user.uid)
    ])
    .then(([_, profile]) => {
      setProfile(profile)
    })
    .catch(error => {
      console.error('Error loading user data:', error)
    })
    .finally(() => {
      setLoading(false)
    })
  }, [user])

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser)
      
      if (fbUser) {
        // Send ID token to backend for role assignment
        try {
          const idToken = await fbUser.getIdToken()
          const response = await fetch('/api/auth/verify-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
          })
          
          if (response.ok) {
            // Force token refresh to get updated custom claims
            await fbUser.getIdToken(true)
          }
        } catch (error) {
          console.error('Error verifying token with backend:', error)
        }
      }
    })
    
    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user
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
      setProfile(null)
      setRole(null)
      setPermissions(null)
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
      profile, 
      role, 
      permissions, 
      signInWithGoogle, 
      signOut: signOutUser 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

