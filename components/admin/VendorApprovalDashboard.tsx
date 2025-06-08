'use client'

import { useEffect, useState } from "react"
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"
import { setVendorStatus } from "../../firebase/createUserInFirestore"
import AdminCardContainer from "../common/AdminCardContainer"
import { CheckCircle, XCircle, Clock, FileText, Building, Mail, User, Calendar } from "lucide-react"

/*
File: /components/admin/VendorApprovalDashboard.tsx
Version: 2.0 | 2025-06-07
note: 
- ปรับปรุง visual design ให้สอดคล้องกับ AdminCardContainer
- เพิ่ม icons และ modern UI elements
- ปรับปรุง responsive design และ user experience
*/

type VendorProfile = {
  businessName: string
  taxId: string
  docs: string[]
  requestDate: string
}

type VendorUser = {
  uid: string
  email: string
  displayName?: string
  vendorProfile?: VendorProfile
  status: "pending" | "approved" | "rejected"
}

export default function VendorApprovalDashboard() {
  const [pendingVendors, setPendingVendors] = useState<VendorUser[]>([])
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState<string>("")
  const [processingUid, setProcessingUid] = useState<string | null>(null)

  // โหลด vendors ที่ pending
  async function fetchPendingVendors() {
    setLoading(true)
    try {
      const db = getFirestore()
      const q = query(
        collection(db, "users"),
        where("role", "==", "vendor"),
        where("status", "==", "pending")
      )
      const snapshot = await getDocs(q)
      const data: VendorUser[] = []
      snapshot.forEach(doc => {
        const userData = doc.data() as Omit<VendorUser, 'uid'>
        data.push({ uid: doc.id, ...userData })
      })
      setPendingVendors(data)
    } catch (error) {
      console.error("Error fetching vendors:", error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPendingVendors()
  }, [])

  // Approve/Reject
  async function handleAction(uid: string, approve: boolean) {
    setProcessingUid(uid)
    try {
      await setVendorStatus(uid, approve)
      setActionMsg(approve ? "✅ อนุมัติ Vendor สำเร็จ" : "❌ ปฏิเสธ Vendor สำเร็จ")
      await fetchPendingVendors()
      setTimeout(() => setActionMsg(""), 3000)
    } catch {
      setActionMsg("❌ เกิดข้อผิดพลาด กรุณาลองใหม่")
      setTimeout(() => setActionMsg(""), 3000)
    }
    setProcessingUid(null)
  }

  return (
    <AdminCardContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Clock className="text-orange-500" size={28} />
            อนุมัติ Vendor / Partner
          </h2>
          <p className="text-gray-600">
            รายการคำขอสิทธิ์ Vendor ที่รออนุมัติ
          </p>
        </div>

        {/* Action Message */}
        {actionMsg && (
          <div className={`text-center p-3 rounded-lg ${
            actionMsg.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 
            'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {actionMsg}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        ) : pendingVendors.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">ไม่มีคำขอใหม่</h3>
            <p className="text-gray-600">ไม่มี Vendor ที่รออนุมัติในขณะนี้</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 border-b font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        ผู้ขอ
                      </div>
                    </th>
                    <th className="text-left p-4 border-b font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Building size={16} />
                        ธุรกิจ
                      </div>
                    </th>
                    <th className="text-left p-4 border-b font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <FileText size={16} />
                        เอกสาร
                      </div>
                    </th>
                    <th className="text-left p-4 border-b font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        วันที่ขอ
                      </div>
                    </th>
                    <th className="text-center p-4 border-b font-semibold text-gray-700">
                      การจัดการ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingVendors.map(vendor => (
                    <tr key={vendor.uid} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 border-b">
                        <div>
                          <div className="font-medium text-gray-900">
                            {vendor.displayName || 'ไม่ระบุชื่อ'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail size={12} />
                            {vendor.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b">
                        <div>
                          <div className="font-medium text-gray-900">
                            {vendor.vendorProfile?.businessName || 'ไม่ระบุ'}
                          </div>
                          {vendor.vendorProfile?.taxId && (
                            <div className="text-sm text-gray-500">
                              เลขประจำตัวผู้เสียภาษี: {vendor.vendorProfile.taxId}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 border-b">
                        <div className="space-y-1">
                          {vendor.vendorProfile?.docs?.map((url, i) => (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                            >
                              <FileText size={12} />
                              เอกสาร {i + 1}
                            </a>
                          )) || (
                            <span className="text-gray-400 text-sm">ไม่มีเอกสาร</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 border-b">
                        <div className="text-sm text-gray-600">
                          {vendor.vendorProfile?.requestDate || 'ไม่ระบุ'}
                        </div>
                      </td>
                      <td className="p-4 border-b">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1 disabled:opacity-50"
                            onClick={() => handleAction(vendor.uid, true)}
                            disabled={processingUid === vendor.uid}
                          >
                            <CheckCircle size={14} />
                            อนุมัติ
                          </button>
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1 disabled:opacity-50"
                            onClick={() => handleAction(vendor.uid, false)}
                            disabled={processingUid === vendor.uid}
                          >
                            <XCircle size={14} />
                            ปฏิเสธ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {pendingVendors.map(vendor => (
                <div key={vendor.uid} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                  {/* User Info */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {vendor.displayName || 'ไม่ระบุชื่อ'}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail size={12} />
                        {vendor.email}
                      </p>
                    </div>
                    <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Clock size={10} />
                      รออนุมัติ
                    </div>
                  </div>

                  {/* Business Info */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Building size={16} className="text-gray-600" />
                      <span className="font-medium text-gray-700">ข้อมูลธุรกิจ</span>
                    </div>
                    <p className="text-sm text-gray-900">
                      {vendor.vendorProfile?.businessName || 'ไม่ระบุชื่อธุรกิจ'}
                    </p>
                    {vendor.vendorProfile?.taxId && (
                      <p className="text-xs text-gray-500 mt-1">
                        เลขประจำตัวผู้เสียภาษี: {vendor.vendorProfile.taxId}
                      </p>
                    )}
                  </div>

                  {/* Documents */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={16} className="text-gray-600" />
                      <span className="font-medium text-gray-700">เอกสารแนบ</span>
                    </div>
                    <div className="space-y-1">
                      {vendor.vendorProfile?.docs?.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <FileText size={12} />
                          เอกสาร {i + 1}
                        </a>
                      )) || (
                        <span className="text-gray-400 text-sm">ไม่มีเอกสารแนบ</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1 disabled:opacity-50"
                      onClick={() => handleAction(vendor.uid, true)}
                      disabled={processingUid === vendor.uid}
                    >
                      <CheckCircle size={14} />
                      อนุมัติ
                    </button>
                    <button
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1 disabled:opacity-50"
                      onClick={() => handleAction(vendor.uid, false)}
                      disabled={processingUid === vendor.uid}
                    >
                      <XCircle size={14} />
                      ปฏิเสธ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">สรุป</h4>
          <p className="text-sm text-blue-700">
            มีคำขอสิทธิ์ Vendor ทั้งหมด <span className="font-bold">{pendingVendors.length}</span> รายการที่รออนุมัติ
          </p>
        </div>
      </div>
    </AdminCardContainer>
  )
}

