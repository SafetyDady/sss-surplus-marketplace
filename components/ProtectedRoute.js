'use client';

import React from 'react';
import { useAuth } from './auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/*
File: /components/ProtectedRoute.js
Version: 2.0 | 2025-06-13
note: Updated to use Firebase custom claims for role-based access control
*/

const ProtectedRoute = ({ children, requiredRole = null, requiredPermission = null }) => {
  const { user, role, permissions, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Check if user is authenticated
      if (!user) {
        router.push('/login');
        return;
      }

      // Check if user has required role
      if (requiredRole && role !== requiredRole) {
        // Special case: super_admin can access everything
        if (role !== 'super_admin') {
          router.push('/?error=unauthorized');
          return;
        }
      }

      // Check if user has required permission
      if (requiredPermission && permissions) {
        const hasPermission = permissions.includes('all') || 
                            permissions.includes(requiredPermission);
        
        if (!hasPermission) {
          router.push('/?error=unauthorized');
          return;
        }
      }
    }
  }, [loading, user, role, permissions, requiredRole, requiredPermission, router]);

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

  if (!user) {
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
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    );
  }

  // Check role-based access
  if (requiredRole && role !== requiredRole && role !== 'super_admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">ไม่มีสิทธิ์เข้าถึง</h3>
          <p className="text-gray-600 mb-6">คุณไม่มีสิทธิ์เข้าถึงหน้านี้ (ต้องการบทบาท: {requiredRole})</p>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/')}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              กลับหน้าหลัก
            </button>
            {role === 'admin' && (
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                ไป Admin Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Check permission-based access
  if (requiredPermission && permissions && role !== 'super_admin') {
    const hasPermission = permissions.includes('all') || 
                        permissions.includes(requiredPermission);
    
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
            <p className="text-gray-600 mb-6">คุณไม่มีสิทธิ์เข้าถึงฟีเจอร์นี้ (ต้องการสิทธิ์: {requiredPermission})</p>
            <button
              onClick={() => router.back()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              กลับไปหน้าก่อนหน้า
            </button>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;

