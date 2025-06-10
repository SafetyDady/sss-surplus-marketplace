# SSS Surplus Marketplace

## 🏪 **E-commerce Platform สำหรับสินค้าเหลือใช้**

ระบบ E-commerce ที่ครบครันสำหรับการซื้อขายสินค้าเหลือใช้ พร้อมระบบจัดการ Admin, Vendor และ Customer

## 🎯 **Features หลัก**

### 🔐 **Authentication System**
- **Social Login** (Google, Facebook, Line)
- **Role-based Access Control** (Super Admin, Admin, Vendor, Customer)
- **Auto Redirect** ตาม Role หลัง Login
- **Secure Session Management**

### 👨‍💼 **Admin Management**
- **Super Admin Dashboard** - จัดการระบบทั้งหมด
- **Admin Dashboard** - จัดการ Users, Vendors, Products
- **User Management** - CRUD operations สำหรับผู้ใช้
- **Role Assignment** - มอบหมาย Role ให้ผู้ใช้ใหม่

### 🏪 **Vendor Management**
- **Vendor Dashboard** - Analytics และสถิติการขาย
- **Product Management** - จัดการสินค้าครบครัน
- **Sales Analytics** - รายงานยอดขายและแนวโน้ม
- **Inventory Management** - จัดการสต็อกสินค้า

### 📊 **Analytics & Reporting**
- **Real-time Statistics** - ข้อมูลสถิติแบบ Real-time
- **Sales Performance** - วิเคราะห์ประสิทธิภาพการขาย
- **Visual Charts** - กราฟและชาร์ตแสดงข้อมูล
- **Export Functions** - ส่งออกรายงานหลากหลายรูปแบบ

## 🚀 **Technology Stack**

### **Frontend**
- **React.js** + Hooks
- **Tailwind CSS** 
- **Lucide Icons**
- **Recharts** (Data Visualization)
- **Responsive Design**

### **Backend**
- **Next.js API Routes**
- **NextAuth.js** (Authentication)
- **Prisma ORM** (Database)
- **PostgreSQL/MySQL** (Database)

### **Authentication**
- **OAuth 2.0** (Google, Facebook, Line)
- **JWT Tokens**
- **Role-based Permissions**
- **Session Management**

## 📁 **โครงสร้างโปรเจค**

```
/
├── components/
│   ├── admin/
│   │   ├── AdminMainDashboard.jsx
│   │   ├── SuperAdminDashboard.jsx
│   │   └── UserManagement.jsx
│   ├── vendor/
│   │   ├── VendorDashboard.jsx
│   │   ├── VendorManagementSystem.jsx
│   │   └── VendorProductManagement.jsx
│   └── auth/
│       ├── AdminVendorSocialLogin.jsx
│       └── admin-login-fixed.html
├── api/
│   ├── auth/
│   │   ├── auth.js
│   │   ├── super-admin-login.js
│   │   └── users.js
│   └── middleware.js
├── database/
│   ├── migrations/
│   │   ├── 001_create_users_table.sql
│   │   ├── 002_create_accounts_table.sql
│   │   └── ...
│   └── schema.prisma
├── docs/
│   ├── admin-guide.pdf
│   ├── implementation-guide.pdf
│   ├── deployment-guide.pdf
│   ├── vendor-management-summary.pdf
│   └── admin-login-fix-report.pdf
└── tests/
    ├── auth.test.js
    ├── api.test.js
    └── integration.test.js
```

## 🔧 **การติดตั้งและใช้งาน**

### **1. Clone Repository**
```bash
git clone <repository-url>
cd sss-surplus-marketplace
```

### **2. Install Dependencies**
```bash
npm install
# หรือ
yarn install
```

### **3. Environment Setup**
```bash
cp .env.example .env.local
# แก้ไข environment variables
```

### **4. Database Setup**
```bash
# Run migrations
npm run db:migrate
# หรือ
./run_migrations.sh
```

### **5. Start Development Server**
```bash
npm run dev
# หรือ
yarn dev
```

## 🔐 **Default Credentials**

### **Super Admin**
- **Email**: sanchai5651@gmail.com
- **Password**: Safety17

## 🧪 **การทดสอบ**

### **Unit Tests**
```bash
npm run test
```

### **Integration Tests**
```bash
npm run test:integration
```

### **E2E Tests**
```bash
npm run test:e2e
```

## 🚀 **Deployment**

### **Production Deployment**
```bash
npm run build
npm run start
```

### **Docker Deployment**
```bash
docker build -t sss-marketplace .
docker run -p 3000:3000 sss-marketplace
```

## 📚 **เอกสารประกอบ**

- [Admin Guide](docs/admin-guide.pdf) - คู่มือการใช้งานสำหรับ Admin
- [Implementation Guide](docs/implementation-guide.pdf) - คู่มือการพัฒนา
- [Deployment Guide](docs/deployment-guide.pdf) - คู่มือการ Deploy
- [Vendor Management](docs/vendor-management-summary.pdf) - ระบบจัดการ Vendor
- [Login Fix Report](docs/admin-login-fix-report.pdf) - รายงานการแก้ไข Login

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 **Contact**

- **Email**: sanchai5651@gmail.com
- **Project**: SSS Surplus Marketplace
- **Version**: 1.0.0

---

**พัฒนาโดย SSS Surplus Marketplace Team** 🚀

