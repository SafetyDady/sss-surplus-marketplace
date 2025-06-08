'use client'

import { useState } from "react"
import { requestVendor } from "../../firebase/createUserInFirestore"

/*
File: /components/vendor/VendorRequestForm.tsx
Version: 1.1 | 2025-06-08
note: ฟอร์มขอสิทธิ์ vendor/partner พร้อมแนบไฟล์, update Firestore, สถานะ pending
- แก้ไข unused err variable
*/

export default function VendorRequestForm({ uid }: { uid: string }) {
  const [businessName, setBusinessName] = useState("")
  const [taxId, setTaxId] = useState("")
  const [docUrl, setDocUrl] = useState("") // สมมุติเป็นลิงก์ url
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await requestVendor(uid, {
        businessName,
        taxId,
        docs: [docUrl],
      })
      setSuccess(true)
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md p-6 mx-auto rounded shadow bg-white space-y-4">
      <h2 className="text-lg font-bold mb-2">สมัครเป็น Vendor / Partner</h2>
      <div>
        <label className="font-medium">ชื่อธุรกิจ *</label>
        <input
          className="input input-bordered w-full"
          value={businessName}
          onChange={e => setBusinessName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="font-medium">เลขประจำตัวผู้เสียภาษี (Tax ID) *</label>
        <input
          className="input input-bordered w-full"
          value={taxId}
          onChange={e => setTaxId(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="font-medium">URL เอกสาร/ใบอนุญาต (เช่น Google Drive, Link รูป) *</label>
        <input
          className="input input-bordered w-full"
          value={docUrl}
          onChange={e => setDocUrl(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? "กำลังส่งคำขอ..." : "ส่งคำขอเป็น Vendor"}
      </button>
      {success && (
        <div className="text-green-600 mt-2 font-bold">
          ✅ ส่งคำขอสำเร็จ! กรุณารอแอดมินอนุมัติ
        </div>
      )}
      {error && (
        <div className="text-red-600 mt-2">{error}</div>
      )}
    </form>
  )
}
