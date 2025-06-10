'use client'

/*
File: /components/user/UserHeader.tsx
Version: 1.0 | 2025-06-04
note: Header user เฉพาะ section user, โทน clean, logo, ชื่อ, โปรไฟล์, responsive
*/

export default function UserHeader() {
  return (
    <header className="w-full h-16 bg-white shadow flex items-center">
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between px-6">
        {/* Logo + ชื่อเว็บ */}
        <div className="flex items-center gap-3">
          <span className="inline-block bg-[#8268fa] rounded-lg w-8 h-8"></span>
          <span className="text-[#5B5FC7] text-xl font-bold tracking-wide">sss-surplus-marketplace</span>
        </div>
        {/* ปุ่มโปรไฟล์ */}
        <div>
          <button className="bg-[#ecebfd] text-[#8268fa] font-bold px-4 py-1 rounded-full shadow hover:bg-[#d6d3fb] transition">
            My Account
          </button>
        </div>
      </div>
    </header>
  )
}
