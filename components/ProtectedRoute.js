'use client';

import React from 'react';
import { useAuth } from '../components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, requiredPermission = null }) => {
  const { user, adminData, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/admin/login');
        return;
      }

      // ตรวจสอบว่าเป็น Super Admin หรือไม่
      const isSuperAdmin = adminData?.role === 'super_admin';
      
      // ถ้าเป็น Super Admin ให้เข้าถึงได้เสมอ
      if (isSuperAdmin) {
        return;
      }

      // ตรวจสอบ permission สำหรับ admin ทั่วไป
      if (requiredPermission && adminData) {
        const hasPermission = adminData.permissions?.includes('all') || 
                            adminData.permissions?.includes(requiredPermission);
        
        if (!hasPermission) {
          router.push('/admin?error=unauthorized');
          return;
        }
      }
    }
  }, [loading, isAuthenticated, adminData, requiredPermission, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <svg className="animate-spin w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">กำลังตรวจสอบสิทธิ์...</h3>
          <p className="text-gray-600">กรุณารอสักครู่</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">ไม่มีสิทธิ์เข้าถึง</h3>
          <p className="text-gray-600 mb-6">กรุณาเข้าสู่ระบบเพื่อเข้าถึงหน้านี้</p>
          <button
            onClick={() => router.push('/admin/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    );
  }

  if (requiredPermission && adminData) {
    const hasPermission = adminData.permissions?.includes('all') || 
                        adminData.permissions?.includes(requiredPermission);
    
    if (!hasPermission) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">ไม่มีสิทธิ์เข้าถึง</h3>
            <p className="text-gray-600 mb-6">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
            <button
              onClick={() => router.push('/admin')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              กลับไป Dashboard
            </button>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;

