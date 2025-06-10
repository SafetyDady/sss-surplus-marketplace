'use client'

/*
File: /components/layout/AdminHeader.tsx
Version: 3.0 | 2025-06-04
note: Header กลาง gradient ม่วง/navy เต็มจอ, container max-w-6xl, โลโก้, search, submit, social, เรียบง่าย production
*/

export default function AdminHeader() {
  return (
    <header className="w-full h-16 bg-gradient-to-r from-[#7376B4] to-[#544a8c] shadow flex items-center">
      <div className="w-full max-w-6xl mx-auto flex items-center gap-6 px-6">
        {/* Logo + ชื่อระบบ */}
        <div className="flex items-center gap-2 mr-4">
          <span className="inline-block bg-white rounded-lg w-9 h-9"></span>
          <span className="text-white text-xl font-bold tracking-wide">freebie <span className="font-light">SUPPLY</span></span>
        </div>
        {/* Search bar */}
        <div className="flex-1">
          <input
            type="text"
            className="px-4 py-2 rounded bg-[#6365a6] bg-opacity-40 border border-transparent focus:border-[#a3a3da] outline-none text-white w-72"
            placeholder="Search"
          />
        </div>
        {/* ปุ่ม submit + social */}
        <div className="flex items-center gap-2">
          <button className="bg-[#5B5FC7] hover:bg-[#7177c6] text-white px-4 py-2 rounded font-medium transition text-sm">
            + Submit
          </button>
          {/* ตัวอย่าง social icon: Facebook */}
          <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#8186c9] hover:bg-[#a7abdf] text-white transition">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.56v14.91A4.56 4.56 0 0 1 19.44 24H4.56A4.56 4.56 0 0 1 0 19.47V4.53A4.56 4.56 0 0 1 4.53 0h14.91A4.56 4.56 0 0 1 24 4.56zM17.51 8.53h-2.09V7.23c0-.49.33-.6.56-.6h1.49V4.22l-2.05-.01c-2.29 0-2.81 1.71-2.81 2.81v1.51H9.12V12h1.48v6.2h2.82V12h1.81l.28-2.45z"/></svg>
          </a>
        </div>
      </div>
    </header>
  )
}
