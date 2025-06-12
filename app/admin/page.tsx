'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { adminData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (adminData) {
        // ถ้า authenticated แล้ว redirect ไป dashboard
        router.push('/admin/dashboard');
      } else {
        // ถ้ายัง unauthenticated redirect ไป login
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

