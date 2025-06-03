'use client'

import { ReactNode } from 'react'
import UserMenu from './UserMenu'

/*
File: /components/header/Header.tsx
Version: 1.0 | 2025-06-02
note: Header หลักของเว็บ ใช้ร่วมกับทุกหน้า | รองรับ UserMenu (login/logout) | สามารถเพิ่มโลโก้/เมนู/ฟีเจอร์อื่นได้ภายหลัง
*/

export default function Header(): ReactNode {
  return (
    <header className="w-full bg-white border-b shadow-sm fixed top-0 left-0 z-50 h-16 flex items-center">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center px-4">
        {/* Logo (เปลี่ยนเป็นโลโก้บริษัทได้) */}
        <div className="text-xl font-bold text-blue-700 tracking-tight select-none">
          sss-surplus-marketplace
        </div>
        <UserMenu />
      </div>
    </header>
  )
}
