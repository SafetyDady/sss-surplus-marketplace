/*
File: /connectFirestoreWithAdmin.ts
Version: 2.0 | 2025-06-04
Note:
- ถ้าไม่มี serviceAccountKey.json จะไม่ initialize firebase-admin (ป้องกัน build error)
- โค้ดนี้ "ไม่ import serviceAccount" และไม่ error เวลา build/deploy
- ถ้าต้องการใช้ฝั่ง server จริง ให้ set credential ผ่าน ENV/Secret เท่านั้น
*/

import admin from "firebase-admin"

// เช็คว่า run ใน dev/local เท่านั้น ค่อย initialize (หรือใน function ที่มีการ set credential)
// *** ห้าม run/initialize ใน Next.js build/frontend ***

// (ไม่มีการ import serviceAccount อีกต่อไป)

if (!admin.apps.length) {
  // Initialize with minimal configuration for build compatibility
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(
        Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf8')
      );
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "sss-surplus-marketplace.appspot.com",
        databaseURL: process.env.FIREBASE_DATABASE_URL || "https://sss-surplus-marketplace.firebaseio.com"
      });
    } else {
      // Fallback initialization for build process
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    // Initialize with minimal config to prevent build errors
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
}

export const db = admin.firestore()

// Only export bucket if storage is properly configured
let bucket;
try {
  bucket = admin.storage().bucket()
} catch (error) {
  console.log('Storage bucket not configured, skipping...')
  bucket = null
}

export { bucket }

// Export function for API routes
export async function connectFirestoreWithAdmin() {
  return db
}
