// /app/user/layout.tsx

import UserHeader from "../../components/user/UserHeader"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header เฉพาะฝั่ง User */}
      <UserHeader />
      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full pt-8 px-4">
        {children}
      </main>
    </div>
  )
}

