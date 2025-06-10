'use client'

import { useState } from 'react'
import VendorSidebar from "../../components/vendor/VendorSidebar"
import VendorHeader from "../../components/vendor/VendorHeader"

/*
File: /app/vendor/layout.tsx
Version: 3.0 | 2025-06-07
note:
- ปรับปรุง layout ให้เหมือนกับ Admin Layout
- Sidebar อยู่ระดับเดียวกับ Header
- รองรับ sidebar collapse/expand
- สอดคล้องกับ admin layout
*/

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-blue-50">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-50 h-screen transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-60'}`}>
        <VendorSidebar 
          collapsed={sidebarCollapsed}
          onToggle={setSidebarCollapsed}
        />
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-60'} min-h-0`}>
        {/* Header */}
        <div className={`fixed top-0 z-50 h-16 transition-all duration-300 ${sidebarCollapsed ? 'left-16 w-[calc(100vw-64px)]' : 'left-60 w-[calc(100vw-240px)]'}`}>
          <VendorHeader />
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

