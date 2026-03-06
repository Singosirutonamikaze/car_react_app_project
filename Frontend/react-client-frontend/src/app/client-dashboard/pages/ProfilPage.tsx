import { FiAlertOctagon } from "react-icons/fi";
import ClientLayout from "../../../shared/components/layouts/ClientLayout"
import useAuth from "../../../shared/hooks/useAuth";
import Loading from "../../../shared/components/ui/Loading";

function ProfilPage() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
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
            Veuillez vous connecter pour accéder au tableau de bord.
          </span>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <h1>Profil</h1>
      <p>Bienvenue, {user?.name} {user?.surname}</p>
    </ClientLayout>
  )
}

export default ProfilPage
