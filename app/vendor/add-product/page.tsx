'use client'

import { useState, useRef } from "react"
import ProductForm from "../../../components/vendor/ProductForm"
import ProductPreviewCard from "../../../components/vendor/ProductPreviewCard"
import ProductGridCard from "../../../components/vendor/ProductGridCard"
import { db, storage } from "../../../firebase/firebase"
import { collection, doc, setDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

/*
File: /app/vendor/add-product/page.tsx
Version: 2.2 | 2025-06-03
note: แก้ปัญหา Firestore ไม่รับ field undefined (salePrice, อื่น ๆ), reset form หลังเพิ่มสินค้า
*/

function Toast({ message, show, onClose }: { message: string, show: boolean, onClose: () => void }) {
  return (
    <div
      className={`fixed top-6 right-6 z-50 px-5 py-3 rounded shadow-lg text-white font-semibold transition-all duration-300
        ${show ? "bg-green-600 opacity-100" : "opacity-0 pointer-events-none"}`}
      style={{ minWidth: 260 }}
      role="alert"
      aria-live="polite"
    >
      {message}
      <button className="ml-6 text-white/80" onClick={onClose}>ปิด</button>
    </div>
  )
}

export default function AddProductPage() {
  const [productData, setProductData] = useState<any>(null)
  const [submitted, setSubmitted] = useState(false)
  const [toastMsg, setToastMsg] = useState<string>("")
  const [showToast, setShowToast] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<any>(null)

  // real-time preview
  const handleFormChange = (data: any) => {
    setProductData(data)
  }

  // add product จริง
  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      // 1. สร้าง doc ใหม่ใน Firestore เพื่อได้ productId
      const productDocRef = doc(collection(db, "products"))
      const productId = productDocRef.id

      // 2. อัปโหลดรูปภาพไป storage (mainImage + extraImages)
      let mainImageUrl = ""
      if (data.mainImage instanceof File) {
        const mainImageRef = ref(storage, `products/${productId}/main.jpg`)
        await uploadBytes(mainImageRef, data.mainImage)
        mainImageUrl = await getDownloadURL(mainImageRef)
      }

      let extraImageUrls: string[] = []
      if (Array.isArray(data.extraImages)) {
        for (let i = 0; i < data.extraImages.length; i++) {
          const file = data.extraImages[i]
          if (file instanceof File) {
            const extraRef = ref(storage, `products/${productId}/extra_${i + 1}.jpg`)
            await uploadBytes(extraRef, file)
            const url = await getDownloadURL(extraRef)
            extraImageUrls.push(url)
          }
        }
      }

      // 3. Prepare ข้อมูลสำหรับบันทึกใน Firestore (ไม่ส่งไฟล์, ส่ง url แทน)
      const { mainImage, extraImages, ...rest } = data
      const productPayload: any = {
        ...rest,
        mainImageUrl,
        extraImageUrls,
        createdAt: new Date().toISOString(),
        active: data.active ?? true
      }

      // *** Fix: ลบ field ที่เป็น undefined ออก (Firestore ไม่ยอมรับ undefined)
      Object.keys(productPayload).forEach(key => {
        if (productPayload[key] === undefined) {
          delete productPayload[key]
        }
      })

      // 4. Save product
      await setDoc(productDocRef, productPayload)

      // 5. Reset ฟอร์ม+state
      setProductData(null)
      setSubmitted(true)
      if (formRef.current?.resetForm) {
        formRef.current.resetForm()
      }

      // 6. Toast แจ้งเตือน
      setToastMsg("✅ เพิ่มสินค้าเรียบร้อยแล้ว")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } catch (e) {
      setToastMsg("❌ เกิดข้อผิดพลาดในการเพิ่มสินค้า")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 4000)
      console.error("Add product error:", e)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-6 max-w-7xl mx-auto">
      <Toast
        message={toastMsg}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
      <div className="w-full lg:w-1/2">
        <ProductForm
          ref={formRef}
          onChange={handleFormChange}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <h2 className="font-bold text-lg mb-2">Preview สินค้า</h2>
        <ProductPreviewCard product={productData} />
        <h3 className="font-semibold text-base mt-4 mb-2">Preview แบบ Grid</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <ProductGridCard product={productData} />
          <ProductGridCard product={productData} />
        </div>
        {submitted && (
          <div className="text-green-700 font-bold mt-6">
            ✔️ เพิ่มสินค้าเรียบร้อยแล้ว
          </div>
        )}
      </div>
    </div>
  )
}
