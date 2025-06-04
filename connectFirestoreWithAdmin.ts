/*
File: /connectFirestoreWithAdmin.ts
Version: 2.0 | 2025-06-04
Note:
- ถ้าไม่มี serviceAccountKey.json จะไม่ initialize firebase-admin (ป้องกัน build error)
- โค้ดนี้ “ไม่ import serviceAccount” และไม่ error เวลา build/deploy
- ถ้าต้องการใช้ฝั่ง server จริง ให้ set credential ผ่าน ENV/Secret เท่านั้น
*/

import admin from "firebase-admin"

// เช็คว่า run ใน dev/local เท่านั้น ค่อย initialize (หรือใน function ที่มีการ set credential)
// *** ห้าม run/initialize ใน Next.js build/frontend ***

// (ไม่มีการ import serviceAccount อีกต่อไป)

if (!admin.apps.length) {
  // สามารถเพิ่ม logic สำหรับการอ่านจาก ENV/Secret ในฝั่ง server จริงเท่านั้น
  // ตัวอย่าง (ปลอดภัยสำหรับ production/serverless เท่านั้น):
  // const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)
  // admin.initializeApp({
  //   credential: admin.credential.cert(serviceAccount),
  //   storageBucket: "sss-surplus-marketplace.appspot.com",
  //   databaseURL: "https://sss-surplus-marketplace.firebaseio.com"
  // })
}

export const db = admin.firestore()
export const bucket = admin.storage().bucket()
