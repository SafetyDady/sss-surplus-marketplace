# Firebase Project Setup - SSS Supply Marketplace

## 🔥 **Step 1: Create Firebase Project**

### **1.1 Go to Firebase Console**
- เปิด [Firebase Console](https://console.firebase.google.com/)
- คลิก "Add project" หรือ "Create a project"

### **1.2 Project Configuration**
```
Project Name: sss-supply-marketplace
Project ID: sss-supply-marketplace-[random]
Analytics: Enable (recommended)
```

### **1.3 Enable Required Services**
- ✅ **Firestore Database**
- ✅ **Firebase Storage**
- ✅ **Firebase Authentication** (optional)

---

## 🗄️ **Step 2: Setup Firestore Database**

### **2.1 Create Firestore Database**
1. ไปที่ "Firestore Database" ใน Firebase Console
2. คลิก "Create database"
3. เลือก "Start in test mode" (สำหรับ development)
4. เลือก location: `asia-southeast1 (Singapore)`

### **2.2 Create Collections**
สร้าง Collections ต่อไปนี้:

#### **Collection: `contact_messages`**
```javascript
// Example document structure
{
  id: "auto-generated",
  senderInfo: {
    name: "ชื่อผู้ส่ง",
    email: "email@example.com",
    phone: "089-123-4567"
  },
  messageInfo: {
    subject: "สอบถามเกี่ยวกับสินค้า",
    message: "ข้อความ..."
  },
  systemInfo: {
    status: "new", // new, replied, pending, closed
    submittedAt: "timestamp",
    reply: "การตอบกลับ",
    repliedBy: "admin",
    repliedAt: "timestamp"
  }
}
```

#### **Collection: `vendor_applications`**
```javascript
// Example document structure
{
  id: "auto-generated",
  applicantType: "individual", // individual, company
  companyInfo: {
    companyName: "ชื่อบริษัท",
    businessType: "ประเภทธุรกิจ",
    companyAddress: "ที่อยู่",
    taxId: "เลขประจำตัวผู้เสียภาษี",
    website: "https://example.com"
  },
  contactInfo: {
    contactName: "ชื่อผู้ติดต่อ",
    position: "ตำแหน่ง",
    email: "email@example.com",
    phone: "02-123-4567",
    mobile: "089-123-4567",
    lineId: "line_id"
  },
  productInfo: {
    productCategories: ["หมวดหมู่1", "หมวดหมู่2"],
    productDescription: "รายละเอียดสินค้า",
    monthlyVolume: "ปริมาณต่อเดือน",
    experience: "ประสบการณ์"
  },
  additionalInfo: {
    motivation: "เหตุผลที่ต้องการเป็น Vendor",
    otherPlatforms: "แพลตฟอร์มอื่น",
    terms: true,
    newsletter: false
  },
  documents: {
    idCard: {
      url: "storage_url",
      fileName: "id_card.pdf",
      uploadedAt: "timestamp"
    }
  },
  systemInfo: {
    status: "pending", // pending, approved, rejected
    submittedAt: "timestamp",
    reviewedBy: "admin",
    reviewedAt: "timestamp",
    notes: "หมายเหตุ"
  }
}
```

---

## 📁 **Step 3: Setup Firebase Storage**

### **3.1 Enable Storage**
1. ไปที่ "Storage" ใน Firebase Console
2. คลิก "Get started"
3. เลือก "Start in test mode"
4. เลือก location: `asia-southeast1`

### **3.2 Create Storage Structure**
```
/vendor-documents/
  /{vendorId}/
    /id-card/
    /house-registration/
    /business-license/
    /company-certificate/
    /articles-of-association/
    /power-of-attorney/

/contact-attachments/
  /{messageId}/
    /attachment1.pdf
    /attachment2.jpg
```

---

## 🔐 **Step 4: Security Rules**

### **4.1 Firestore Security Rules**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Contact messages - allow create for all, read/write for admin
    match /contact_messages/{document} {
      allow create: if true;
      allow read, write: if request.auth != null && 
        request.auth.token.admin == true;
    }
    
    // Vendor applications - allow create for all, read/write for admin
    match /vendor_applications/{document} {
      allow create: if true;
      allow read, write: if request.auth != null && 
        request.auth.token.admin == true;
    }
    
    // Admin only collections
    match /admin/{document=**} {
      allow read, write: if request.auth != null && 
        request.auth.token.admin == true;
    }
  }
}
```

### **4.2 Storage Security Rules**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Vendor documents
    match /vendor-documents/{vendorId}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    
    // Contact attachments
    match /contact-attachments/{messageId}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    
    // Admin access to all files
    match /{allPaths=**} {
      allow read, write: if request.auth != null && 
        request.auth.token.admin == true;
    }
  }
}
```

---

## 🔑 **Step 5: Get Configuration Keys**

### **5.1 Web App Configuration**
1. ไปที่ "Project settings" (⚙️ icon)
2. เลื่อนลงไปที่ "Your apps"
3. คลิก "Add app" → เลือก "Web" (</> icon)
4. App nickname: `sss-supply-marketplace-web`
5. คัดลอก configuration object:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
  measurementId: "G-XXXXXXXXXX"
};
```

---

## 📝 **Step 6: Environment Variables**

### **6.1 Create `.env.local` file**
สร้างไฟล์ `.env.local` ใน root directory:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=admin@ssssupply.com
```

### **6.2 Update Vercel Environment Variables**
ใน Vercel Dashboard:
1. ไปที่ Project Settings
2. เลือก "Environment Variables"
3. เพิ่ม variables ทั้งหมดจาก `.env.local`

---

## 🧪 **Step 7: Test Configuration**

### **7.1 Test Firebase Connection**
```javascript
// Test in browser console
import { db } from './lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

// Test Firestore
const testDoc = await addDoc(collection(db, 'test'), {
  message: 'Hello Firebase!',
  timestamp: new Date()
});
console.log('Document written with ID: ', testDoc.id);
```

### **7.2 Test Contact Form**
1. เปิด `/contact`
2. กรอกฟอร์มและส่ง
3. ตรวจสอบใน Firestore Console

### **7.3 Test Vendor Registration**
1. เปิด `/vendor-registration`
2. กรอกฟอร์มและอัพโหลดเอกสาร
3. ตรวจสอบใน Firestore และ Storage

### **7.4 Test Admin Dashboard**
1. เปิด `/admin/contact`
2. ตรวจสอบว่าแสดงข้อมูลจาก Firestore
3. ทดสอบการตอบกลับข้อความ

---

## ✅ **Checklist**

- [ ] สร้าง Firebase Project
- [ ] Enable Firestore Database
- [ ] Enable Firebase Storage
- [ ] Setup Security Rules
- [ ] Create Web App Configuration
- [ ] Copy Environment Variables
- [ ] Create `.env.local` file
- [ ] Update Vercel Environment Variables
- [ ] Test Contact Form
- [ ] Test Vendor Registration
- [ ] Test Admin Dashboard

---

## 🚀 **Ready to Go!**

เมื่อทำตาม steps ทั้งหมดแล้ว ระบบจะพร้อมใช้งาน:

- ✅ **Contact Form** → Firestore
- ✅ **Vendor Registration** → Firestore + Storage
- ✅ **Admin Dashboard** → Real-time data
- ✅ **Document Upload** → Firebase Storage
- ✅ **Security** → Protected by rules

**Firebase Project Setup Complete!** 🎉

