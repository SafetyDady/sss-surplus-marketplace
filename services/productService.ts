// /services/productService.ts

import { db } from '../firebase/firebase'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  DocumentData,
} from 'firebase/firestore'

/*
File: /services/productService.ts
Version: 1.1 | 2025-06-02
note: CRUD สินค้า เชื่อม Firestore จริง | รองรับ owner/vendorId, createdAt, updatedAt | ใช้กับ vendor/admin
*/

export interface ProductDoc {
  id?: string
  name: string
  price: number
  unit: string
  size: string
  stock: number
  mainImageUrl: string
  extraImageUrls?: string[]
  description: string
  category: string
  vendorId: string   // uid ของเจ้าของสินค้า
  createdAt?: any
  updatedAt?: any
}

// READ - Get all products
export const getProducts = async (): Promise<ProductDoc[]> => {
  const snapshot = await getDocs(collection(db, 'products'))
  return snapshot.docs.map(docItem => ({
    id: docItem.id,
    ...docItem.data(),
  } as ProductDoc))
}

// READ - Get products by vendor
export const getProductsByVendor = async (vendorId: string): Promise<ProductDoc[]> => {
  const q = query(collection(db, 'products'), where('vendorId', '==', vendorId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(docItem => ({
    id: docItem.id,
    ...docItem.data(),
  } as ProductDoc))
}

// CREATE - Add new product
export const addProduct = async (data: Omit<ProductDoc, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(collection(db, 'products'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

// UPDATE - Update product by id
export const updateProduct = async (id: string, data: Partial<ProductDoc>) => {
  await updateDoc(doc(db, 'products', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

// DELETE - Delete product by id
export const deleteProduct = async (id: string) => {
  await deleteDoc(doc(db, 'products', id))
}

// READ - Get product by id
export const getProductById = async (id: string): Promise<ProductDoc | null> => {
  const ref = doc(db, 'products', id)
  const snap = await getDoc(ref)
  if (snap.exists()) return { id: snap.id, ...snap.data() } as ProductDoc
  return null
}
