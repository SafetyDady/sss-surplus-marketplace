'use client'

import Image from "next/image"

/*
File: /components/vendor/ProductGridCard.tsx
Version: 1.3 | 2025-06-03
note: ใช้ <Image /> จาก next/image เพื่อ optimize LCP, รองรับทั้ง URL และ blob, มี placeholder หากไม่มีภาพ
*/

type ProductGridCardProps = {
  product?: {
    name?: string
    price?: number
    mainImage?: File | string | null
  } | null
}

export default function ProductGridCard({ product }: ProductGridCardProps) {
  if (!product) {
    return (
      <div className="bg-white border rounded shadow-sm p-2 flex flex-col items-center w-full">
        <div className="aspect-square bg-gray-100 flex items-center justify-center rounded w-full mb-2 text-gray-400 text-sm">
          ไม่มีข้อมูลสินค้า
        </div>
        <div className="font-medium text-center">-</div>
        <div className="text-blue-700 font-bold text-center">- บาท</div>
      </div>
    )
  }

  let imageUrl = ""
  let isBlob = false
  if (product.mainImage instanceof File) {
    imageUrl = URL.createObjectURL(product.mainImage)
    isBlob = true
  } else if (typeof product.mainImage === "string" && product.mainImage.length > 0) {
    imageUrl = product.mainImage
    isBlob = imageUrl.startsWith("blob:")
  }

  return (
    <div className="bg-white border rounded shadow-sm p-2 flex flex-col items-center w-full">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={product.name || "ยังไม่มีชื่อสินค้า"}
          className="aspect-square object-cover rounded w-full mb-2"
          width={300}
          height={300}
          unoptimized={isBlob}
          // ถ้า url เป็น blob: ต้องใช้ unoptimized, ถ้าเป็น url ปกติจะ optimize อัตโนมัติ
        />
      ) : (
        <div className="aspect-square bg-gray-100 flex items-center justify-center rounded w-full mb-2 text-gray-400 text-sm">
          ไม่มีภาพตัวอย่าง
        </div>
      )}
      <div className="font-medium text-center">{product.name || "ชื่อสินค้า"}</div>
      <div className="text-blue-700 font-bold text-center">
        {product.price !== undefined ? product.price : 0} บาท
      </div>
    </div>
  )
}