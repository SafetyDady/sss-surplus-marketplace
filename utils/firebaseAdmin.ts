// /utils/firebaseAdmin.ts

/*
File: /utils/firebaseAdmin.ts
Version: 1.0 | 2025-06-02
note: Firebase Admin SDK สำหรับฝั่ง Server (API Route) เท่านั้น | ห้าม import ใน client component | ต้องใช้ serviceAccount (ตั้งค่าผ่าน ENV เท่านั้น)
*/

import { initializeApp, getApps, cert, App, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// อ่านค่า service account key จาก ENV (แนะนำวิธีปลอดภัย)
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
} as ServiceAccount;

let adminApp: App;

if (!getApps().length) {
  adminApp = initializeApp({
    credential: cert(serviceAccount),
  });
} else {
  adminApp = getApps()[0]!;
}

export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
