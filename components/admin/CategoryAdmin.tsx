'use client'

import { useEffect, useState } from 'react'
import { db } from '../../firebase/firebase'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'

/*
File: /components/admin/CategoryAdmin.tsx
Version: 3.2 | 2025-06-03
note: [Fix] Remove unused eslint-disable directive | Clean ESLint | Confirmed safe to replace
UI 3 Column (main/sub/sub2) แยก CRUD แต่ละระดับ | เลือก main > sub > sub2 | ใช้งานเหมือน Shopee/Lazada
*/

type Category = {
  id: string
  name: string
  parentId: string | null
}

export default function CategoryAdmin() {
  const [categories, setCategories] = useState<Category[]>([])
  const [mainName, setMainName] = useState('')
  const [subName, setSubName] = useState('')
  const [sub2Name, setSub2Name] = useState('')

  const [selectedMain, setSelectedMain] = useState<Category | null>(null)
  const [selectedSub, setSelectedSub] = useState<Category | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // โหลด category ทั้งหมด
  const fetchCategories = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, 'categories'))
      setCategories(
        snap.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          parentId: doc.data().parentId || null,
        }))
      )
    } catch {
      setError('เกิดข้อผิดพลาด')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // CRUD Main
  const handleAddMain = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mainName.trim()) return
    setLoading(true)
    try {
      await addDoc(collection(db, 'categories'), { name: mainName.trim(), parentId: null })
      setMainName('')
      await fetchCategories()
    } catch {
      setError('เพิ่ม main ไม่สำเร็จ')
    }
    setLoading(false)
  }
  // CRUD Sub
  const handleAddSub = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subName.trim() || !selectedMain) return
    setLoading(true)
    try {
      await addDoc(collection(db, 'categories'), { name: subName.trim(), parentId: selectedMain.id })
      setSubName('')
      await fetchCategories()
    } catch {
      setError('เพิ่ม sub ไม่สำเร็จ')
    }
    setLoading(false)
  }
  // CRUD Sub2
  const handleAddSub2 = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sub2Name.trim() || !selectedSub) return
    setLoading(true)
    try {
      await addDoc(collection(db, 'categories'), { name: sub2Name.trim(), parentId: selectedSub.id })
      setSub2Name('')
      await fetchCategories()
    } catch {
      setError('เพิ่ม sub2 ไม่สำเร็จ')
    }
    setLoading(false)
  }
  // ลบ (ลบลูกทั้งหมด)
  const handleDelete = async (id: string) => {
    setLoading(true)
    try {
      await deleteDoc(doc(db, 'categories', id))
      // ลบ sub/sub2 ทุกตัวที่ parentId === id (recursive)
      for (const cat of categories.filter(cat => cat.parentId === id)) {
        await handleDelete(cat.id)
      }
      // รีเซ็ต selection ถ้าลบ selection
      if (selectedMain && selectedMain.id === id) setSelectedMain(null)
      if (selectedSub && selectedSub.id === id) setSelectedSub(null)
      await fetchCategories()
    } catch {
      setError('ลบไม่สำเร็จ')
    }
    setLoading(false)
  }
  // Edit
  const handleEdit = (cat: Category) => {
    setEditingId(cat.id)
    setEditingName(cat.name)
  }
  const handleUpdate = async () => {
    if (!editingId || !editingName.trim()) return
    setLoading(true)
    try {
      await updateDoc(doc(db, 'categories', editingId), {
        name: editingName.trim(),
      })
      setEditingId(null)
      setEditingName('')
      await fetchCategories()
    } catch {
      setError('แก้ไขไม่สำเร็จ')
    }
    setLoading(false)
  }

  // แยกแต่ละ level
  const mainCategories = categories.filter(cat => cat.parentId === null)
  const subCategories = selectedMain
    ? categories.filter(cat => cat.parentId === selectedMain.id)
    : []
  const sub2Categories = selectedSub
    ? categories.filter(cat => cat.parentId === selectedSub.id)
    : []

  return (
    <div className="bg-white p-4 rounded shadow max-w-[900px] mx-auto">
      <h2 className="text-lg font-bold mb-4">Admin: จัดการหมวดหมู่ (3 Column Tree)</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main */}
        <div>
          <form onSubmit={handleAddMain} className="flex gap-2 mb-2">
            <input
              className="border rounded p-2 flex-1"
              placeholder="เพิ่มหมวดหลัก"
              value={mainName}
              onChange={e => setMainName(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-blue-700 text-white px-3 rounded hover:bg-blue-800"
              disabled={loading}
            >
              เพิ่ม
            </button>
          </form>
          <div className="font-semibold mb-2">หมวดหลัก</div>
          <ul className="divide-y">
            {mainCategories.map(cat =>
              editingId === cat.id ? (
                <li key={cat.id} className="flex items-center gap-2 py-1">
                  <input
                    className="border rounded p-1 flex-1"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    disabled={loading}
                  />
                  <button className="bg-green-600 text-white px-2 rounded" onClick={handleUpdate}>บันทึก</button>
                  <button className="bg-gray-300 px-2 rounded" onClick={() => setEditingId(null)}>ยกเลิก</button>
                </li>
              ) : (
                <li
                  key={cat.id}
                  className={`flex items-center gap-2 py-1 cursor-pointer ${selectedMain && selectedMain.id === cat.id ? 'bg-blue-100' : ''}`}
                  onClick={() => setSelectedMain(cat)}
                >
                  <span className="flex-1">{cat.name}</span>
                  <button className="bg-yellow-300 px-2 rounded" onClick={ev => { ev.stopPropagation(); handleEdit(cat); }}>แก้ไข</button>
                  <button className="bg-red-600 text-white px-2 rounded" onClick={ev => { ev.stopPropagation(); handleDelete(cat.id); }}>ลบ</button>
                </li>
              )
            )}
          </ul>
        </div>
        {/* Sub */}
        <div>
          <form onSubmit={handleAddSub} className="flex gap-2 mb-2">
            <input
              className="border rounded p-2 flex-1"
              placeholder="เพิ่มหมวดย่อย"
              value={subName}
              onChange={e => setSubName(e.target.value)}
              disabled={loading || !selectedMain}
            />
            <button
              type="submit"
              className="bg-blue-700 text-white px-3 rounded hover:bg-blue-800"
              disabled={loading || !selectedMain}
            >
              เพิ่ม
            </button>
          </form>
          <div className="font-semibold mb-2">หมวดย่อย</div>
          <ul className="divide-y">
            {subCategories.map(cat =>
              editingId === cat.id ? (
                <li key={cat.id} className="flex items-center gap-2 py-1">
                  <input
                    className="border rounded p-1 flex-1"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    disabled={loading}
                  />
                  <button className="bg-green-600 text-white px-2 rounded" onClick={handleUpdate}>บันทึก</button>
                  <button className="bg-gray-300 px-2 rounded" onClick={() => setEditingId(null)}>ยกเลิก</button>
                </li>
              ) : (
                <li
                  key={cat.id}
                  className={`flex items-center gap-2 py-1 cursor-pointer ${selectedSub && selectedSub.id === cat.id ? 'bg-blue-100' : ''}`}
                  onClick={() => setSelectedSub(cat)}
                >
                  <span className="flex-1">{cat.name}</span>
                  <button className="bg-yellow-300 px-2 rounded" onClick={ev => { ev.stopPropagation(); handleEdit(cat); }}>แก้ไข</button>
                  <button className="bg-red-600 text-white px-2 rounded" onClick={ev => { ev.stopPropagation(); handleDelete(cat.id); }}>ลบ</button>
                </li>
              )
            )}
          </ul>
        </div>
        {/* Sub2 */}
        <div>
          <form onSubmit={handleAddSub2} className="flex gap-2 mb-2">
            <input
              className="border rounded p-2 flex-1"
              placeholder="เพิ่ม sub2"
              value={sub2Name}
              onChange={e => setSub2Name(e.target.value)}
              disabled={loading || !selectedSub}
            />
            <button
              type="submit"
              className="bg-blue-700 text-white px-3 rounded hover:bg-blue-800"
              disabled={loading || !selectedSub}
            >
              เพิ่ม
            </button>
          </form>
          <div className="font-semibold mb-2">sub2</div>
          <ul className="divide-y">
            {sub2Categories.map(cat =>
              editingId === cat.id ? (
                <li key={cat.id} className="flex items-center gap-2 py-1">
                  <input
                    className="border rounded p-1 flex-1"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    disabled={loading}
                  />
                  <button className="bg-green-600 text-white px-2 rounded" onClick={handleUpdate}>บันทึก</button>
                  <button className="bg-gray-300 px-2 rounded" onClick={() => setEditingId(null)}>ยกเลิก</button>
                </li>
              ) : (
                <li key={cat.id} className="flex items-center gap-2 py-1">
                  <span className="flex-1">{cat.name}</span>
                  <button className="bg-yellow-300 px-2 rounded" onClick={ev => { ev.stopPropagation(); handleEdit(cat); }}>แก้ไข</button>
                  <button className="bg-red-600 text-white px-2 rounded" onClick={ev => { ev.stopPropagation(); handleDelete(cat.id); }}>ลบ</button>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
