import { useEffect, useMemo, useState } from "react";
import { FiHeart, FiTrash2 } from "react-icons/fi";

import AuthenticatedContent from "../../components/AuthenticatedContent";
import EmptyState from "../../components/EmptyState";
import PageHeader from "../../components/PageHeader";
import useFavorisData from "../../../../shared/hooks/dashboard/useFavorisData";
import uploadService from "../../../../shared/services/upload";

interface FavoriteCarLike {
  _id?: string;
  marque?: string;
  modele?: string;
  modelCar?: string;
  prix?: number;
  price?: number;
  images?: string[];
  image?: string;
}

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

function FavorisPage() {
  const { displayName, isAuthenticated, isLoading, error, favoritesList, refreshFavorites, removeFavorite } = useFavorisData();
  const [page, setPage] = useState(1);

  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(favoritesList.length / itemsPerPage));
  const paginatedFavorites = useMemo(
    () => favoritesList.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [favoritesList, page],
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <AuthenticatedContent isLoading={isLoading} isAuthenticated={isAuthenticated}>
      <section className="space-y-6">
        <PageHeader
          title="Mes Favoris"
          subtitle={`Bienvenue, ${displayName}`.trim()}
          icon={FiHeart}
          onRefresh={refreshFavorites}
        />

        {error && (
          <div className="text-red-200 bg-red-900/30 border border-red-500/40 rounded-lg p-4">
            {error}
          </div>
        )}

        {favoritesList.length === 0 ? (
          <EmptyState
            title="Aucun favori disponible"
            message="Ajoutez des voitures a vos favoris pour les retrouver rapidement ici."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginatedFavorites.map((item) => (
                (() => {
                  const car = (item.voiture ?? {}) as FavoriteCarLike;
                  const model = car.modele ?? car.modelCar ?? "";
                  const price = Number(car.prix ?? car.price ?? 0);
                  const imageValue = Array.isArray(car.images) && car.images[0]
                    ? car.images[0]
                    : car.image ?? "";

                  return (
                    <article
                      key={item._id}
                      className="backdrop-blur-xl rounded-lg p-4 border client-theme-card-soft"
                    >
                      <div className="rounded-lg overflow-hidden h-36 mb-3 client-theme-card">
                        {imageValue ? (
                          <img
                            src={uploadService.resolveImageUrl(imageValue)}
                            alt={`${car.marque ?? "Voiture"} ${model}`.trim()}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center client-theme-text-secondary text-xs">
                            Image indisponible
                          </div>
                        )}
                      </div>
                      <h2 className="text-base font-semibold client-theme-text-primary">
                        {car.marque} {model}
                      </h2>
                      <p className="client-theme-text-secondary text-sm mt-1">Ajoute le {formatDate(item.dateAjout)}</p>
                      <p className="client-theme-value font-medium mt-2">
                        {price.toLocaleString("fr-FR")} FCFA
                      </p>

                      <button
                        onClick={() => removeFavorite(item.voiture?._id)}
                        className="mt-4 inline-flex items-center gap-2 px-3 py-2 text-sm bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors"
                      >
                        <FiTrash2 />
                        Retirer
                      </button>
                    </article>
                  );
                })()
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between rounded-lg border client-theme-card-soft p-3">
                <button
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 rounded-lg text-xs border disabled:opacity-40 client-theme-outline-button"
                >
                  Precedent
                </button>
                <p className="text-xs client-theme-text-secondary">
                  Page {page} / {totalPages}
                </p>
                <button
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-2 rounded-lg text-xs border disabled:opacity-40 client-theme-outline-button"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </AuthenticatedContent>
  );
}

export default FavorisPage;
