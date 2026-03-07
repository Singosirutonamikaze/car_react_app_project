import { FiAlertOctagon } from "react-icons/fi";
import type { ReactNode } from "react";

import ClientLayout from "../../../../shared/components/layouts/ClientLayout";
import Loading from "../../../../shared/components/ui/Loading";

interface AuthenticatedContentProps {
  readonly isLoading: boolean;
  readonly isAuthenticated: boolean;
  readonly children: ReactNode;
}

function AuthenticatedContent({ isLoading, isAuthenticated, children }: AuthenticatedContentProps) {
  if (isLoading) {
    return (
      <ClientLayout>
        <div className="flex justify-center items-center w-full h-auto">
          <Loading />
        </div>
      </ClientLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <ClientLayout>
        <div className="flex flex-col justify-center items-center w-full h-screen p-8 text-center">
          <div className="text-9xl text-red-500 mb-4">
            <FiAlertOctagon />
          </div>
          <span className="text-xl text-red-500">
            Veuillez vous connecter pour acceder au tableau de bord.
          </span>
        </div>
      </ClientLayout>
    );
  }

  return <ClientLayout>{children}</ClientLayout>;
}

export default AuthenticatedContent;
