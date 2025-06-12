import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// GET - ดึงข้อมูลติดต่อ
export async function GET() {
  try {
    const docRef = doc(db, 'contact_info', 'company_contact');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return NextResponse.json({
        success: true,
        data: docSnap.data()
      });
    } else {
      // ส่งข้อมูลเริ่มต้น
      const defaultData = {
        phones: {
          office: "02-123-4567",
          mobile: "089-123-4567"
        },
        emails: {
          general: "info@ssssupply.com",
          sales: "sales@ssssupply.com",
          support: "support@ssssupply.com"
        },
        social: {
          line: "@ssssupply",
          facebook: "MTP Supply Thailand"
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      return NextResponse.json({
        success: true,
        data: defaultData
      });
    }
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch contact info'
    }, { status: 500 });
  }
}

// PUT - อัปเดตข้อมูลติดต่อ
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { phones, emails, social } = body;

    // Validation
    if (!phones?.office || !phones?.mobile || 
        !emails?.general || !emails?.sales || !emails?.support ||
        !social?.line || !social?.facebook) {
      return NextResponse.json({
        success: false,
        error: 'All contact information fields are required'
      }, { status: 400 });
    }

    const docRef = doc(db, 'contact_info', 'company_contact');
    const updateData = {
      phones,
      emails,
      social,
      updatedAt: serverTimestamp()
    };

    await setDoc(docRef, updateData, { merge: true });

    return NextResponse.json({
      success: true,
      message: 'Contact info updated successfully',
      data: updateData
    });
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update contact info'
    }, { status: 500 });
  }
}

