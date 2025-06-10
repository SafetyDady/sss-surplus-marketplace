# Super Admin Credentials - SSS Surplus Marketplace

## 🔑 ข้อมูล Super Admin จริง

```env
SUPER_ADMIN_MODE=true
SUPER_ADMIN_EMAILS=sanchai5651@gmail.com
NEXT_PUBLIC_SUPER_ADMIN_ENABLED=true
SUPER_ADMIN_PASSWORD="Safety17"
SUPER_ADMIN_NAME="System Administrator"
```

## 🎯 วิธีการเข้าสู่ระบบ

### ขั้นตอนที่ 1: เข้าหน้า Login
1. ไปที่เว็บไซต์หลัก
2. คลิกปุ่ม "เข้าสู่ระบบ"
3. เลือก "🔥 Super Admin" จาก dropdown

### ขั้นตอนที่ 2: ใส่ข้อมูล
- **Email**: `sanchai5651@gmail.com`
- **Password**: `Safety17`

## 📍 หน้าที่จะ Redirect หลัง Login สำเร็จ

อาจจะไปที่หน้าใดหน้าหนึ่งเหล่านี้:
- `/admin/super/dashboard`
- `/admin/super`
- `/admin/dashboard` (ถ้าเป็น admin ทั่วไป)

## 🔧 การตั้งค่าใน Environment

Variables เหล่านี้ควรอยู่ในไฟล์:
- `.env.local` (Next.js)
- `.env` 
- Vercel Environment Variables (ถ้า deploy บน Vercel)

## ⚠️ หมายเหตุ

1. **SUPER_ADMIN_MODE=true** - เปิดใช้งาน Super Admin mode
2. **NEXT_PUBLIC_SUPER_ADMIN_ENABLED=true** - แสดง Super Admin option ใน UI
3. **SUPER_ADMIN_EMAILS** - อีเมลที่ได้รับสิทธิ์ Super Admin
4. **SUPER_ADMIN_PASSWORD** - รหัสผ่านสำหรับ Super Admin
5. **SUPER_ADMIN_NAME** - ชื่อที่แสดงในระบบ

## 🚀 การทดสอบ

เมื่อเว็บไซต์กลับมาทำงาน:
1. ทดสอบ login ด้วยข้อมูลข้างต้น
2. ตรวจสอบว่าไปหน้าไหนหลัง login สำเร็จ
3. ตรวจสอบฟีเจอร์ที่มีใน Super Admin panel

---
*อัปเดตล่าสุด: ข้อมูล Super Admin จริงจากผู้ใช้*

