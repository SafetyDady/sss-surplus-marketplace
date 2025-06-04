'use client'

import Image from "next/image"
import { useEffect, useState } from "react"
import { getCategoryTree } from "../../services/categoryService"

/*
File: /components/vendor/ProductPreviewCard.tsx
Version: 4.1 | 2025-06-04
Note:
- FIX: no any, ใช้ type เฉพาะจุด, แก้ prefer-const
*/

type SizeType = string | { width?: number; length?: number; height?: number; [key: string]: unknown }
type CategoryValue = { main: string; sub: string; sub2: string }

type ProductPreviewCardProps = {
  product?: {
    name?: string
    sku?: string
    price?: number
    mainImage?: File | string | null
    extraImages?: (File | string | null)[]
    category?: CategoryValue
    size?: SizeType
    weight?: number
    stock?: number
    description?: string
    delivery?: string
    unit?: string
    brand?: string
  } | null
}

interface CategoryNode {
  id: string
  name: string
  children?: CategoryNode[]
}

const getImageUrl = (img: File | string | null | undefined): { url: string; isBlob: boolean } => {
  if (!img) return { url: "", isBlob: false }
  if (img instanceof File) return { url: URL.createObjectURL(img), isBlob: true }
  if (typeof img === "string") return { url: img, isBlob: img.startsWith("blob:") }
  return { url: "", isBlob: false }
}

function renderSize(size?: SizeType): string {
  if (!size) return "-"
  if (typeof size === "string") return size
  const { width, length, height } = size
  const parts: (number | undefined)[] = []
  if (width !== undefined) parts.push(width)
  if (length !== undefined) parts.push(length)
  if (height !== undefined) parts.push(height)
  return parts.length ? `${parts.join("x")} Cm.` : "-"
}

// --- robust recursive lookup ---
function findCategoryNameById(categoryId: string | undefined, tree: CategoryNode[]): string | undefined {
  if (!categoryId || !tree || tree.length === 0) return undefined
  for (const node of tree) {
    if (node.id === categoryId) return node.name
    if (node.children && node.children.length > 0) {
      const found = findCategoryNameById(categoryId, node.children)
      if (found) return found
    }
  }
  return undefined
}

function parseDescription(desc: string): string[] {
  if (!desc) return []
  return desc
    .split(/\n|•|;|\r/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
}

export default function ProductPreviewCard({ product }: ProductPreviewCardProps) {
  const {
    name = "ชื่อสินค้า",
    sku = "-",
    price = 0,
    mainImage,
    extraImages = [],
    category,
    size,
    weight,
    stock,
    description = "รายละเอียดสินค้าแสดงตัวอย่าง",
    delivery = "-",
    unit = "-",
    brand = "-"
  } = product ?? {}

  // --- หมวดหมู่ (lookup tree) robust ---
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([])
  const [loadingCategory, setLoadingCategory] = useState(true)

  useEffect(() => {
    getCategoryTree().then(tree => {
      setCategoryTree(tree)
      setLoadingCategory(false)
    })
  }, [])

  // recursive lookup name
  const mainCategoryName = findCategoryNameById(category?.main, categoryTree)
  const subCategoryName = findCategoryNameById(category?.sub, categoryTree)
  const sub2CategoryName = findCategoryNameById(category?.sub2, categoryTree)

  // --- รูปหลัก + Thumbnail: 5 ช่อง (รวมภาพหลัก) ---
  const allImages: (File | string | null)[] = [mainImage, ...extraImages].slice(0, 5).map(img => img ?? null)
  const [mainIdx, setMainIdx] = useState(0)
  useEffect(() => {
    setMainIdx(0)
  }, [mainImage])
  const currentImage = allImages[mainIdx]
  const { url: mainImageUrl, isBlob: mainIsBlob } = getImageUrl(currentImage)
  const thumbnailList = Array.from({ length: 5 }).map((_, i) =>
    allImages[i] ? getImageUrl(allImages[i]) : { url: "", isBlob: false }
  )
  const descList = parseDescription(description)

  return (
    <div className="w-full rounded-2xl shadow p-8 flex flex-col gap-3 bg-white border h-full justify-center">
      {/* Main section */}
      <div className="flex flex-col md:flex-row gap-8 w-full h-full justify-center items-start pt-2">
        {/* Image + Detail (ซ้าย) */}
        <div className="flex flex-col w-full md:w-1/2 justify-start h-full">
          <div className="bg-gray-100 border rounded-xl flex items-center justify-center w-full aspect-[16/9] max-h-[320px] mb-3">
            {mainImageUrl ? (
              <Image
                src={mainImageUrl}
                alt={name}
                className="object-cover w-full h-full rounded-xl"
                width={512}
                height={288}
                unoptimized={mainIsBlob}
              />
            ) : (
              <span className="text-gray-400 text-lg">ไม่มีภาพตัวอย่าง</span>
            )}
          </div>
          {/* Thumbnail 5 ช่อง */}
          <div className="flex gap-2 w-full justify-center mt-3 mb-2">
            {thumbnailList.map((thumb, idx) =>
              thumb.url ? (
                <button
                  key={idx}
                  type="button"
                  className={`w-14 h-14 rounded border-2 flex items-center justify-center ${mainIdx === idx ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-200"}`}
                  onClick={() => setMainIdx(idx)}
                  tabIndex={0}
                >
                  <Image
                    src={thumb.url}
                    alt={`thumbnail ${idx + 1}`}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full rounded"
                    unoptimized={thumb.isBlob}
                  />
                </button>
              ) : (
                <div
                  key={idx}
                  className="w-14 h-14 rounded border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 bg-gray-50"
                >
                  <span className="text-xs">+</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Product detail (ขวา) */}
        <div className="flex-1 flex flex-col gap-2 min-w-0 w-full md:w-1/2 justify-start h-full">
          <div className="text-xl font-semibold mb-1 break-words">{name}</div>
          <div className="mb-1">
            <div className="text-gray-500 text-sm mb-0.5">รหัสสินค้า: {sku || "-"}</div>
            <div className="text-gray-500 text-sm">แบรนด์: {brand || "-"}</div>
          </div>
          <div className="flex flex-col gap-1 text-base mb-1">
            <div>
              <span className="font-semibold text-gray-700">หมวดหมู่:</span>
              {loadingCategory
                ? <span className="ml-1 text-gray-400">กำลังโหลด...</span>
                : (mainCategoryName || subCategoryName || sub2CategoryName)
                  ? <span className="ml-1">
                      {[mainCategoryName, subCategoryName, sub2CategoryName].filter(Boolean).join(' > ')}
                    </span>
                  : <span className="ml-1 text-red-500">ไม่พบหมวดหมู่</span>
              }
            </div>
            <div><span className="font-semibold text-gray-700">ก.ย.ส:</span> {renderSize(size)}</div>
            <div><span className="font-semibold text-gray-700">น้ำหนัก:</span> {weight ? `${weight} kg.` : '-'}</div>
            <div><span className="font-semibold text-gray-700">การขนส่ง:</span> {delivery}</div>
            <div><span className="font-semibold text-gray-700">คงเหลือ :</span> {stock !== undefined ? `${stock} ${unit}` : '-'}</div>
            <div>
              <span className="font-semibold text-gray-700">ราคา:</span>{" "}
              <span className="text-blue-700 font-bold text-2xl">฿{price.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex gap-4 mt-2 mb-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow min-w-[100px] font-semibold text-base h-9">
              ซื้อเลย
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl shadow min-w-[100px] font-semibold text-base h-9">
              ใส่ตะกร้า
            </button>
          </div>
        </div>
      </div>
      {/* กรอบ "รายละเอียดสินค้า" ข้ามแนวซ้าย-ขวา */}
      <div className="w-full mt-2">
        <div className="font-semibold mb-2 text-base">รายละเอียดสินค้า</div>
        <div className="border border-gray-300 rounded-lg px-4 py-2 w-full">
          {descList.length > 1 ? (
            <ul className="list-disc ml-5 text-gray-700 text-base">
              {descList.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          ) : (
            <div className="text-gray-700 text-base whitespace-pre-line">{description}</div>
          )}
        </div>
      </div>
    </div>
  )
}
