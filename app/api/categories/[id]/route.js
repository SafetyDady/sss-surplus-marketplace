import { NextRequest, NextResponse } from 'next/server';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

// GET - ดึงข้อมูลหมวดหมู่เฉพาะ
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const categoryRef = doc(db, 'categories', id);
    const categorySnap = await getDoc(categoryRef);

    if (!categorySnap.exists()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Category not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      category: {
        id: categorySnap.id,
        ...categorySnap.data()
      }
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch category',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT - อัปเดตหมวดหมู่
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, displayName, icon, isActive } = body;

    // ตรวจสอบว่า category มีอยู่หรือไม่
    const categoryRef = doc(db, 'categories', id);
    const categorySnap = await getDoc(categoryRef);

    if (!categorySnap.exists()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Category not found' 
        },
        { status: 404 }
      );
    }

    // เตรียมข้อมูลที่จะอัปเดต
    const updateData = {
      updatedAt: new Date()
    };

    if (name !== undefined) updateData.name = name.trim();
    if (displayName !== undefined) updateData.displayName = displayName.trim();
    if (icon !== undefined) updateData.icon = icon.trim();
    if (isActive !== undefined) updateData.isActive = isActive;

    // อัปเดตใน Firestore
    await updateDoc(categoryRef, updateData);

    // ดึงข้อมูลที่อัปเดตแล้ว
    const updatedCategorySnap = await getDoc(categoryRef);

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      category: {
        id: updatedCategorySnap.id,
        ...updatedCategorySnap.data()
      }
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update category',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// DELETE - ลบหมวดหมู่
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // ตรวจสอบว่า category มีอยู่หรือไม่
    const categoryRef = doc(db, 'categories', id);
    const categorySnap = await getDoc(categoryRef);

    if (!categorySnap.exists()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Category not found' 
        },
        { status: 404 }
      );
    }

    // ลบจาก Firestore
    await deleteDoc(categoryRef);

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete category',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

