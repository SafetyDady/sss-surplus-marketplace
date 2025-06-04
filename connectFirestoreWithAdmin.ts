import admin from "firebase-admin"
import serviceAccount from "../serviceAccountKey.json"

// ตรวจสอบก่อน initialize เพื่อไม่ให้ซ้ำ
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
    // กรณีใช้ Storage หรือ Database ด้วย
    storageBucket: "sss-surplus-marketplace.appspot.com", // หรือชื่อ bucket ของโปรเจกต์จริง
    databaseURL: "https://sss-surplus-marketplace.firebaseio.com"
  })
}

export const db = admin.firestore()
export const bucket = admin.storage().bucket()
