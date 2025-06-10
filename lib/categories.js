import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  where 
} from 'firebase/firestore';
import { db } from './firebase';

// ดึงรายการหมวดหมู่ทั้งหมด
export async function getCategories() {
  try {
    const categoriesRef = collection(db, 'categories');
    const q = query(
      categoriesRef, 
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

// ดึงข้อมูลหมวดหมู่เฉพาะ
export async function getCategoryById(categoryId) {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    const categorySnap = await getDoc(categoryRef);

    if (!categorySnap.exists()) {
      throw new Error('Category not found');
    }

    return {
      id: categorySnap.id,
      ...categorySnap.data()
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
}

// เพิ่มหมวดหมู่ใหม่
export async function createCategory(categoryData) {
  try {
    const { name, displayName, icon } = categoryData;

    // Validation
    if (!name || !displayName || !icon) {
      throw new Error('Missing required fields: name, displayName, icon');
    }

    const newCategory = {
      name: name.trim(),
      displayName: displayName.trim(),
      icon: icon.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    const categoriesRef = collection(db, 'categories');
    const docRef = await addDoc(categoriesRef, newCategory);

    return {
      id: docRef.id,
      ...newCategory
    };
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

// อัปเดตหมวดหมู่
export async function updateCategory(categoryId, updateData) {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    
    // ตรวจสอบว่า category มีอยู่หรือไม่
    const categorySnap = await getDoc(categoryRef);
    if (!categorySnap.exists()) {
      throw new Error('Category not found');
    }

    const updatedData = {
      ...updateData,
      updatedAt: new Date()
    };

    await updateDoc(categoryRef, updatedData);

    // ดึงข้อมูลที่อัปเดตแล้ว
    const updatedCategorySnap = await getDoc(categoryRef);
    return {
      id: updatedCategorySnap.id,
      ...updatedCategorySnap.data()
    };
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

// ลบหมวดหมู่ (soft delete)
export async function deleteCategory(categoryId) {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    
    // ตรวจสอบว่า category มีอยู่หรือไม่
    const categorySnap = await getDoc(categoryRef);
    if (!categorySnap.exists()) {
      throw new Error('Category not found');
    }

    // Soft delete - เปลี่ยน isActive เป็น false
    await updateDoc(categoryRef, {
      isActive: false,
      deletedAt: new Date(),
      updatedAt: new Date()
    });

    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

// ลบหมวดหมู่ถาวร (hard delete)
export async function permanentDeleteCategory(categoryId) {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    
    // ตรวจสอบว่า category มีอยู่หรือไม่
    const categorySnap = await getDoc(categoryRef);
    if (!categorySnap.exists()) {
      throw new Error('Category not found');
    }

    await deleteDoc(categoryRef);
    return true;
  } catch (error) {
    console.error('Error permanently deleting category:', error);
    throw error;
  }
}

// ดึงหมวดหมู่สำหรับแสดงใน Landing Page
export async function getCategoriesForDisplay(limit = 10) {
  try {
    const categoriesRef = collection(db, 'categories');
    const q = query(
      categoriesRef, 
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const categories = [];
    let count = 0;
    
    querySnapshot.forEach((doc) => {
      if (count < limit) {
        categories.push({
          id: doc.id,
          ...doc.data()
        });
        count++;
      }
    });

    return categories;
  } catch (error) {
    console.error('Error fetching categories for display:', error);
    throw error;
  }
}

