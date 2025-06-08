'use client'

import { ReactNode } from 'react'
import UserMenu from './UserMenu'

/*
File: /components/header/Header.tsx
Version: 2.0 | 2025-06-04
note: Header กลาง (main site) สไตล์ modern, สีพื้นหลัง gradient ม่วง/navy, โลโก้/ชื่อเว็บซ้าย, UserMenu ขวา, responsive, เพิ่มเมนูได้ง่าย
*/

export default function Header(): ReactNode {
  return (
    <header className="w-full h-16 bg-gradient-to-r from-[#7376B4] to-[#544a8c] shadow flex items-center fixed top-0 left-0 z-50">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-6">
        {/* Logo/ชื่อเว็บ */}
        <div className="flex items-center gap-3 select-none">
          {/* (เปลี่ยนเป็นโลโก้ภาพได้) */}
          <span className="inline-block bg-white rounded-lg w-9 h-9"></span>
          <span className="text-white text-lg font-bold tracking-wide">sss-surplus-marketplace</span>
        </div>
        {/* (เพิ่มเมนูหลัก/slot ตรงนี้ได้ภายหลัง) */}
        <UserMenu />
      </div>
    </header>
  )
}
