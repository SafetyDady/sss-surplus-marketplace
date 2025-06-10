import { NextRequest, NextResponse } from 'next/server';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  deleteDoc,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';

// GET - ดึงรายการหมวดหมู่ทั้งหมด
export async function GET() {
  try {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return NextResponse.json({
      success: true,
      categories: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// POST - เพิ่มหมวดหมู่ใหม่
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, displayName, icon } = body;

    // Validation
    if (!name || !displayName || !icon) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          message: 'name, displayName, and icon are required' 
        },
        { status: 400 }
      );
    }

    // สร้าง category object
    const categoryData = {
      name: name.trim(),
      displayName: displayName.trim(),
      icon: icon.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    // เพิ่มลง Firestore
    const categoriesRef = collection(db, 'categories');
    const docRef = await addDoc(categoriesRef, categoryData);

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      category: {
        id: docRef.id,
        ...categoryData
      }
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create category',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

