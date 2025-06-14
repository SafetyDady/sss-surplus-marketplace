import { NextRequest, NextResponse } from 'next/server';
import { adminDb, getServerTimestamp } from '@/lib/firebase-admin';

// GET - ดึงข้อมูล Vendor Section
export async function GET() {
  try {
    const docRef = adminDb.collection('vendor_content').doc('vendor_section');
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      return NextResponse.json({
        success: true,
        data: docSnap.data()
      });
    } else {
      // ส่งข้อมูลเริ่มต้น
      const defaultData = {
        title: "🤝 สนใจเป็น Vendor กับเรา?",
        subtitle: "เข้าร่วมเป็นพาร์ทเนอร์กับเราในการจำหน่ายสินค้า Surplus คุณภาพดี เพิ่มช่องทางขายและเพิ่มรายได้ของคุณ",
        features: [
          {
            icon: "🌟",
            title: "เข้าถึงลูกค้าใหม่",
            description: "เพิ่มฐานลูกค้าและขยายตลาด"
          },
          {
            icon: "💰",
            title: "เพิ่มรายได้",
            description: "สร้างรายได้เสริมจากสินค้าคงเหลือ"
          },
          {
            icon: "🚀",
            title: "ง่ายต่อการจัดการ",
            description: "ระบบจัดการที่ใช้งานง่าย"
          },
          {
            icon: "💎",
            title: "ความน่าเชื่อถือ",
            description: "แพลตฟอร์มที่มั่นคงและปลอดภัย"
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return NextResponse.json({
        success: true,
        data: defaultData
      });
    }
  } catch (error) {
    console.error('Error fetching vendor content:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch vendor content'
    }, { status: 500 });
  }
}

// PUT - อัปเดตข้อมูล Vendor Section
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subtitle, features } = body;

    // Validation
    if (!title || !subtitle || !features || !Array.isArray(features) || features.length !== 4) {
      return NextResponse.json({
        success: false,
        error: 'Title, subtitle, and 4 features are required'
      }, { status: 400 });
    }

    // Validate each feature
    for (const feature of features) {
      if (!feature.icon || !feature.title || !feature.description) {
        return NextResponse.json({
          success: false,
          error: 'Each feature must have icon, title, and description'
        }, { status: 400 });
      }
    }

    const docRef = adminDb.collection('vendor_content').doc('vendor_section');
    const updateData = {
      title,
      subtitle,
      features,
      updatedAt: getServerTimestamp()
    };

    await docRef.set(updateData, { merge: true });

    return NextResponse.json({
      success: true,
      message: 'Vendor content updated successfully',
      data: {
        title,
        subtitle,
        features,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error updating vendor content:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update vendor content'
    }, { status: 500 });
  }
}

