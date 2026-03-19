import type { ReactNode } from "react";

interface AuthLayoutProps {
  readonly children: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="w-full min-h-screen client-layout-gradient relative overflow-hidden flex items-center justify-center py-12">
      <div className="absolute inset-0 auth-neuron-bg pointer-events-none"></div>
      <div className="absolute inset-0 auth-neuron-grid pointer-events-none"></div>
      <div className="w-full px-4 h-auto overflow-x-hidden relative z-10">{children}</div>
    </div>
  );
}

export default AuthLayout;
