'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../lib/firebase';

export default function SuperAdminPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', displayName: '', icon: '' });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // ตรวจสอบสิทธิ์ Super Admin
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      checkSuperAdminAccess(user);
    });

    return () => unsubscribe();
  }, [router]);

  const checkSuperAdminAccess = (user) => {
    const superAdminEnabled = process.env.NEXT_PUBLIC_SUPER_ADMIN_ENABLED === 'true';
    
    if (!superAdminEnabled) {
      router.push('/404');
      return;
    }

    // ตรวจสอบ email ของผู้ใช้
    if (user && user.email) {
      const superAdminEmails = ['sanchai5651@gmail.com']; // จาก Environment
      const isSuperAdmin = superAdminEmails.includes(user.email.toLowerCase().trim());
      
      if (isSuperAdmin) {
        setIsAuthorized(true);
        loadCategories();
      } else {
        // ถ้าไม่ใช่ Super Admin ให้ redirect ไป login
        router.push('/admin/login?message=super_admin_required');
        return;
      }
    } else {
      // ถ้ายังไม่ได้ login ให้ redirect ไป login
      router.push('/admin/login?message=login_required');
      return;
    }
    
    setLoading(false);
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        setNewCategory({ name: '', displayName: '', icon: '' });
        loadCategories();
        alert('เพิ่มหมวดหมู่สำเร็จ!');
      } else {
        alert('เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('ต้องการลบหมวดหมู่นี้หรือไม่?')) return;

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadCategories();
        alert('ลบหมวดหมู่สำเร็จ!');
      } else {
        alert('เกิดข้อผิดพลาดในการลบหมวดหมู่');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('เกิดข้อผิดพลาดในการลบหมวดหมู่');
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">กำลังตรวจสอบสิทธิ์...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">กำลังเปลี่ยนเส้นทาง...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">🔥 Super Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                ยินดีต้อนรับ: {currentUser?.email}
              </span>
              <button
                onClick={() => router.push('/')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                กลับหน้าหลัก
              </button>
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Management */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">จัดการหมวดหมู่สินค้า</h2>
          
          {/* Add New Category Form */}
          <form onSubmit={handleAddCategory} className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">เพิ่มหมวดหมู่ใหม่</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อเต็ม
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="เช่น อิเล็กทรอนิกส์"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อแสดงผล
                </label>
                <input
                  type="text"
                  value={newCategory.displayName}
                  onChange={(e) => setNewCategory({...newCategory, displayName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="เช่น IT"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ไอคอน
                </label>
                <input
                  type="text"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="เช่น 💻"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              เพิ่มหมวดหมู่
            </button>
          </form>

          {/* Categories List */}
          <div>
            <h3 className="text-lg font-medium mb-4">หมวดหมู่ทั้งหมด ({categories.length})</h3>
            {categories.length === 0 ? (
              <p className="text-gray-500 text-center py-8">ยังไม่มีหมวดหมู่</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-gray-500">{category.displayName}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">ข้อมูลระบบ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Environment</h3>
              <p className="text-sm text-gray-600">Super Admin Mode: Enabled</p>
              <p className="text-sm text-gray-600">Firebase Project: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</p>
              <p className="text-sm text-gray-600">Logged in as: {currentUser?.email}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/admin')}
                  className="block w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Admin Dashboard
                </button>
                <button
                  onClick={() => router.push('/admin/contact')}
                  className="block w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Contact Management
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

