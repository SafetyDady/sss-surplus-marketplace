"use client";
import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../firebase/firebase'
import { collection, getDocs } from 'firebase/firestore'

/*
File: /app/api/categories/route.ts
Version: 1.0 | 2025-06-02
note: API Route ดึงข้อมูลหมวดหมู่ (GET) | ตัวอย่าง Mockup | พร้อมขยาย logic จริงในอนาคต
*/

export async function GET(req: NextRequest) {
  try {
    // ตัวอย่าง: ดึง category ทั้งหมด (Mockup)
    const snapshot = await getDocs(collection(db, 'categories'))
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ categories }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการโหลดข้อมูล' }, { status: 500 })
  }
}
