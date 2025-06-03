'use client'

/*
File: /components/vendor/ProductPreviewCard.tsx
Version: 1.2 | 2025-06-03
note: Preview สินค้าขนาดใหญ่ (ดึงรูปจาก mainImage, มี placeholder ถ้าไม่มี)
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
  if (product.mainImage instanceof File) {
    imageUrl = URL.createObjectURL(product.mainImage)
  } else if (typeof product.mainImage === "string" && product.mainImage.length > 0) {
    imageUrl = product.mainImage
  }

  return (
    <div className="w-full max-w-[300px] bg-white border rounded shadow p-4 flex flex-col items-center">
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
      <div className="text-blue-700 font-bold text-center">{product.price !== undefined ? product.price : 0} บาท</div>
      <div className="text-gray-400 text-sm text-center">
        {product.description || "รายละเอียดสินค้าแสดงตัวอย่าง"}
      </div>
    </div>
  )
}
