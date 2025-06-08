'use client';

import React, { useState, useEffect } from 'react';
import { auth, googleProvider, facebookProvider, db } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    agreeTerms: false,
    agreeMarketing: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showOptionalForm, setShowOptionalForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSuccessMessage('สมัครสมาชิกสำเร็จ! กำลังนำคุณไปยังหน้าหลัก...');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    });

    return () => unsubscribe();
  }, []);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    if (password.length < 6) return { level: 0, text: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', color: 'bg-red-500' };
    if (strength <= 2) return { level: 25, text: 'อ่อน', color: 'bg-red-500' };
    if (strength === 3) return { level: 50, text: 'ปานกลาง', color: 'bg-yellow-500' };
    if (strength === 4) return { level: 75, text: 'ดี', color: 'bg-blue-500' };
    return { level: 100, text: 'แข็งแกร่ง', color: 'bg-green-500' };
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'กรุณากรอกอีเมล';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }

    if (!formData.password) {
      newErrors.password = 'กรุณากรอกรหัสผ่าน';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'กรุณายืนยันรหัสผ่าน';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'กรุณายอมรับข้อกำหนดการใช้งาน';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create user in Firestore
  const createUserInFirestore = async (uid, userData) => {
    try {
      await setDoc(doc(db, 'users', uid), {
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  };

  // Handle email registration
  const handleEmailRegistration = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;
      
      // Update profile if name is provided
      if (formData.firstName || formData.lastName) {
        await updateProfile(user, {
          displayName: `${formData.firstName} ${formData.lastName}`.trim()
        });
      }
      
      // Save user data to Firestore
      await createUserInFirestore(user.uid, {
        email: user.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        agreeMarketing: formData.agreeMarketing,
        registrationMethod: 'email'
      });
      
      setSuccessMessage('สมัครสมาชิกสำเร็จ! กำลังนำคุณไปยังหน้าหลัก...');
      
    } catch (error) {
      console.error('Registration error:', error);
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign Up
  const handleGoogleSignUp = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Save user data to Firestore
      await createUserInFirestore(user.uid, {
        email: user.email,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        phone: user.phoneNumber || '',
        photoURL: user.photoURL,
        registrationMethod: 'google'
      });
      
      setSuccessMessage('สมัครสมาชิกสำเร็จ! กำลังนำคุณไปยังหน้าหลัก...');
      
    } catch (error) {
      console.error('Google sign up error:', error);
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Facebook Sign Up
  const handleFacebookSignUp = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      
      // Save user data to Firestore
      await createUserInFirestore(user.uid, {
        email: user.email,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        phone: user.phoneNumber || '',
        photoURL: user.photoURL,
        registrationMethod: 'facebook'
      });
      
      setSuccessMessage('สมัครสมาชิกสำเร็จ! กำลังนำคุณไปยังหน้าหลัก...');
      
    } catch (error) {
      console.error('Facebook sign up error:', error);
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Line Sign Up
  const handleLineSignUp = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const { getLineLoginUrl } = await import('@/lib/lineAuth');
      const lineLoginUrl = getLineLoginUrl();
      window.location.href = lineLoginUrl;
    } catch (error) {
      console.error('Line login error:', error);
      setErrors({ general: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Line' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle authentication errors
  const handleAuthError = (error) => {
    let message = 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น';
        break;
      case 'auth/weak-password':
        message = 'รหัสผ่านไม่แข็งแกร่งพอ';
        break;
      case 'auth/invalid-email':
        message = 'รูปแบบอีเมลไม่ถูกต้อง';
        break;
      case 'auth/popup-closed-by-user':
        message = 'การเข้าสู่ระบบถูกยกเลิก';
        break;
    }
    
    setErrors({ general: message });
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full grid md:grid-cols-2">
        {/* Visual Side */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-8 text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20"></div>
          <div className="relative z-10">
            <div className="text-6xl mb-6 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold mb-4">เริ่มต้นการเดินทาง!</h2>
            <p className="text-lg opacity-90 leading-relaxed">
              สมัครสมาชิกเพื่อเข้าถึงสินค้า Surplus คุณภาพดี<br />
              ราคาประหยัด และสัมผัสประสบการณ์การช้อปปิ้งที่ดีที่สุด
            </p>
          </div>
        </div>

        {/* Form Side */}
        <div className="p-8 overflow-y-auto max-h-screen">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">MTP Supply</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">สมัครสมาชิก</h1>
            <p className="text-gray-600">เลือกวิธีการสมัครที่สะดวกสำหรับคุณ</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center text-green-700">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">{successMessage}</span>
              </div>
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center text-red-700">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">{errors.general}</span>
              </div>
            </div>
          )}

          {/* Social Login */}
          <div className="mb-6">
            <h3 className="text-center font-semibold text-gray-700 mb-4">สมัครด้วย Social Media</h3>
            <div className="space-y-3">
              <button
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                สมัครด้วย Google
              </button>

              <button
                onClick={handleFacebookSignUp}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                สมัครด้วย Facebook
              </button>

              <button
                onClick={handleLineSignUp}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                </svg>
                สมัครด้วย Line
              </button>
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">หรือสมัครด้วยอีเมล</span>
            </div>
          </div>

          {/* Email Registration Form */}
          <form onSubmit={handleEmailRegistration} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="example@email.com"
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              
              {/* Password Strength */}
              {formData.password && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.level}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    ความแข็งแกร่ง: {passwordStrength.text}
                  </p>
                </div>
              )}
              
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่าน *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ยืนยันรหัสผ่าน"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Optional Information Toggle */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">ข้อมูลเพิ่มเติม</h4>
                <button
                  type="button"
                  onClick={() => setShowOptionalForm(!showOptionalForm)}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  {showOptionalForm ? 'ซ่อน' : 'แสดง'}
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                คุณสามารถกรอกข้อมูลส่วนตัวเพิ่มเติมภายหลัง เมื่อต้องการซื้อสินค้าจริง
              </p>
              
              {showOptionalForm && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="ชื่อ"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">นามสกุล</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="นามสกุล"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="08X-XXX-XXXX"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  required
                />
                <label className="ml-2 text-sm text-gray-700">
                  ฉันยอมรับ{' '}
                  <a href="#" className="text-purple-600 hover:text-purple-700 underline">
                    ข้อกำหนดการใช้งาน
                  </a>{' '}
                  และ{' '}
                  <a href="#" className="text-purple-600 hover:text-purple-700 underline">
                    นโยบายความเป็นส่วนตัว
                  </a>
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="text-sm text-red-600">{errors.agreeTerms}</p>
              )}

              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeMarketing"
                  checked={formData.agreeMarketing}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  ฉันต้องการรับข่าวสารและโปรโมชั่นจาก MTP Supply
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  กำลังสมัครสมาชิก...
                </>
              ) : (
                'สมัครสมาชิก'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              มีบัญชีอยู่แล้ว?{' '}
              <a href="/auth/login" className="text-purple-600 hover:text-purple-700 font-medium">
                เข้าสู่ระบบ
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

