'use client'

import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../../firebase/firebase'
import { User, onAuthStateChanged } from 'firebase/auth'
import { signInWithEmail, signUpWithEmail, signOutUser } from '../../services/authService'
import { createUserProfile, getUserProfileByUid, UserProfile } from '../../services/userService'

/*
File: /components/auth/AuthProvider.tsx
Version: 1.2 | 2025-06-02
note: Sync ข้อมูล User Profile จาก Firestore ทุกครั้งที่ Login/SignUp | พร้อมเก็บ role/properties ใน context
*/

type AuthContextType = {
  user: User | null
  loading: boolean
  profile: UserProfile | null
  signIn: (email: string, password: string) => Promise<User | null>
  signUp: (email: string, password: string) => Promise<User | null>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  profile: null,
  signIn: async () => null,
  signUp: async () => null,
  signOut: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Sync User Profile ทุกครั้งที่ user เปลี่ยน
  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }
    setLoading(true)
    getUserProfileByUid(user.uid)
      .then(profile => setProfile(profile))
      .finally(() => setLoading(false))
  }, [user])

  // ตรวจสอบสถานะ Auth ทุกครั้ง (on mount)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser)
    })
    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const user = await signInWithEmail(email, password)
      setUser(user)
      return user
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    try {
      const user = await signUpWithEmail(email, password)
      setUser(user)
      // สร้าง Firestore user profile พร้อม role=user
      if (user) {
        await createUserProfile({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          role: 'user',
          createdAt: new Date(),
        })
      }
      return user
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await signOutUser()
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, profile, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
