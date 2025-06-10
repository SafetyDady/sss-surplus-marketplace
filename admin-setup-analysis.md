# การตรวจสอบ Admin Setup - SSS Surplus Marketplace

## ปัญหาที่พบ

### 🚨 เว็บไซต์ไม่สามารถเข้าถึงได้
- URL หลัก: https://3000-iuui2qvpkjbji4izmlokf-4cb56e9e.manusvm.computer
- สถานะ: "The temporary website is currently unavailable"
- สาเหตุ: Manus computer อาจ sleep หรือ link หมดอายุ

### 📋 ข้อมูลที่ได้จากการตรวจสอบก่อนหน้า

จากภาพหน้าจอที่ผู้ใช้ส่งมา เห็นว่า Admin Portal มี:
- หน้า Admin login ที่มี email/password fields
- ข้อความ "ต้นที่โลคอลกิ่นสำหรับผู้ดูแลระบบเท่านั้น"
- Super Admin link ที่ระบุ "ใช้อีเมล sanchai565@gmail.com เก็บเอาไว้ สำหรับ Super Admin"

## 🔐 วิธีการเข้า Admin ครั้งแรก (จากข้อมูลที่มี)

### 1. Super Admin Account
- **Email**: sanchai565@gmail.com
- **Password**: ต้องตรวจสอบเพิ่มเติม (อาจเป็น default password)

### 2. Default Admin Credentials (ทั่วไป)
- admin@company.com / admin123
- admin@sss.com / password
- superadmin@sss.com / superadmin

### 3. Environment Variables ที่ควรตรวจสอบ
- ADMIN_EMAIL
- ADMIN_PASSWORD
- SUPER_ADMIN_EMAIL
- SUPER_ADMIN_PASSWORD

## 📝 คำแนะนำ

1. **ตรวจสอบ Environment Variables** ในไฟล์ .env
2. **ดู Database Seeding** สำหรับ admin users
3. **ตรวจสอบ Documentation** ของโปรเจค
4. **ลองใช้ Super Admin email**: sanchai565@gmail.com

## ⚠️ หมายเหตุ
เนื่องจากเว็บไซต์ไม่สามารถเข้าถึงได้ในขณะนี้ จึงไม่สามารถทดสอบการ login ได้

