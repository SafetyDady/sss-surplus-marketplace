// /lib/firebase-admin.js
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

/*
File: /lib/firebase-admin.js
Version: 1.0 | 2025-06-12
Purpose: Firebase Admin SDK configuration for server-side operations
Note: ใช้สำหรับ API Routes เท่านั้น, ไม่ใช้ในฝั่ง Client
*/

let adminApp;
let adminDb;

try {
  // ตรวจสอบว่ามี Environment Variables หรือไม่
  if (!process.env.FIREBASE_ADMIN_PROJECT_ID || 
      !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || 
      !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    throw new Error('Missing Firebase Admin environment variables');
  }

  // แปลง Private Key ให้ถูกต้อง (แทนที่ \\n ด้วย \n จริง)
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n');

  // สร้าง Service Account credentials
  const serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
    client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    private_key: privateKey,
  };

  // ตรวจสอบว่ามี Firebase Admin App อยู่แล้วหรือไม่ (ป้องกัน re-initialization)
  if (getApps().length === 0) {
    adminApp = initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    }, 'admin');
  } else {
    adminApp = getApps().find(app => app.name === 'admin') || getApps()[0];
  }

  // Initialize Firestore Admin
  adminDb = getFirestore(adminApp);

  console.log('✅ Firebase Admin SDK initialized successfully');

} catch (error) {
  console.error('❌ Firebase Admin SDK initialization failed:', error.message);
  
  // ใน development mode ให้แสดง error ละเอียด
  if (process.env.NODE_ENV === 'development') {
    console.error('Full error:', error);
  }
  
  throw error;
}

// Export Firestore Admin instance
export { adminDb };

// Export helper function สำหรับตรวจสอบสถานะ
export const isAdminInitialized = () => {
  return adminDb !== undefined;
};

// Export function สำหรับ server timestamp
export const getServerTimestamp = () => {
  const { FieldValue } = require('firebase-admin/firestore');
  return FieldValue.serverTimestamp();
};

