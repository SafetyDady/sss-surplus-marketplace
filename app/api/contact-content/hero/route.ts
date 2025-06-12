import { NextRequest, NextResponse } from 'next/server';
import { adminDb, getServerTimestamp } from '@/lib/firebase-admin';

// GET - ดึงข้อมูล Hero Section
export async function GET() {
  try {
    const docRef = adminDb.collection('contact_page_content').doc('hero_section');
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      return NextResponse.json({
        success: true,
        data: docSnap.data()
      });
    } else {
      // ส่งข้อมูลเริ่มต้น
      const defaultData = {
        title: "ติดต่อเรา",
        subtitle: "พร้อมให้บริการและตอบทุกข้อสงสัยเกี่ยวกับสินค้า Surplus คุณภาพดี",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return NextResponse.json({
        success: true,
        data: defaultData
      });
    }
  } catch (error) {
    console.error('Error fetching hero section:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch hero section data'
    }, { status: 500 });
  }
}

// PUT - อัปเดตข้อมูล Hero Section
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subtitle } = body;

    if (!title || !subtitle) {
      return NextResponse.json({
        success: false,
        error: 'Title and subtitle are required'
      }, { status: 400 });
    }

    const docRef = adminDb.collection('contact_page_content').doc('hero_section');
    const updateData = {
      title,
      subtitle,
      updatedAt: getServerTimestamp()
    };

    await docRef.set(updateData, { merge: true });

    return NextResponse.json({
      success: true,
      message: 'Hero section updated successfully',
      data: {
        title,
        subtitle,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error updating hero section:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update hero section'
    }, { status: 500 });
  }
}

