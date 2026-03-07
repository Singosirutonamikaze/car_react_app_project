import { useEffect, useMemo, useState, type ReactNode } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import AuthenticatedContent from "../../components/AuthenticatedContent";
import EmptyState from "../../components/EmptyState";
import PageHeader from "../../components/PageHeader";
import usePanierData from "../../../../shared/hooks/dashboard/usePanierData";
import useUser from "../../../../shared/hooks/user";
import { carService } from "../../../../shared/services/car";
import uploadService from "../../../../shared/services/upload";
import type { Car } from "../../../../shared/types/car";
import ROUTES from "../../../../router";

function formatCurrency(amount?: number): string {
  return Number(amount ?? 0).toLocaleString("fr-FR") + " FCFA";
}

function PanierPage() {
  const navigate = useNavigate();
  const { displayName, isAuthenticated, isLoading, error, pendingItems, refreshAchats } = usePanierData();
  const { toggleFavorite } = useUser();
  const [cars, setCars] = useState<Car[]>([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [pendingPage, setPendingPage] = useState(1);
  const [carsPage, setCarsPage] = useState(1);

  const pendingItemsPerPage = 4;
  const carsItemsPerPage = 6;

  const totalPendingPages = Math.max(1, Math.ceil(pendingItems.length / pendingItemsPerPage));
  const totalCarsPages = Math.max(1, Math.ceil(cars.length / carsItemsPerPage));

  const paginatedPendingItems = useMemo(
    () => pendingItems.slice((pendingPage - 1) * pendingItemsPerPage, pendingPage * pendingItemsPerPage),
    [pendingItems, pendingPage],
  );

  const paginatedCars = useMemo(
    () => cars.slice((carsPage - 1) * carsItemsPerPage, carsPage * carsItemsPerPage),
    [cars, carsPage],
  );

  useEffect(() => {
    const loadCars = async () => {
      try {
        setCarsLoading(true);
        const data = await carService.getAllCars();
        setCars(data.filter((car) => car.disponible));
      } catch {
        toast.error("Impossible de charger les voitures disponibles");
      } finally {
        setCarsLoading(false);
      }
    };

    loadCars();
  }, []);

  useEffect(() => {
    if (pendingPage > totalPendingPages) {
      setPendingPage(totalPendingPages);
    }
  }, [pendingPage, totalPendingPages]);

  useEffect(() => {
    if (carsPage > totalCarsPages) {
      setCarsPage(totalCarsPages);
    }
  }, [carsPage, totalCarsPages]);

  const handleCommander = (carId?: string) => {
    if (!carId) {
      return;
    }
    navigate(`${ROUTES.ORDERS}?action=commander&carId=${encodeURIComponent(carId)}`);
  };

  const handleLouer = (carId?: string) => {
    if (!carId) {
      return;
    }
    navigate(`${ROUTES.LOCATIONS}?action=louer&carId=${encodeURIComponent(carId)}`);
  };

  const handleAddFavorite = async (carId?: string) => {
    if (!carId) {
      return;
    }

    try {
      await toggleFavorite(carId);
      toast.success("Ajoute aux favoris");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de l'ajout aux favoris";
      toast.error(message);
    }
  };

  let carsSectionContent: ReactNode;
  if (carsLoading) {
    carsSectionContent = <p className="client-theme-text-secondary text-sm">Chargement des voitures...</p>;
  } else if (cars.length === 0) {
    carsSectionContent = (
      <EmptyState
        compact
        title="Aucune voiture disponible"
        message="Le stock est en cours de mise a jour. Revenez dans quelques instants."
      />
    );
  } else {
    carsSectionContent = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginatedCars.map((car) => {
            const carName = `${car.marque} ${car.modelCar}`;

            return (
              <article
                key={car._id ?? carName}
                className="rounded-lg border client-theme-card-soft p-4"
              >
                <div className="rounded-lg overflow-hidden h-36 mb-3 client-theme-card">
                  {car.image ? (
                    <img
                      src={uploadService.resolveImageUrl(car.image)}
                      alt={carName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center client-theme-text-secondary text-xs">
                      Image indisponible
                    </div>
                  )}
                </div>
                <h4 className="client-theme-text-primary font-semibold text-sm">{carName}</h4>
                <p className="client-theme-text-secondary text-xs mt-1">{car.year} - {car.ville}</p>
                <p className="client-theme-value font-medium mt-2">{formatCurrency(car.price)}</p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleCommander(car._id)}
                    className="px-3 py-2 rounded-lg text-xs border client-theme-button"
                  >
                    Commander
                  </button>
                  <button
                    onClick={() => void handleAddFavorite(car._id)}
                    className="px-3 py-2 rounded-lg text-xs border client-theme-outline-button"
                  >
                    Favori
                  </button>
                  <button
                    onClick={() => handleLouer(car._id)}
                    className="px-3 py-2 rounded-lg text-xs border client-theme-outline-button"
                  >
                    Louer
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {totalCarsPages > 1 && (
          <div className="mt-4 flex items-center justify-between rounded-lg border client-theme-card-soft p-3">
            <button
              onClick={() => setCarsPage((current) => Math.max(1, current - 1))}
              disabled={carsPage === 1}
              className="px-3 py-2 rounded-lg text-xs border disabled:opacity-40 client-theme-outline-button"
            >
              Precedent
            </button>
            <p className="text-xs client-theme-text-secondary">
              Page {carsPage} / {totalCarsPages}
            </p>
            <button
              onClick={() => setCarsPage((current) => Math.min(totalCarsPages, current + 1))}
              disabled={carsPage === totalCarsPages}
              className="px-3 py-2 rounded-lg text-xs border disabled:opacity-40 client-theme-outline-button"
            >
              Suivant
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <AuthenticatedContent isLoading={isLoading} isAuthenticated={isAuthenticated}>
      <section className="space-y-6">
        <PageHeader
          title="Mon Panier"
          subtitle={`Bienvenue, ${displayName}`.trim()}
          icon={FiShoppingCart}
          onRefresh={refreshAchats}
        />

        {error && (
          <div className="text-red-200 bg-red-900/30 border border-red-500/40 rounded-lg p-4">
            {error}
          </div>
        )}

        {pendingItems.length === 0 ? (
          <EmptyState
            title="Votre panier est vide"
            message="Parcourez les voitures disponibles ci-dessous pour commencer une commande."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {paginatedPendingItems.map((item) => (
                <article
                  key={item._id}
                  className="backdrop-blur-xl rounded-lg p-4 border client-theme-card-soft"
                >
                  <h2 className="text-base font-semibold client-theme-text-primary">
                    {item.voiture?.marque} {(item.voiture as { modele?: string; modelCar?: string })?.modele ?? (item.voiture as { modele?: string; modelCar?: string })?.modelCar ?? ""}
                  </h2>
                  <p className="client-theme-text-secondary text-sm mt-1">Statut: {item.statut}</p>
                  <p className="client-theme-value font-medium mt-2">{formatCurrency(item.prixAchat)}</p>
                </article>
              ))}
            </div>

            {totalPendingPages > 1 && (
              <div className="flex items-center justify-between rounded-lg border client-theme-card-soft p-3">
                <button
                  onClick={() => setPendingPage((current) => Math.max(1, current - 1))}
                  disabled={pendingPage === 1}
                  className="px-3 py-2 rounded-lg text-xs border disabled:opacity-40 client-theme-outline-button"
                >
                  Precedent
                </button>
                <p className="text-xs client-theme-text-secondary">
                  Page {pendingPage} / {totalPendingPages}
                </p>
                <button
                  onClick={() => setPendingPage((current) => Math.min(totalPendingPages, current + 1))}
                  disabled={pendingPage === totalPendingPages}
                  className="px-3 py-2 rounded-lg text-xs border disabled:opacity-40 client-theme-outline-button"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}

        <div className="backdrop-blur-xl rounded-lg p-5 border client-theme-card">
          <h3 className="text-base font-semibold client-theme-text-primary mb-1">Voitures disponibles</h3>
          <p className="text-sm client-theme-text-secondary mb-4">Selection rapide pour commander ou demander une location.</p>

          {carsSectionContent}
        </div>
      </section>
    </AuthenticatedContent>
  );
}

export default PanierPage;
