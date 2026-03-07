import { useEffect, type ReactNode } from "react";

import SideBar from "../../ui/SideBar";
import NavBarDashboard from "../../ui/navbars/NavBarDashboard";
import { applyStoredClientTheme } from "../../../utils";

interface ClientLayoutProps {
  readonly children: ReactNode;
}

function ClientLayout({ children }: ClientLayoutProps) {
  useEffect(() => {
    applyStoredClientTheme();
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden flex client-layout-bg">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <NavBarDashboard />
        <main className="flex-1 overflow-y-auto overscroll-contain p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export default ClientLayout;
