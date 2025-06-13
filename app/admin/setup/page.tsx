
/*
File: /home/ubuntu/sss-surplus-marketplace/app/admin/setup/page.tsx
Version: 2.0 | 2025-06-13
note: Temporarily disabled admin setup page due to refactoring of authentication system. 
      This page relies on old ADMIN_ROLES and admin management functions which are being replaced.
      Will be refactored to use Firebase Admin SDK and Firestore for adminWhitelist management in a future phase.
*/

import React from 'react';

export default function AdminSetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Setup & Management</h1>
        <p className="text-gray-600 mb-6">หน้านี้กำลังอยู่ระหว่างการปรับปรุงระบบ Authentication ใหม่</p>
        <p className="text-gray-600">กรุณากลับมาอีกครั้งหลังจากระบบได้รับการอัปเดตสมบูรณ์</p>
      </div>
    </div>
  );
}


