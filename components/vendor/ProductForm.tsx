'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect, useState, forwardRef, useImperativeHandle } from "react"
import { getCategoryTree } from "../../services/categoryService"

/*
File: /components/vendor/ProductForm.tsx
Version: 1.4 | 2025-06-03
Note:
- แก้ setValue tags: ไม่ใช้ any (เปลี่ยนเป็น string[])
- ปรับ logic preview รูป img ได้มาตรฐาน (ถ้าต้องการใช้ <Image /> เพิ่มเติม แจ้งได้)
- ยังมี ref resetForm & isSubmitting
*/

const productSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อสินค้า"),
  category: z.object({
    main: z.string().min(1, "เลือกหมวดหมู่หลัก"),
    sub: z.string().min(1, "เลือกหมวดหมู่ย่อย"),
    sub2: z.string().min(1, "เลือกหมวดหมู่ย่อยลึกสุด"),
  }),
  price: z.coerce.number().gt(0, "ราคาต้องมากกว่า 0"),
  salePrice: z.preprocess(
    (val) => val === "" || val == null ? undefined : Number(val),
    z.number().optional()
  ),
  stock: z.coerce.number().gt(0, "จำนวนในสต็อกต้องมากกว่า 0"),
  unit: z.string().min(1, "ระบุหน่วยสินค้า"),
  weight: z.coerce.number().gt(0, "น้ำหนักต้องมากกว่า 0"),
  size: z.object({
    width: z.coerce.number().gt(0, "กว้างต้องมากกว่า 0"),
    length: z.coerce.number().gt(0, "ยาวต้องมากกว่า 0"),
    height: z.coerce.number().gt(0, "สูงต้องมากกว่า 0"),
  }),
  description: z.string().min(1, "กรุณาระบุรายละเอียด").max(2000),
  mainImage: z
    .custom<File>((file) => file instanceof File && file.size > 0, {
      message: "กรุณาเลือกภาพหลัก",
    }),
  extraImages: z
    .array(z.any())
    .min(1, "ต้องมีภาพเพิ่มเติมอย่างน้อย 1 รูป")
    .max(4, "ใส่ได้สูงสุด 4 รูป"),
  SKU: z.string().optional(),
  brand: z.string().optional(),
  active: z.boolean().default(true),
  tags: z.array(z.string()).max(5, "Tag ได้สูงสุด 5 คำ").optional(),
})

type ProductFormType = z.infer<typeof productSchema>
interface CategoryNode {
  id: string
  name: string
  children?: CategoryNode[]
}

type ProductFormProps = {
  onSubmit?: (data: ProductFormType) => void
  onChange?: (data: ProductFormType) => void
  isSubmitting?: boolean
}

const ProductForm = forwardRef(function ProductForm(
  { onSubmit, onChange, isSubmitting = false }: ProductFormProps,
  ref
) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProductFormType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      active: true,
      tags: [],
      category: { main: "", sub: "", sub2: "" },
    },
  })

  const [categories, setCategories] = useState<CategoryNode[]>([])
  const [mainList, setMainList] = useState<CategoryNode[]>([])
  const [subList, setSubList] = useState<CategoryNode[]>([])
  const [sub2List, setSub2List] = useState<CategoryNode[]>([])

  useEffect(() => {
    getCategoryTree().then(tree => {
      setCategories(tree)
      setMainList(tree)
    })
  }, [])

  useEffect(() => {
    const mainId = watch("category.main")
    const subId = watch("category.sub")
    const selectedMain = categories.find(c => c.id === mainId)
    setSubList(selectedMain?.children || [])
    if (!selectedMain || !mainId) {
      setValue("category.sub", "")
      setValue("category.sub2", "")
      setSub2List([])
      return
    }
    const selectedSub = selectedMain.children?.find(c => c.id === subId)
    setSub2List(selectedSub?.children || [])
    if (!selectedSub || !subId) {
      setValue("category.sub2", "")
    }
  }, [watch("category.main"), watch("category.sub"), categories, setValue])

  function handleTagsInput(e: React.ChangeEvent<HTMLInputElement>) {
    const tagsArr = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
    setValue("tags", tagsArr) // **แก้: ไม่ใช้ any**
  }

  function handleMainImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null
    setValue("mainImage", file, { shouldValidate: true })
  }

  // ส่งข้อมูลให้ parent ทุกครั้งที่ฟอร์มเปลี่ยน (real-time)
  useEffect(() => {
    const subscription = watch((value) => {
      if (onChange) onChange(value as ProductFormType)
    })
    return () => subscription.unsubscribe()
  }, [watch, onChange])

  // Expose resetForm method via ref
  useImperativeHandle(ref, () => ({
    resetForm: () => reset()
  }))

  const extraImages = watch("extraImages") as File[] | undefined

  return (
    <form onSubmit={handleSubmit(data => { if (onSubmit) onSubmit(data) })} className="space-y-4">

      {/* ชื่อสินค้า */}
      <div>
        <label className="block font-semibold">ชื่อสินค้า *</label>
        <input {...register("name")} className="input input-bordered w-full" />
        {errors.name && <div className="text-red-600 text-sm">{errors.name.message}</div>}
      </div>
      {/* หมวดหมู่ */}
      <div>
        <label className="block font-semibold">หมวดหมู่ *</label>
        <div className="flex gap-2">
          <select {...register("category.main")} className="input input-bordered">
            <option value="">-- เลือกหมวดหมู่หลัก --</option>
            {mainList.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <select {...register("category.sub")} className="input input-bordered" disabled={subList.length === 0}>
            <option value="">-- เลือกหมวดหมู่ย่อย --</option>
            {subList.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <select {...register("category.sub2")} className="input input-bordered" disabled={sub2List.length === 0}>
            <option value="">-- เลือกหมวดหมู่ย่อยลึกสุด --</option>
            {sub2List.map(s2 => (
              <option key={s2.id} value={s2.id}>{s2.name}</option>
            ))}
          </select>
        </div>
        {(errors.category?.main || errors.category?.sub || errors.category?.sub2) && (
          <div className="text-red-600 text-sm">
            {errors.category?.main?.message || errors.category?.sub?.message || errors.category?.sub2?.message}
          </div>
        )}
      </div>
      {/* ราคา */}
      <div>
        <label className="block font-semibold">ราคา (บาท) *</label>
        <input type="number" step="0.01" {...register("price")} className="input input-bordered w-full" />
        {errors.price && <div className="text-red-600 text-sm">{errors.price.message}</div>}
      </div>
      {/* ราคาพิเศษ */}
      <div>
        <label className="block font-semibold">ราคาพิเศษ</label>
        <input type="number" step="0.01" {...register("salePrice")} className="input input-bordered w-full" />
        {errors.salePrice && <div className="text-red-600 text-sm">{errors.salePrice.message}</div>}
      </div>
      {/* จำนวนในสต็อก */}
      <div>
        <label className="block font-semibold">จำนวนในสต็อก *</label>
        <input type="number" {...register("stock")} className="input input-bordered w-full" />
        {errors.stock && <div className="text-red-600 text-sm">{errors.stock.message}</div>}
      </div>
      {/* หน่วย */}
      <div>
        <label className="block font-semibold">หน่วย *</label>
        <input {...register("unit")} className="input input-bordered w-full" placeholder="เช่น ชิ้น, ม้วน" />
        {errors.unit && <div className="text-red-600 text-sm">{errors.unit.message}</div>}
      </div>
      {/* น้ำหนัก */}
      <div>
        <label className="block font-semibold">น้ำหนัก (kg) *</label>
        <input type="number" step="0.01" {...register("weight")} className="input input-bordered w-full" />
        {errors.weight && <div className="text-red-600 text-sm">{errors.weight.message}</div>}
      </div>
      {/* ขนาด (กว้าง/ยาว/สูง) */}
      <div>
        <label className="block font-semibold">ขนาด (ซม.) *</label>
        <div className="flex gap-2">
          <input type="number" step="0.01" {...register("size.width")} className="input input-bordered w-24" placeholder="กว้าง" />
          <input type="number" step="0.01" {...register("size.length")} className="input input-bordered w-24" placeholder="ยาว" />
          <input type="number" step="0.01" {...register("size.height")} className="input input-bordered w-24" placeholder="สูง" />
        </div>
        {(errors.size?.width || errors.size?.length || errors.size?.height) && (
          <div className="text-red-600 text-sm">
            {errors.size?.width?.message || errors.size?.length?.message || errors.size?.height?.message}
          </div>
        )}
      </div>
      {/* รายละเอียดสินค้า */}
      <div>
        <label className="block font-semibold">รายละเอียดสินค้า *</label>
        <textarea {...register("description")} className="input input-bordered w-full" rows={3} maxLength={2000} />
        {errors.description && <div className="text-red-600 text-sm">{errors.description.message}</div>}
      </div>
      {/* ภาพหลัก */}
      <div>
        <label className="block font-semibold">ภาพหลัก *</label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleMainImageChange}
          className="input input-bordered w-full"
        />
        {errors.mainImage && <div className="text-red-600 text-sm">{errors.mainImage.message}</div>}
      </div>
      {/* ภาพเพิ่มเติม */}
      <div>
        <label className="block font-semibold">ภาพเพิ่มเติม (สูงสุด 4 รูป) *</label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          name="extraImages"
          onChange={e => {
            const files = e.target.files ? Array.from(e.target.files).slice(0, 4) : []
            setValue("extraImages", files, { shouldValidate: true })
          }}
          className="input input-bordered w-full"
        />
        {extraImages && extraImages.length > 0 && (
          <div className="flex gap-2 mt-2">
            {extraImages.map((file, idx) =>
              file && typeof file === "object" && "name" in file ? (
                <div key={idx} className="w-16 h-16 border rounded overflow-hidden flex flex-col items-center">
                  <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                  <div className="text-xs text-gray-500 truncate">{file.name}</div>
                </div>
              ) : null
            )}
          </div>
        )}
        {errors.extraImages && <div className="text-red-600 text-sm">{errors.extraImages.message}</div>}
      </div>
      {/* รหัสสินค้า (SKU) */}
      <div>
        <label className="block font-semibold">รหัสสินค้า</label>
        <input {...register("SKU")} className="input input-bordered w-full" />
      </div>
      {/* แบรนด์ */}
      <div>
        <label className="block font-semibold">แบรนด์</label>
        <input {...register("brand")} className="input input-bordered w-full" />
      </div>
      {/* tags */}
      <div>
        <label className="block font-semibold">Tags (ใส่ได้สูงสุด 5 คำ, คั่นด้วย comma , )</label>
        <input
          className="input input-bordered w-full"
          placeholder="เช่น เหล็ก,ราคาถูก,โรงงาน"
          onChange={handleTagsInput}
        />
      </div>
      {/* สถานะเปิด/ปิด */}
      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("active")} defaultChecked />
        <label>เปิดใช้งานสินค้า</label>
      </div>
      {/* Submit */}
      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "กำลังเพิ่มสินค้า..." : "ยืนยันเพิ่มสินค้า"}
      </button>
    </form>
  )
})

export default ProductForm
