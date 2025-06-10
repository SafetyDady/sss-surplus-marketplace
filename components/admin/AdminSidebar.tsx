'use client'

import {
  ChevronLeft, Home, Users, Store, Package, Tag,
  ListChecks, Settings, BarChart4
} from "lucide-react"

/*
File: /components/admin/AdminSidebar.tsx
Version: 6.1 | 2025-06-08
note: 
- ลบ unused useState import
- ลบ logo และข้อความ "sss SUPPLY" ออก
- เหลือเฉพาะปุ่ม toggle เท่านั้น
- ปรับปรุงให้ sidebar ดูเรียบง่ายและไม่งง
*/

const menu = [
  { label: "Dashboard", icon: <Home size={20} />, href: "/admin/dashboard" },
  { label: "User Management", icon: <Users size={20} />, href: "/admin/users" },
  { label: "Vendor Approval", icon: <Store size={20} />, href: "/admin/vendors" },
  { label: "Product Management", icon: <Package size={20} />, href: "/admin/products" },
  { label: "Category Management", icon: <Tag size={20} />, href: "/admin/categories" },
  { label: "Order Management", icon: <ListChecks size={20} />, href: "/admin/orders" },
  { label: "Report / Log", icon: <BarChart4 size={20} />, href: "/admin/reports" },
  { label: "System Setting", icon: <Settings size={20} />, href: "/admin/settings" },
]

interface AdminSidebarProps {
  collapsed?: boolean
  onToggle?: (collapsed: boolean) => void
}

export default function AdminSidebar({ collapsed = false, onToggle }: AdminSidebarProps) {
  const handleToggle = () => {
    onToggle?.(!collapsed)
  }

  return (
    <aside
      className={`
        h-full
        bg-gradient-to-b from-[#787cb6] via-[#47458f] to-[#2e294e] text-white
        flex flex-col transition-all duration-300
        ${collapsed ? "w-16" : "w-60"}
        shadow-lg
      `}
    >
      {/* Toggle Button Only */}
      <div className="flex items-center justify-end w-full px-4 py-4 border-b border-white/10 h-16">
        <button
          className="p-2 rounded-full hover:bg-[#a7abdf33] text-white transition"
          onClick={handleToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          type="button"
        >
          <ChevronLeft className={`w-6 h-6 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 flex flex-col mt-2 gap-1 px-2">
        {menu.map(item => (
          <a
            key={item.label}
            href={item.href}
            className={`
              flex items-center gap-3 px-3 py-3 rounded-lg
              font-medium text-sm cursor-pointer
              transition-all duration-150
              hover:bg-[#7165b6] hover:bg-opacity-90
              group
              ${collapsed ? "justify-center" : ""}
            `}
            title={collapsed ? item.label : undefined}
          >
            <span className="shrink-0">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </a>
        ))}
      </nav>

      {/* Footer Profile */}
      <div className={`px-4 py-4 flex items-center gap-2 border-t border-white/10 ${collapsed ? "justify-center" : ""}`}>
        <div className="bg-black/30 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
          A
        </div>
        {!collapsed && <span className="text-sm opacity-70">Admin</span>}
      </div>
    </aside>
  )
}

