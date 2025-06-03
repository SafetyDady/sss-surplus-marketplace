'use client'

/*
File: /components/vendor/ProductGridCard.tsx
Version: 1.2 | 2025-06-03
note: ป้องกัน product เป็น null/undefined และขึ้น placeholder ถ้าไม่มีภาพหลัก
*/

type ProductGridCardProps = {
  product?: {
    name?: string
    price?: number
    mainImage?: File | string | null
  } | null
}

export default function ProductGridCard({ product }: ProductGridCardProps) {
  // เช็คก่อนว่า product มีจริงไหม
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
  if (product.mainImage instanceof File) {
    imageUrl = URL.createObjectURL(product.mainImage)
  } else if (typeof product.mainImage === "string" && product.mainImage.length > 0) {
    imageUrl = product.mainImage
  }

  return (
    <div className="bg-white border rounded shadow-sm p-2 flex flex-col items-center w-full">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={product.name || "ยังไม่มีชื่อสินค้า"}
          className="aspect-square object-cover rounded w-full mb-2"
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
