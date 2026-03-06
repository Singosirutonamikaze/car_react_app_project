import type { ReactNode } from "react";
import NavBarDashboard from "../ui/navbars/NavBarDashboard";
import SideBar from "../ui/SideBar";

interface ClientLayoutProps {
  children: ReactNode;
}

function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-900 via-blue-950 to-black overflow-hidden flex">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <NavBarDashboard />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default ClientLayout;