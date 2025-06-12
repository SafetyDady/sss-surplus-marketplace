import { NextRequest, NextResponse } from 'next/server';
import { adminDb, getServerTimestamp } from '@/lib/firebase-admin';

// GET - ดึงรายการหัวข้อทั้งหมด
export async function GET() {
  try {
    const subjectsRef = adminDb.collection('contact_subjects');
    const querySnapshot = await subjectsRef.orderBy('order', 'asc').get();
    
    if (!querySnapshot.empty) {
      const subjects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return NextResponse.json({
        success: true,
        data: subjects
      });
    } else {
      // สร้างข้อมูลเริ่มต้น
      const defaultSubjects = [
        { id: '1', name: 'สอบถามสินค้า', active: true, order: 1 },
        { id: '2', name: 'สอบถามราคา', active: true, order: 2 },
        { id: '3', name: 'แจ้งปัญหา', active: true, order: 3 },
        { id: '4', name: 'ข้อเสนอแนะ', active: true, order: 4 },
        { id: '5', name: 'อื่นๆ', active: true, order: 5 }
      ];

      // บันทึกข้อมูลเริ่มต้นลง Firebase
      const batch = adminDb.batch();
      for (const subject of defaultSubjects) {
        const docRef = adminDb.collection('contact_subjects').doc(subject.id);
        batch.set(docRef, {
          ...subject,
          createdAt: getServerTimestamp(),
          updatedAt: getServerTimestamp()
        });
      }
      await batch.commit();
      
      return NextResponse.json({
        success: true,
        data: defaultSubjects
      });
    }
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch subjects'
    }, { status: 500 });
  }
}

// POST - เพิ่มหัวข้อใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json({
        success: false,
        error: 'Subject name is required'
      }, { status: 400 });
    }

    // หา order ถัดไป
    const subjectsRef = adminDb.collection('contact_subjects');
    const querySnapshot = await subjectsRef.get();
    const maxOrder = querySnapshot.docs.reduce((max, doc) => {
      const order = doc.data().order || 0;
      return order > max ? order : max;
    }, 0);

    // สร้าง ID ใหม่
    const newId = Date.now().toString();
    const docRef = adminDb.collection('contact_subjects').doc(newId);
    
    const newSubject = {
      name: name.trim(),
      active: true,
      order: maxOrder + 1,
      createdAt: getServerTimestamp(),
      updatedAt: getServerTimestamp()
    };

    await docRef.set(newSubject);

    return NextResponse.json({
      success: true,
      message: 'Subject added successfully',
      data: { 
        id: newId, 
        name: name.trim(),
        active: true,
        order: maxOrder + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error adding subject:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add subject'
    }, { status: 500 });
  }
}

// PUT - อัปเดตหัวข้อ
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, active, order } = body;

    if (!id || !name || name.trim() === '') {
      return NextResponse.json({
        success: false,
        error: 'Subject ID and name are required'
      }, { status: 400 });
    }

    const docRef = adminDb.collection('contact_subjects').doc(id);
    const updateData = {
      name: name.trim(),
      active: active !== undefined ? active : true,
      order: order || 1,
      updatedAt: getServerTimestamp()
    };

    await docRef.set(updateData, { merge: true });

    return NextResponse.json({
      success: true,
      message: 'Subject updated successfully',
      data: { 
        id, 
        name: name.trim(),
        active: active !== undefined ? active : true,
        order: order || 1,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error updating subject:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update subject'
    }, { status: 500 });
  }
}

// DELETE - ลบหัวข้อ
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Subject ID is required'
      }, { status: 400 });
    }

    const docRef = adminDb.collection('contact_subjects').doc(id);
    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subject:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete subject'
    }, { status: 500 });
  }
}

