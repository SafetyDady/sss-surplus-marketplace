# sss-surplus-marketplace (Backup Branch)

## 🗂 Structure (โครงสร้างไฟล์/โฟลเดอร์หลัก)

├── public/ # Static assets (เช่น รูป, favicon)
├── src/
│ └── app/ # Next.js App directory (หน้าต่าง ๆ)
│ └── components/ # Reusable React components (Form, Preview, etc.)
│ └── services/ # Logic ฝั่ง client (เช่น Firestore, Auth, Storage)
│ └── utils/ # Utility functions/helper
│ └── firebase/ # Firebase SDK config (client-side)
├── .gitignore # ไฟล์ที่กันไม่ให้ขึ้น git (node_modules, .env, etc.)
├── package.json # Dependency และ scripts
├── next.config.ts # Next.js config
├── tsconfig.json # TypeScript config
├── README.md # คู่มือโปรเจกต์

yaml
Copy
Edit

---

## 🎯 Purpose & Goal (เป้าหมายของโปรเจกต์นี้)

- พัฒนา **Marketplace สำหรับบริหารจัดการ/ซื้อขายสินค้าคงเหลือ** (Surplus Marketplace)
- รองรับระบบสมาชิก (Auth), การเพิ่ม/แก้ไขสินค้า, จัดการหมวดหมู่, อัปโหลดรูปภาพ, ระบบ Vendor/Admin
- Stack ที่ใช้:
  - **Next.js 14+** (React, App Router, SSR/CSR)
  - **TypeScript**
  - **TailwindCSS** (UI responsive)
  - **Firebase** (Auth, Firestore, Storage)
  - **Vercel** (deploy production)

---

## 🟢 Current Status (สถานะล่าสุด ณ วันที่ backup นี้)

- [x] โครงสร้างไฟล์และ source code ครบสมบูรณ์
- [x] เชื่อมต่อ Firebase (Auth, Firestore, Storage) และอัปโหลดรูปได้จริง
- [x] Product Form + Preview/Preview Grid ใช้งานได้จริง
- [x] ระบบเพิ่มหมวดหมู่, เพิ่มสินค้า, อัปโหลดรูป → **บันทึกข้อมูลครบทั้ง Storage และ Firestore**
- [x] ระบบ Toast, UX ดี (แจ้งเตือนสำเร็จ/ล้มเหลว)
- [x] **ไม่มี .env, node_modules, .next ใน backup นี้** (ปลอดภัยต่อการ share)
- [x] Backup ขึ้น GitHub branch: `backup-before-deploy`
- [ ] ยังไม่ได้ deploy production ใน branch นี้

---

## 🛠 Restore/ใช้งาน branch นี้

1. Clone หรือ checkout branch นี้:
    ```sh
    git checkout backup-before-deploy
    ```
2. ติดตั้ง dependency:
    ```sh
    npm install
    ```
3. เตรียมไฟล์ `.env.local` จาก Production/Dev ที่ backup ไว้  
   (อย่า push .env ขึ้น repo)
4. รัน dev server:
    ```sh
    npm run dev
    ```
5. ทดสอบระบบ/แก้ไขฟีเจอร์เพิ่มได้ทันที

---

## ⚠️ ข้อควรระวัง

- **ห้าม push .env, node_modules, .next ขึ้น repo**
- หาก merge README นี้กลับ main ให้ resolve conflict (อาจเนื้อหาไม่ตรงกัน)
- ใช้ branch นี้สำหรับ rollback หรือ deploy ใหม่ได้ทันที

---

## 👤 ผู้ดูแล/Contributor

- SafetyDady (Sanchai Saiyot)  
- [project owner/ทีม dev เพิ่มเติม]

---

## 📆 Backup ณ วันที่: `2025-Jun-03`  
*อัปเดตสถานะทุกครั้งที่ backup สำคัญ/เปลี่ยน version*

---


