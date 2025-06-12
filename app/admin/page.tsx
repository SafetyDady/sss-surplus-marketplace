'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { adminData, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // ตรวจสอบว่าเป็น Super Admin หรือไม่
      const isSuperAdmin = adminData?.role === 'super_admin';
      
      // ตรวจสอบว่ามาจาก URL ไหน (เพื่อป้องกัน redirect loop)
      const fromSuperAdmin = window.location.pathname.includes('/admin/super');
      
      if (adminData) {
        // ถ้าเป็น Super Admin และมาจากหน้า Super Admin Dashboard
        if (isSuperAdmin && fromSuperAdmin) {
          console.log('Super Admin redirecting to dashboard');
          router.push('/admin/dashboard');
        }
        // ถ้าเป็น Super Admin แต่ไม่ได้มาจากหน้า Super Admin Dashboard
        else if (isSuperAdmin) {
          console.log('Super Admin accessing admin page');
          router.push('/admin/super/dashboard');
        }
        // ถ้าเป็น Admin ทั่วไป
        else {
          console.log('Regular admin redirecting to dashboard');
          router.push('/admin/dashboard');
        }
      } else {
        // ถ้ายัง unauthenticated redirect ไป login
        console.log('Unauthenticated, redirecting to login');
        router.push('/admin/login');
      }
    }
  }, [adminData, loading, router]);

  // แสดง loading ระหว่างรอ redirect
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">กำลังเข้าสู่ระบบ...</p>
      </div>
    </div>
  );
}

