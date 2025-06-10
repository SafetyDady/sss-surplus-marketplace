// /services/userService.ts

import { db } from '../firebase/firebase'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'

/*
File: /services/userService.ts
Version: 1.0 | 2025-06-02
note: จัดการข้อมูลผู้ใช้ (Firestore users collection) | สำหรับสร้าง/อ่าน user profile และ role
*/

// โครงสร้างข้อมูล User Profile
export interface UserProfile {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  role: 'user' | 'vendor' | 'admin'
  createdAt: Date
  [key: string]: any
}

// สร้าง/อัปเดต User Profile ใน Firestore
export async function createUserProfile(profile: UserProfile) {
  const ref = doc(db, 'users', profile.uid)
  await setDoc(ref, profile, { merge: true })
}

// ดึงข้อมูล User Profile ด้วย uid
export async function getUserProfileByUid(uid: string): Promise<UserProfile | null> {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  if (snap.exists()) return snap.data() as UserProfile
  return null
}
