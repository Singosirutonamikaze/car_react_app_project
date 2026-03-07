import { useFavorites } from "../../hooks/favorites/useFavorites";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import EmptyState from "../../components/alerts/EmptyState";
import { LuHeart } from "react-icons/lu";
import { resolveImageUrl } from "../../utils/imageUrl";

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

function FavoritesPage() {
  const { favorites, loading, remove } = useFavorites();

  let content = null;
  if (loading) {
    content = (
      <div className="card p-6">
        <EmptyState
          title="Chargement"
          message="Chargement des favoris..."
          compact
        />
      </div>
    );
  } else if (favorites.length === 0) {
    content = (
      <div className="card p-6">
        <EmptyState
          title="Aucun favori disponible"
          message="Ajoutez des favoris pour les afficher ici."
          compact
        />
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {favorites.map((favorite) => {
          const id = favorite?._id || favorite?.id;
          const car =
            favorite?.carId || favorite?.voiture || favorite?.car || {};
          let title = car?.name || "Voiture";
          if (car?.marque && car?.modele) {
            title = `${car.marque} ${car.modele}`;
          } else if (car?.marque && car?.modelCar) {
            title = `${car.marque} ${car.modelCar}`;
          }
          const image =
            resolveImageUrl(car?.image || car?.images?.[0]) ||
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900";

          return (
            <article
              key={id}
              className="card p-4 transition-all duration-200 hover:shadow-xl"
            >
              <div className="aspect-video overflow-hidden rounded-lg border border-slate-200">
                <img
                  src={image}
                  alt={title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 space-y-1">
                <h2 className="text-lg font-semibold text-slate-100">
                  {title}
                </h2>
                <p className="text-sm text-slate-300">
                  {car?.carburant || "-"}
                </p>
                <p className="text-base font-semibold text-cyan-100">
                  {formatCurrency(car?.prix || car?.price)}
                </p>
              </div>
              <button
                type="button"
                className="mt-4 w-full bg-rose-600 text-white hover:bg-rose-500"
                onClick={() => remove(id)}
              >
                Retirer des favoris
              </button>
            </article>
          );
        })}
      </div>
    );
  }

  return (
    <DashboardLayout activeMenu="Favoris">
      <section className="page-shell space-y-6">
        <div className="page-header-card">
          <div className="page-header-left">
            <div className="page-header-icon">
              <LuHeart className="text-xl" />
            </div>
            <div>
              <h1 className="page-title">Liste des Favoris</h1>
              <p className="page-subtitle">
                Visualisez les voitures preferees de vos clients et nettoyez
                rapidement la liste.
              </p>
            </div>
          </div>
        </div>

        {content}
      </section>
    </DashboardLayout>
  );
}

export default FavoritesPage;
