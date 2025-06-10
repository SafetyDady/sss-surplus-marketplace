'use client'

import { useState } from "react"
import {
  ChevronLeft, Home, PlusSquare, Package, ClipboardList,
  Wallet, MessageCircle, Settings, User
} from "lucide-react"

/*
File: /components/vendor/VendorSidebar.tsx
Version: 4.0 | 2025-06-07
note: 
- ลบ logo และข้อความ "Vendor" ออก
- เหลือเฉพาะปุ่ม toggle เท่านั้น
- ปรับปรุงให้สอดคล้องกับ AdminSidebar
*/

const menu = [
  { label: "Dashboard", icon: <Home size={20} />, href: "/vendor/dashboard" },
  { label: "Add Product", icon: <PlusSquare size={20} />, href: "/vendor/add-product" },
  { label: "My Products", icon: <Package size={20} />, href: "/vendor/products" },
  { label: "Orders", icon: <ClipboardList size={20} />, href: "/vendor/orders" },
  { label: "Wallet/Statement", icon: <Wallet size={20} />, href: "/vendor/wallet" },
  { label: "Chat / Support", icon: <MessageCircle size={20} />, href: "/vendor/messages" },
  { label: "Profile / Setting", icon: <User size={20} />, href: "/vendor/profile" },
  { label: "Vendor Setting", icon: <Settings size={20} />, href: "/vendor/settings" },
]

interface VendorSidebarProps {
  collapsed?: boolean
  onToggle?: (collapsed: boolean) => void
}

export default function VendorSidebar({ collapsed = false, onToggle }: VendorSidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(collapsed)
  
  const isCollapsed = onToggle ? collapsed : internalCollapsed

  const handleToggle = () => {
    if (onToggle) {
      onToggle(!collapsed)
    } else {
      setInternalCollapsed(!internalCollapsed)
    }
  }

  return (
    <aside
      className={`
        h-full
        bg-gradient-to-b from-[#3B82F6] via-[#1E40AF] to-[#1E3A8A] text-white
        flex flex-col transition-all duration-300
        ${isCollapsed ? "w-16" : "w-60"}
        shadow-lg
      `}
    >
      {/* Toggle Button Only */}
      <div className="flex items-center justify-end w-full px-4 py-4 border-b border-white/10 h-16">
        <button
          className="p-2 rounded-full hover:bg-white/20 text-white transition"
          onClick={handleToggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          type="button"
        >
          <ChevronLeft className={`w-6 h-6 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
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
              hover:bg-[#2563EB] hover:bg-opacity-90
              group
              ${isCollapsed ? "justify-center" : ""}
            `}
            title={isCollapsed ? item.label : undefined}
          >
            <span className="shrink-0">{item.icon}</span>
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </a>
        ))}
      </nav>

      {/* Footer Profile */}
      <div className={`px-4 py-4 flex items-center gap-2 border-t border-white/10 ${isCollapsed ? "justify-center" : ""}`}>
        <div className="bg-black/30 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
          V
        </div>
        {!isCollapsed && <span className="text-sm opacity-70">Vendor</span>}
      </div>
    </aside>
  )
}

