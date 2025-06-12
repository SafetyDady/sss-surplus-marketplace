import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

// GET - ดึงรายการหัวข้อทั้งหมด
export async function GET() {
  try {
    const subjectsRef = collection(db, 'contact_subjects');
    const q = query(subjectsRef, orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
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
      for (const subject of defaultSubjects) {
        const docRef = doc(db, 'contact_subjects', subject.id);
        await setDoc(docRef, {
          ...subject,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      
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
    const subjectsRef = collection(db, 'contact_subjects');
    const querySnapshot = await getDocs(subjectsRef);
    const maxOrder = querySnapshot.docs.reduce((max, doc) => {
      const order = doc.data().order || 0;
      return order > max ? order : max;
    }, 0);

    // สร้าง ID ใหม่
    const newId = Date.now().toString();
    const docRef = doc(db, 'contact_subjects', newId);
    
    const newSubject = {
      name: name.trim(),
      active: true,
      order: maxOrder + 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(docRef, newSubject);

    return NextResponse.json({
      success: true,
      message: 'Subject added successfully',
      data: { id: newId, ...newSubject }
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

    const docRef = doc(db, 'contact_subjects', id);
    const updateData = {
      name: name.trim(),
      active: active !== undefined ? active : true,
      order: order || 1,
      updatedAt: serverTimestamp()
    };

    await setDoc(docRef, updateData, { merge: true });

    return NextResponse.json({
      success: true,
      message: 'Subject updated successfully',
      data: { id, ...updateData }
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

    const docRef = doc(db, 'contact_subjects', id);
    await deleteDoc(docRef);

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

