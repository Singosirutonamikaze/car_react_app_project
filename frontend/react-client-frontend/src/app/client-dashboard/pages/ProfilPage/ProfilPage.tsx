import { FiUser } from "react-icons/fi";

import AuthenticatedContent from "../../components/AuthenticatedContent";
import PageHeader from "../../components/PageHeader";
import useAuth from "../../../../shared/hooks/auth";
import useUser from "../../../../shared/hooks/user";
import uploadService from "../../../../shared/services/upload";

function formatDate(value?: string): string {
  if (!value) {
    return "N/A";
  }

  try {
    return new Date(value).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "Date invalide";
  }
}

function ProfilPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const { enhancedUser, loading: dashboardLoading } = useUser();

  const currentUser = enhancedUser ?? user;
  const displayName = [currentUser?.name ?? "", currentUser?.surname ?? ""].join(" ").trim();
  const imageUrl = currentUser?.profileImageUrl ? uploadService.resolveImageUrl(currentUser.profileImageUrl) : "";

  return (
    <AuthenticatedContent isLoading={loading || dashboardLoading} isAuthenticated={isAuthenticated}>
      <section className="space-y-6">
        <PageHeader
          title="Profil"
          subtitle={`Bienvenue, ${displayName}`.trim()}
          icon={FiUser}
        />

        <div className="backdrop-blur-xl rounded-lg p-6 border client-theme-card client-theme-text-primary space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="rounded-lg border client-theme-card-soft p-4 flex flex-col items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={displayName || "Photo profil"}
                  className="h-24 w-24 rounded-full object-cover border client-surface"
                />
              ) : (
                <div className="h-24 w-24 rounded-full border client-theme-card-soft flex items-center justify-center client-theme-text-secondary text-xs">
                  Aucune photo
                </div>
              )}
            </div>

            <div className="rounded-lg border client-theme-card-soft p-4 lg:col-span-2">
              <p className="text-xs uppercase tracking-wide client-theme-text-secondary">Nom complet</p>
              <p className="client-theme-text-primary font-medium mt-1">{displayName || "-"}</p>
            </div>

            <div className="rounded-lg border client-theme-card-soft p-4">
              <p className="text-xs uppercase tracking-wide client-theme-text-secondary">Email</p>
              <p className="client-theme-text-primary font-medium mt-1 break-all">{currentUser?.email || "-"}</p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border client-theme-card-soft p-4">
              <p className="text-xs uppercase tracking-wide client-theme-text-secondary">Membre depuis</p>
              <p className="client-theme-text-primary font-medium mt-1">{formatDate(currentUser?.createdAt)}</p>
            </div>
            <div className="rounded-lg border client-theme-card-soft p-4">
              <p className="text-xs uppercase tracking-wide client-theme-text-secondary">Derniere mise a jour</p>
              <p className="client-theme-text-primary font-medium mt-1">{formatDate(currentUser?.updatedAt)}</p>
            </div>
            <div className="rounded-lg border client-theme-card-soft p-4">
              <p className="text-xs uppercase tracking-wide client-theme-text-secondary">Total commandes</p>
              <p className="client-theme-text-primary font-medium mt-1">{enhancedUser?.stats.totalCommandes ?? 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border client-theme-card-soft p-4">
              <p className="text-xs uppercase tracking-wide client-theme-text-secondary">Commandes en cours</p>
              <p className="client-theme-text-primary font-medium mt-1">{enhancedUser?.stats.commandesEnCours ?? 0}</p>
            </div>
            <div className="rounded-lg border client-theme-card-soft p-4">
              <p className="text-xs uppercase tracking-wide client-theme-text-secondary">Commandes livrees</p>
              <p className="client-theme-text-primary font-medium mt-1">{enhancedUser?.stats.commandesLivrees ?? 0}</p>
            </div>
            <div className="rounded-lg border client-theme-card-soft p-4">
              <p className="text-xs uppercase tracking-wide client-theme-text-secondary">Favoris</p>
              <p className="client-theme-text-primary font-medium mt-1">{enhancedUser?.stats.totalFavorites ?? 0}</p>
            </div>
          </div>

          <div className="rounded-lg border client-theme-card-soft p-4">
            <p className="text-xs uppercase tracking-wide client-theme-text-secondary">Derniere commande</p>
            {enhancedUser?.lastCommande ? (
              <p className="client-theme-text-primary font-medium mt-1">
                {enhancedUser.lastCommande.voiture?.marque ?? "Voiture"} {enhancedUser.lastCommande.voiture?.modele ?? ""}
                {" - "}
                {enhancedUser.lastCommande.statut}
                {" - "}
                {formatDate(enhancedUser.lastCommande.dateCommande)}
              </p>
            ) : (
              <p className="client-theme-text-primary font-medium mt-1">Aucune commande recente</p>
            )}
          </div>
        </div>
      </section>
    </AuthenticatedContent>
  );
}

export default ProfilPage;
