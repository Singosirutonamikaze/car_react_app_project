import type { ReactNode } from "react";
import NavBarPresentation from "../ui/navbars/NavBarPresentation";

interface PresentationLayoutProps {
  activeItem?: string;
  children: ReactNode;
}

function PresentationLayout({ children, activeItem }: PresentationLayoutProps) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-900 via-blue-950 to-black overflow-auto">
      <NavBarPresentation activeItem={activeItem} />

      <div className="mt-15 w-full px-4 h-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  )
}

export default PresentationLayout
