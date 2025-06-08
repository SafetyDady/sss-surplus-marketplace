'use client'

import { useState } from "react"
import AdminHeader from "../../components/admin/AdminHeader"
import AdminSidebar from "../../components/admin/AdminSidebar"

/*
File: /app/admin/layout.tsx
Version: 6.0 | 2025-06-07
note:
- ปรับปรุง responsive design สำหรับ sidebar ยุบ/ขยาย
- แก้ไข layout ให้ลงตัวและ responsive กับ sidebar state
- เพิ่ม state management สำหรับ sidebar collapse
*/

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-green-50">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-50 h-screen transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-60'}`}>
        <AdminSidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-60'} min-h-0`}>
        {/* Header */}
        <div className={`fixed top-0 z-50 h-16 transition-all duration-300 ${sidebarCollapsed ? 'left-16 w-[calc(100vw-64px)]' : 'left-60 w-[calc(100vw-240px)]'}`}>
          <AdminHeader />
        </div>
        
        {/* Main Content Area */}
        <main className="flex-1 flex items-center justify-center pt-16 px-4 py-6">
          <div className="w-full max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

