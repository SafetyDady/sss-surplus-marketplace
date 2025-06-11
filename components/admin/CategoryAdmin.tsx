'use client'

import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../../firebase/firebase'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import AdminCardContainer from '../common/AdminCardContainer'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'

/*
File: /components/admin/CategoryAdmin.tsx
Version: 4.2 | 2025-06-11
note:
- เพิ่ม Authentication Context เพื่อให้ Firebase Rules ทำงานได้
- ใช้ useAuthState เพื่อตรวจสอบสถานะการ login
- เพิ่มการตรวจสอบสิทธิ์ก่อนทำงาน
*/

type Category = {
  id: string
  name: string
  parentId: string | null
}

export default function CategoryAdmin() {
  const [user, loading, error] = useAuthState(auth)
  const [categories, setCategories] = useState<Category[]>([])
  const [mainName, setMainName] = useState('')
  const [subName, setSubName] = useState('')
  const [sub2Name, setSub2Name] = useState('')

  const [selectedMain, setSelectedMain] = useState<Category | null>(null)
  const [selectedSub, setSelectedSub] = useState<Category | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fetchCategories = async () => {
    if (!user) {
      setErrorMessage('กรุณาเข้าสู่ระบบก่อน')
      return
    }

    setIsLoading(true)
    try {
      console.log("Fetching categories with user:", user.email);
      const snap = await getDocs(collection(db, 'categories'))
      console.log("Categories fetched:", snap.docs.length);
      
      setCategories(
        snap.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          parentId: doc.data().parentId || null,
        }))
      )
      setErrorMessage(null)
    } catch (error) {
      console.error("Error fetching categories:", error);
      setErrorMessage('เกิดข้อผิดพลาดในการโหลดข้อมูล: ' + (error instanceof Error ? error.message : String(error)))
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (user) {
      console.log("User authenticated:", user.email);
      fetchCategories()
    } else if (!loading) {
      console.log("User not authenticated");
      setErrorMessage('กรุณาเข้าสู่ระบบก่อน')
    }
  }, [user, loading])

  const handleAddMain = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mainName.trim() || !user) return
    
    setIsLoading(true)
    try {
      console.log("Adding main category:", mainName.trim(), "by user:", user.email);
      await addDoc(collection(db, 'categories'), { 
        name: mainName.trim(), 
        parentId: null,
        createdBy: user.uid,
        createdAt: new Date()
      })
      setMainName('')
      await fetchCategories()
      setErrorMessage(null)
    } catch (error) {
      console.error("Error adding main category:", error);
      setErrorMessage('เพิ่มหมวดหลักไม่สำเร็จ: ' + (error instanceof Error ? error.message : String(error)))
    }
    setIsLoading(false)
  }

  const handleAddSub = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subName.trim() || !selectedMain || !user) return
    
    setIsLoading(true)
    try {
      console.log("Adding sub category:", subName.trim(), "under parent:", selectedMain.id, "by user:", user.email);
      await addDoc(collection(db, 'categories'), { 
        name: subName.trim(), 
        parentId: selectedMain.id,
        createdBy: user.uid,
        createdAt: new Date()
      })
      setSubName('')
      await fetchCategories()
      setErrorMessage(null)
    } catch (error) {
      console.error("Error adding sub category:", error);
      setErrorMessage('เพิ่มหมวดย่อยไม่สำเร็จ: ' + (error instanceof Error ? error.message : String(error)))
    }
    setIsLoading(false)
  }

  const handleAddSub2 = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sub2Name.trim() || !selectedSub || !user) return
    
    setIsLoading(true)
    try {
      console.log("Adding sub2 category:", sub2Name.trim(), "under parent:", selectedSub.id, "by user:", user.email);
      await addDoc(collection(db, 'categories'), { 
        name: sub2Name.trim(), 
        parentId: selectedSub.id,
        createdBy: user.uid,
        createdAt: new Date()
      })
      setSub2Name('')
      await fetchCategories()
      setErrorMessage(null)
    } catch (error) {
      console.error("Error adding sub2 category:", error);
      setErrorMessage('เพิ่มหมวดย่อยระดับ 2 ไม่สำเร็จ: ' + (error instanceof Error ? error.message : String(error)))
    }
    setIsLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบหมวดหมู่นี้?') || !user) return
    
    setIsLoading(true)
    try {
      console.log("Deleting category:", id, "by user:", user.email);
      await deleteDoc(doc(db, 'categories', id))
      
      // Delete child categories
      const childCategories = categories.filter(cat => cat.parentId === id)
      for (const cat of childCategories) {
        await deleteDoc(doc(db, 'categories', cat.id))
      }
      
      if (selectedMain && selectedMain.id === id) setSelectedMain(null)
      if (selectedSub && selectedSub.id === id) setSelectedSub(null)
      await fetchCategories()
      setErrorMessage(null)
    } catch (error) {
      console.error("Error deleting category:", error);
      setErrorMessage('ลบหมวดหมู่ไม่สำเร็จ: ' + (error instanceof Error ? error.message : String(error)))
    }
    setIsLoading(false)
  }

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id)
    setEditingName(cat.name)
  }

  const handleUpdate = async () => {
    if (!editingId || !editingName.trim() || !user) return
    
    setIsLoading(true)
    try {
      console.log("Updating category:", editingId, "with name:", editingName.trim(), "by user:", user.email);
      await updateDoc(doc(db, 'categories', editingId), {
        name: editingName.trim(),
        updatedBy: user.uid,
        updatedAt: new Date()
      })
      setEditingId(null)
      setEditingName('')
      await fetchCategories()
      setErrorMessage(null)
    } catch (error) {
      console.error("Error updating category:", error);
      setErrorMessage('แก้ไขหมวดหมู่ไม่สำเร็จ: ' + (error instanceof Error ? error.message : String(error)))
    }
    setIsLoading(false)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <AdminCardContainer>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </AdminCardContainer>
    )
  }

  // Show error if not authenticated
  if (!user) {
    return (
      <AdminCardContainer>
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            กรุณาเข้าสู่ระบบก่อนใช้งาน
          </div>
        </div>
      </AdminCardContainer>
    )
  }

  const mainCategories = categories.filter(cat => cat.parentId === null)
  const subCategories = selectedMain
    ? categories.filter(cat => cat.parentId === selectedMain.id)
    : []
  const sub2Categories = selectedSub
    ? categories.filter(cat => cat.parentId === selectedSub.id)
    : []

  return (
    <AdminCardContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            จัดการหมวดหมู่สินค้า
          </h2>
          <p className="text-gray-600">
            จัดการหมวดหมู่แบบ 3 ระดับ: หมวดหลัก → หมวดย่อย → หมวดย่อยระดับ 2
          </p>
          <p className="text-sm text-blue-600 mt-1">
            เข้าสู่ระบบในฐานะ: {user.email}
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">กำลังประมวลผล...</span>
          </div>
        )}

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Categories */}
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                หมวดหลัก
              </h3>
              <form onSubmit={handleAddMain} className="space-y-2">
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ชื่อหมวดหลัก"
                  value={mainName}
                  onChange={e => setMainName(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  disabled={isLoading || !mainName.trim()}
                >
                  <Plus size={16} />
                  เพิ่มหมวดหลัก
                </button>
              </form>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {mainCategories.map(cat => (
                <div
                  key={cat.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedMain && selectedMain.id === cat.id
                      ? 'bg-blue-100 border-blue-300'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedMain(cat)
                    setSelectedSub(null)
                  }}
                >
                  {editingId === cat.id ? (
                    <div className="space-y-2">
                      <input
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        value={editingName}
                        onChange={e => setEditingName(e.target.value)}
                        disabled={isLoading}
                      />
                      <div className="flex gap-1">
                        <button
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                          onClick={handleUpdate}
                          disabled={isLoading}
                        >
                          <Save size={12} />
                          บันทึก
                        </button>
                        <button
                          className="bg-gray-400 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                          onClick={handleCancelEdit}
                        >
                          <X size={12} />
                          ยกเลิก
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{cat.name}</span>
                      <div className="flex gap-1">
                        <button
                          className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                          onClick={ev => {
                            ev.stopPropagation()
                            handleEdit(cat)
                          }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="text-red-600 hover:bg-red-100 p-1 rounded"
                          onClick={ev => {
                            ev.stopPropagation()
                            handleDelete(cat.id)
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sub Categories */}
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                หมวดย่อย
                {selectedMain && (
                  <span className="text-sm text-green-600">({selectedMain.name})</span>
                )}
              </h3>
              <form onSubmit={handleAddSub} className="space-y-2">
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="ชื่อหมวดย่อย"
                  value={subName}
                  onChange={e => setSubName(e.target.value)}
                  disabled={isLoading || !selectedMain}
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  disabled={isLoading || !selectedMain || !subName.trim()}
                >
                  <Plus size={16} />
                  เพิ่มหมวดย่อย
                </button>
              </form>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {subCategories.map(cat => (
                <div
                  key={cat.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedSub && selectedSub.id === cat.id
                      ? 'bg-green-100 border-green-300'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedSub(cat)}
                >
                  {editingId === cat.id ? (
                    <div className="space-y-2">
                      <input
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        value={editingName}
                        onChange={e => setEditingName(e.target.value)}
                        disabled={isLoading}
                      />
                      <div className="flex gap-1">
                        <button
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                          onClick={handleUpdate}
                          disabled={isLoading}
                        >
                          <Save size={12} />
                          บันทึก
                        </button>
                        <button
                          className="bg-gray-400 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                          onClick={handleCancelEdit}
                        >
                          <X size={12} />
                          ยกเลิก
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{cat.name}</span>
                      <div className="flex gap-1">
                        <button
                          className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                          onClick={ev => {
                            ev.stopPropagation()
                            handleEdit(cat)
                          }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="text-red-600 hover:bg-red-100 p-1 rounded"
                          onClick={ev => {
                            ev.stopPropagation()
                            handleDelete(cat.id)
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sub2 Categories */}
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                หมวดย่อยระดับ 2
                {selectedSub && (
                  <span className="text-sm text-purple-600">({selectedSub.name})</span>
                )}
              </h3>
              <form onSubmit={handleAddSub2} className="space-y-2">
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="ชื่อหมวดย่อยระดับ 2"
                  value={sub2Name}
                  onChange={e => setSub2Name(e.target.value)}
                  disabled={isLoading || !selectedSub}
                />
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  disabled={isLoading || !selectedSub || !sub2Name.trim()}
                >
                  <Plus size={16} />
                  เพิ่มหมวดย่อยระดับ 2
                </button>
              </form>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {sub2Categories.map(cat => (
                <div
                  key={cat.id}
                  className="p-3 rounded-lg border bg-white border-gray-200 hover:bg-gray-50 transition-all"
                >
                  {editingId === cat.id ? (
                    <div className="space-y-2">
                      <input
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        value={editingName}
                        onChange={e => setEditingName(e.target.value)}
                        disabled={isLoading}
                      />
                      <div className="flex gap-1">
                        <button
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                          onClick={handleUpdate}
                          disabled={isLoading}
                        >
                          <Save size={12} />
                          บันทึก
                        </button>
                        <button
                          className="bg-gray-400 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                          onClick={handleCancelEdit}
                        >
                          <X size={12} />
                          ยกเลิก
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{cat.name}</span>
                      <div className="flex gap-1">
                        <button
                          className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                          onClick={() => handleEdit(cat)}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="text-red-600 hover:bg-red-100 p-1 rounded"
                          onClick={() => handleDelete(cat.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">วิธีการใช้งาน:</h4>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. เพิ่มหมวดหลักในคอลัมน์แรก</li>
            <li>2. คลิกเลือกหมวดหลัก แล้วเพิ่มหมวดย่อยในคอลัมน์กลาง</li>
            <li>3. คลิกเลือกหมวดย่อย แล้วเพิ่มหมวดย่อยระดับ 2 ในคอลัมน์สุดท้าย</li>
            <li>4. ใช้ปุ่มแก้ไขและลบเพื่อจัดการหมวดหมู่</li>
          </ol>
        </div>
      </div>
    </AdminCardContainer>
  )
}

