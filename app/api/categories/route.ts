"use client";
import { NextResponse } from 'next/server'
import { db } from '../../../firebase/firebase'
import { collection, getDocs } from 'firebase/firestore'

/*
File: /app/api/categories/route.ts
Version: 1.1 | 2025-06-03
note: [Fix] ลบ req/error ที่ไม่ได้ใช้ (no-unused-vars) | API Route ดึงข้อมูลหมวดหมู่ (GET) | Mockup | พร้อมขยาย logic จริง
*/

export async function GET() {
  try {
    // ตัวอย่าง: ดึง category ทั้งหมด (Mockup)
    const snapshot = await getDocs(collection(db, 'categories'))
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ categories }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการโหลดข้อมูล' }, { status: 500 })
  }
}
