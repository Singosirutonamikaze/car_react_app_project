import type { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-900 via-blue-950 to-black overflow-auto flex items-center justify-center py-12">
      <div className="w-full px-4 h-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
