'use client'
import React, { useState } from "react"

/*
File: /components/admin/AssignRoleButton.tsx
Version: 1.0 | 2025-06-05
note:
- ปุ่ม dropdown สำหรับเปลี่ยน role
- ป้องกันแก้ไข admin role
- เปลี่ยน role ได้แบบ real-time
*/

type RoleType = "user" | "vendor" | "admin"

type Props = {
  role: RoleType
  onChange: (role: RoleType) => void
  disabled?: boolean
}

const roleOptions: { value: RoleType; label: string }[] = [
  { value: "user", label: "User" },
  { value: "vendor", label: "Vendor" },
  { value: "admin", label: "Admin" }
]

const AssignRoleButton: React.FC<Props> = ({ role, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block w-28">
      <button
        className={`w-full bg-gray-100 border border-gray-300 rounded-lg px-2 py-1 text-xs font-semibold text-gray-700 flex items-center justify-between transition ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-purple-500"}`}
        onClick={() => !disabled && setIsOpen(open => !open)}
        type="button"
        disabled={disabled}
      >
        <span>
          {roleOptions.find(r => r.value === role)?.label}
        </span>
        <svg className="w-4 h-4 ml-2 opacity-60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && !disabled && (
        <ul className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-20">
          {roleOptions.map(option => (
            <li key={option.value}>
              <button
                className={`w-full px-2 py-1 text-xs text-left rounded-lg ${option.value === role ? "bg-purple-100 font-semibold" : "hover:bg-purple-50"} transition`}
                onClick={() => {
                  setIsOpen(false)
                  onChange(option.value)
                }}
                disabled={option.value === "admin"}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AssignRoleButton
