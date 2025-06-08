'use client'

import AssignRoleButton from './AssignRoleButton'

/*
File: /components/admin/UserTable.tsx
Version: 3.0 | 2025-06-07
note:
- ลบ container ออกเพื่อใช้ AdminCardContainer จาก parent
- ปรับปรุง responsive design และ modern styling
- เพิ่ม AssignRoleButton ที่ปรับปรุงแล้ว
- เพิ่ม icons และ better UX
*/

export default function UserTable() {
  const users = [
    { id: 1, name: "Somchai Jaidee", email: "somchai@company.com", role: "user" as const, status: "Pending" },
    { id: 2, name: "Jeab Vendor", email: "jeab@vendor.com", role: "vendor" as const, status: "Active" },
    { id: 3, name: "Admin One", email: "admin@sssmarket.com", role: "admin" as const, status: "Active" },
    { id: 4, name: "Sun Smith", email: "sun@sssmarket.com", role: "user" as const, status: "Pending" },
  ]

  function statusColor(status: string) {
    if (status === "Active") return "bg-green-100 text-green-700 border-green-200"
    if (status === "Pending") return "bg-yellow-100 text-yellow-700 border-yellow-200"
    return "bg-gray-100 text-gray-700 border-gray-200"
  }

  const handleRoleChange = (userId: number, newRole: string) => {
    console.log(`Changing user ${userId} role to ${newRole}`)
    // TODO: Implement Firebase role change
  }

  const handleApproveVendor = (userId: number) => {
    console.log(`Approving user ${userId} as vendor`)
    // TODO: Implement vendor approval
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">User Management</h2>
        <p className="text-gray-600">จัดการผู้ใช้งานและสิทธิ์การเข้าถึง</p>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-4 border-b font-semibold text-gray-700">Name</th>
              <th className="text-left p-4 border-b font-semibold text-gray-700">Email</th>
              <th className="text-center p-4 border-b font-semibold text-gray-700">Role</th>
              <th className="text-center p-4 border-b font-semibold text-gray-700">Status</th>
              <th className="text-center p-4 border-b font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 border-b">
                  <div className="font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="p-4 border-b">
                  <div className="text-gray-600">{user.email}</div>
                </td>
                <td className="p-4 border-b text-center">
                  <AssignRoleButton
                    role={user.role}
                    onChange={(newRole) => handleRoleChange(user.id, newRole)}
                  />
                </td>
                <td className="p-4 border-b text-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 border-b text-center">
                  {user.status === "Pending" ? (
                    <button 
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                      onClick={() => handleApproveVendor(user.id)}
                    >
                      Approve as Vendor
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {users.map(user => (
          <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            {/* User Info */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusColor(user.status)}`}>
                {user.status}
              </span>
            </div>

            {/* Role */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Role:</span>
              <AssignRoleButton
                role={user.role}
                onChange={(newRole) => handleRoleChange(user.id, newRole)}
              />
            </div>

            {/* Action */}
            {user.status === "Pending" && (
              <div className="pt-2">
                <button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-medium transition"
                  onClick={() => handleApproveVendor(user.id)}
                >
                  Approve as Vendor
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">สรุป</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-blue-700">{users.length}</div>
            <div className="text-blue-600">ผู้ใช้ทั้งหมด</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-green-700">{users.filter(u => u.status === 'Active').length}</div>
            <div className="text-green-600">Active</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-yellow-700">{users.filter(u => u.status === 'Pending').length}</div>
            <div className="text-yellow-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-purple-700">{users.filter(u => u.role === 'admin').length}</div>
            <div className="text-purple-600">Admin</div>
          </div>
        </div>
      </div>
    </div>
  )
}

