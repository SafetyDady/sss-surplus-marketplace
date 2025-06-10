// /services/authService.ts

import { auth } from '../firebase/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth'

/*
File: /services/authService.ts
Version: 1.0 | 2025-06-02
note: Service สำหรับ Auth (Sign Up, Sign In, Sign Out) | Firebase Client SDK | รองรับขยาย Social login ในอนาคต
*/

// สมัครสมาชิกด้วย Email/Password
export async function signUpWithEmail(email: string, password: string): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  return result.user
}

// เข้าสู่ระบบด้วย Email/Password
export async function signInWithEmail(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

// ออกจากระบบ
export async function signOutUser(): Promise<void> {
  await signOut(auth)
}
