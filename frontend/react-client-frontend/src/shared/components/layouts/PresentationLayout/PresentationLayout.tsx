import type { ReactNode } from "react";

import NavBarPresentation from "../../ui/navbars/NavBarPresentation";

interface PresentationLayoutProps {
  readonly activeItem?: string;
  readonly children: ReactNode;
}

function PresentationLayout({ children, activeItem }: PresentationLayoutProps) {
  return (
    <div className="w-full min-h-screen client-layout-gradient overflow-auto client-theme-text-primary">
      <NavBarPresentation activeItem={activeItem} />
      <div className="mt-15 w-full px-4 h-auto overflow-x-hidden">{children}</div>
    </div>
  );
}

export default PresentationLayout;
