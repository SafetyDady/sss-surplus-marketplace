// /firebase/createUserInFirestore.ts
import { getFirestore, doc, setDoc, updateDoc } from "firebase/firestore"

/*
File: /firebase/createUserInFirestore.ts
Version: 1.0 | 2025-06-04
note:
- ใช้หลังผู้ใช้สมัครหรือ login สำเร็จ เพื่อ sync user data จาก Auth → Firestore (collection 'users')
- รองรับฟังก์ชันสร้าง user, อัปเดต vendor/partner, และ approve/reject (admin)
*/

type VendorProfile = {
  businessName: string
  taxId: string
  docs: string[]
  requestDate: string
}

type DBUser = {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  role: "user" | "vendor" | "partner" | "admin" | "owner"
  status: "pending" | "approved" | "rejected"
  vendorProfile?: VendorProfile
  createdAt: string
  updatedAt: string
}

// สร้าง user document ทันทีหลัง Auth (Sign up/Sign in) สำเร็จ
export async function createUserInFirestore(user: {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
}) {
  const db = getFirestore()
  const userRef = doc(db, "users", user.uid)
  const now = new Date().toISOString()
  const userData: DBUser = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || "",
    photoURL: user.photoURL || "",
    role: "user",
    status: "approved",
    createdAt: now,
    updatedAt: now
  }
  await setDoc(userRef, userData, { merge: true })
}

// ผู้ใช้สมัคร vendor/partner → อัปเดต vendorProfile & status
export async function requestVendor(
  uid: string,
  vendorProfile: Omit<VendorProfile, "requestDate">,
) {
  const db = getFirestore()
  const userRef = doc(db, "users", uid)
  await updateDoc(userRef, {
    vendorProfile: {
      ...vendorProfile,
      requestDate: new Date().toISOString(),
    },
    status: "pending",
    updatedAt: new Date().toISOString(),
  })
}

// Admin อนุมัติหรือปฏิเสธ vendor/partner
export async function setVendorStatus(
  uid: string,
  approved: boolean
) {
  const db = getFirestore()
  const userRef = doc(db, "users", uid)
  await updateDoc(userRef, {
    role: approved ? "vendor" : "user",
    status: approved ? "approved" : "rejected",
    updatedAt: new Date().toISOString(),
  })
}
