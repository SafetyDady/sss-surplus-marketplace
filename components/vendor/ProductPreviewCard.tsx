'use client'

import Image from "next/image"

/*
File: /components/vendor/ProductPreviewCard.tsx
Version: 1.3 | 2025-06-03
note: ใช้ <Image /> จาก next/image เพื่อ optimize LCP, รองรับทั้ง URL และ blob, มี placeholder หากไม่มีภาพ
*/

type ProductPreviewCardProps = {
  product?: {
    name?: string
    price?: number
    description?: string
    mainImage?: File | string | null
  } | null
}

export default function ProductPreviewCard({ product }: ProductPreviewCardProps) {
  if (!product) {
    return (
      <div className="w-full max-w-[300px] bg-white border rounded shadow p-4 flex flex-col items-center">
        <div className="aspect-square bg-gray-100 flex items-center justify-center rounded w-full mb-2 text-gray-400 text-sm">
          ไม่มีข้อมูลสินค้า
        </div>
        <div className="font-medium text-center">-</div>
        <div className="text-blue-700 font-bold text-center">- บาท</div>
        <div className="text-gray-400 text-sm text-center">-</div>
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
    <div className="w-full max-w-[300px] bg-white border rounded shadow p-4 flex flex-col items-center">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={product.name || "ยังไม่มีชื่อสินค้า"}
          className="aspect-square object-cover rounded w-full mb-2"
          width={400}
          height={400}
          unoptimized={isBlob}
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
      <div className="text-gray-400 text-sm text-center">
        {product.description || "รายละเอียดสินค้าแสดงตัวอย่าง"}
      </div>
    </div>
  )
}
