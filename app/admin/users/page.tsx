'use client'

import UserTable from '../../../components/admin/UserTable'
import AdminCardContainer from '../../../components/common/AdminCardContainer'

/*
File: /app/admin/users/page.tsx
Version: 2.0 | 2025-06-07
note:
- เพจ User Management (Admin)
- ใช้ AdminCardContainer เพื่อให้ content อยู่ตรงกลาง
- ปรับปรุง layout ให้สอดคล้องกับหน้าอื่นๆ
*/

export default function AdminUserPage() {
  return (
    <AdminCardContainer>
      <UserTable />
    </AdminCardContainer>
  )
}

