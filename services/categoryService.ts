// /services/categoryService.ts
import { db } from "../firebase/firebase"
import { collection, getDocs } from "firebase/firestore"

/*
File: /services/categoryService.ts
Version 1.0 | 2025-06-03
note: ดึงหมวดหมู่สินค้าเป็น tree (main > sub > sub2) จาก Firestore
*/

// Type สำหรับ category tree
export interface CategoryNode {
  id: string
  name: string
  children?: CategoryNode[]
  parentId?: string | null
}

// ดึงข้อมูลแบบ flat แล้วสร้าง tree
export const getCategoryTree = async (): Promise<CategoryNode[]> => {
  const snapshot = await getDocs(collection(db, "categories"))
  const flat: CategoryNode[] = snapshot.docs.map(docItem => ({
    id: docItem.id,
    name: docItem.data().name,
    parentId: docItem.data().parentId || null,
  }))

  // สร้าง tree 3 ชั้น (main > sub > sub2)
  const map = new Map<string, CategoryNode>()
  flat.forEach(c => map.set(c.id, { ...c, children: [] }))

  // map parentId → children
  flat.forEach(c => {
    if (c.parentId) {
      const parent = map.get(c.parentId)
      if (parent) {
        parent.children!.push(map.get(c.id)!)
      }
    }
  })

  // return root (main category เท่านั้น)
  return Array.from(map.values()).filter(c => !c.parentId)
}

// --- MOCK DATA (ใช้ตอน local dev ถ้า Firestore ยังไม่มี category) ---
// export const getCategoryTree = async (): Promise<CategoryNode[]> => [
//   {
//     id: "main1",
//     name: "เหล็ก",
//     children: [
//       {
//         id: "sub1",
//         name: "เหล็กกล่อง",
//         children: [
//           { id: "sub2-1", name: "เหล็กกล่องดำ" },
//           { id: "sub2-2", name: "เหล็กกล่องแบน" },
//         ],
//       },
//       {
//         id: "sub2",
//         name: "เหล็กแผ่น",
//         children: [],
//       },
//     ],
//   },
//   {
//     id: "main2",
//     name: "สี",
//     children: [
//       {
//         id: "sub3",
//         name: "สีทาเหล็ก",
//         children: [],
//       },
//     ],
//   },
// ]

