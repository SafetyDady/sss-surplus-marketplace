'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { signInWithCustomToken } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { exchangeCodeForToken, getLineProfile } from '@/lib/lineAuth';

function LineCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('กำลังประมวลผล...');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleLineCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`Line OAuth error: ${error}`);
        }

        if (!code || !state) {
          throw new Error('Missing authorization code or state');
        }

        setStatus('กำลังแลกเปลี่ยน authorization code...');
        
        // Exchange code for access token
        const tokenData = await exchangeCodeForToken(code, state);
        
        if (!tokenData.access_token) {
          throw new Error('Failed to get access token');
        }

        setStatus('กำลังดึงข้อมูลโปรไฟล์...');
        
        // Get user profile from Line
        const profile = await getLineProfile(tokenData.access_token);
        
        setStatus('กำลังสร้างบัญชีผู้ใช้...');
        
        // Create custom token for Firebase (this would need a backend service)
        // For now, we'll create a user directly in Firestore
        const userData = {
          lineId: profile.userId,
          email: `${profile.userId}@line.local`, // Line doesn't always provide email
          firstName: profile.displayName || '',
          lastName: '',
          photoURL: profile.pictureUrl || '',
          registrationMethod: 'line',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Save to Firestore (you might want to create a Firebase user first)
        await setDoc(doc(db, 'line_users', profile.userId), userData);
        
        setStatus('เข้าสู่ระบบสำเร็จ! กำลังนำคุณไปยังหน้าหลัก...');
        
        // Store Line user data in localStorage for now
        localStorage.setItem('line_user', JSON.stringify({
          ...userData,
          accessToken: tokenData.access_token
        }));
        
        // Redirect to home page
        setTimeout(() => {
          router.push('/');
        }, 2000);
        
      } catch (error) {
        console.error('Line callback error:', error);
        setError(error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
        setStatus('');
      }
    };

    handleLineCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Line Login</h1>
          <p className="text-gray-600">กำลังดำเนินการเข้าสู่ระบบ</p>
        </div>

        {status && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-center text-green-700">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-700 mr-2"></div>
              <span className="font-medium">{status}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-700">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
            <div className="mt-3">
              <button
                onClick={() => router.push('/auth/register')}
                className="text-sm text-red-600 hover:text-red-700 underline"
              >
                กลับไปหน้าสมัครสมาชิก
              </button>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-500">
          กรุณารอสักครู่...
        </div>
      </div>
    </div>
  );
}

export default function LineCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center">
        <div className="text-white text-xl">กำลังโหลด...</div>
      </div>
    }>
      <LineCallbackContent />
    </Suspense>
  );
}

