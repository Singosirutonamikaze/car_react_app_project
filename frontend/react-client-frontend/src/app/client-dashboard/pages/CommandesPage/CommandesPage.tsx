import { useEffect, useMemo, useState, type FormEvent } from "react";
import { FiPackage } from "react-icons/fi";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

import AuthenticatedContent from "../../components/AuthenticatedContent";
import EmptyState from "../../components/EmptyState";
import PageHeader from "../../components/PageHeader";
import useCommandesData from "../../../../shared/hooks/dashboard/useCommandesData";
import { carService } from "../../../../shared/services/car";
import { orderService } from "../../../../shared/services/order";
import uploadService from "../../../../shared/services/upload";
import type { Car } from "../../../../shared/types/car";

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

interface CommandeFormState {
  carId: string;
  modePaiement: "Espèces" | "Virement" | "Chèque" | "Financement";
  rue: string;
  ville: string;
  codePostal: string;
  pays: string;
  notes: string;
}

const initialCommandeForm: CommandeFormState = {
  carId: "",
  modePaiement: "Espèces",
  rue: "",
  ville: "Lome",
  codePostal: "00000",
  pays: "TOGO",
  notes: "",
};

function CommandesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { displayName, isAuthenticated, isLoading, error, orders, refreshOrders } = useCommandesData();
  const [page, setPage] = useState(1);
  const [cars, setCars] = useState<Car[]>([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<CommandeFormState>(initialCommandeForm);

  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(orders.length / itemsPerPage));
  const paginatedOrders = useMemo(
    () => orders.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [orders, page],
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    const loadCars = async () => {
      try {
        setCarsLoading(true);
        const data = await carService.getAllCars();
        setCars(Array.isArray(data) ? data.filter((car) => car.disponible) : []);
      } catch {
        toast.error("Impossible de charger les voitures pour la commande");
      } finally {
        setCarsLoading(false);
      }
    };

    loadCars();
  }, []);

  useEffect(() => {
    const requestedCarId = searchParams.get("carId") ?? "";
    const requestedAction = searchParams.get("action") ?? "";

    if (requestedAction !== "commander" || !requestedCarId) {
      return;
    }

    setFormState((prev) => ({ ...prev, carId: requestedCarId }));
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const selectedCar = useMemo(
    () => cars.find((car) => car._id === formState.carId),
    [cars, formState.carId],
  );

  const handleFormChange = (field: keyof CommandeFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.carId) {
      toast.error("Selectionnez une voiture avant de commander");
      return;
    }

    if (!selectedCar) {
      toast.error("Voiture invalide. Reessayez.");
      return;
    }

    setIsSubmitting(true);

    try {
      const fraisLivraison = 0;
      const montant = Number(selectedCar.price ?? 0);

      await orderService.createOrder({
        voiture: formState.carId,
        statut: "En attente",
        montant,
        fraisLivraison,
        montantTotal: montant + fraisLivraison,
        modePaiement: formState.modePaiement,
        adresseLivraison: {
          rue: formState.rue,
          ville: formState.ville,
          codePostal: formState.codePostal,
          pays: formState.pays,
        },
        dateCommande: new Date(),
        notes: formState.notes || undefined,
      });

      toast.success("Commande creee avec succes");
      setFormState(initialCommandeForm);
      setPage(1);
      await refreshOrders();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la creation de la commande";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthenticatedContent isLoading={isLoading} isAuthenticated={isAuthenticated}>
      <section className="space-y-6">
        <PageHeader
          title="Mes Commandes"
          subtitle={`Bienvenue, ${displayName}`.trim()}
          icon={FiPackage}
          onRefresh={refreshOrders}
        />

        {error && (
          <div className="text-red-200 bg-red-900/30 border border-red-500/40 rounded-lg p-4">
            {error}
          </div>
        )}

        <article className="backdrop-blur-xl rounded-lg p-4 border client-theme-card-soft">
          <h2 className="text-base font-semibold client-theme-text-primary">Passer une commande</h2>
          <p className="text-sm client-theme-text-secondary mt-1 mb-4">
            Flux dashboard uniquement: vous pouvez commander ici sans passer par la page d'accueil.
          </p>

          <form onSubmit={handleCreateOrder} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm client-theme-text-secondary mb-1" htmlFor="commande-car-id">
                  Voiture
                </label>
                <select
                  id="commande-car-id"
                  value={formState.carId}
                  onChange={(event) => handleFormChange("carId", event.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm client-theme-input"
                  disabled={carsLoading || isSubmitting}
                  required
                >
                  <option value="">Selectionner une voiture</option>
                  {cars.map((car) => (
                    <option key={car._id} value={car._id}>
                      {car.marque} {car.modelCar} - {Number(car.price ?? 0).toLocaleString("fr-FR")} FCFA
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm client-theme-text-secondary mb-1" htmlFor="commande-mode-paiement">
                  Mode de paiement
                </label>
                <select
                  id="commande-mode-paiement"
                  value={formState.modePaiement}
                  onChange={(event) =>
                    handleFormChange("modePaiement", event.target.value as CommandeFormState["modePaiement"])
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm client-theme-input"
                  disabled={isSubmitting}
                >
                  <option value="Espèces">Espèces</option>
                  <option value="Virement">Virement</option>
                  <option value="Chèque">Chèque</option>
                  <option value="Financement">Financement</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm client-theme-text-secondary mb-1" htmlFor="commande-rue">
                  Rue
                </label>
                <input
                  id="commande-rue"
                  type="text"
                  value={formState.rue}
                  onChange={(event) => handleFormChange("rue", event.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm client-theme-input"
                  placeholder="Avenue de la Liberation"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div>
                <label className="block text-sm client-theme-text-secondary mb-1" htmlFor="commande-ville">
                  Ville
                </label>
                <input
                  id="commande-ville"
                  type="text"
                  value={formState.ville}
                  onChange={(event) => handleFormChange("ville", event.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm client-theme-input"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm client-theme-text-secondary mb-1" htmlFor="commande-code-postal">
                  Code postal
                </label>
                <input
                  id="commande-code-postal"
                  type="text"
                  value={formState.codePostal}
                  onChange={(event) => handleFormChange("codePostal", event.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm client-theme-input"
                  pattern="[0-9]{5}"
                  maxLength={5}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm client-theme-text-secondary mb-1" htmlFor="commande-pays">
                  Pays
                </label>
                <input
                  id="commande-pays"
                  type="text"
                  value={formState.pays}
                  onChange={(event) => handleFormChange("pays", event.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm client-theme-input"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm client-theme-text-secondary mb-1" htmlFor="commande-notes">
                Notes (optionnel)
              </label>
              <textarea
                id="commande-notes"
                value={formState.notes}
                onChange={(event) => handleFormChange("notes", event.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm client-theme-input"
                rows={3}
                placeholder="Informations complementaires pour la livraison"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="text-sm client-theme-text-secondary">
                Montant: <span className="client-theme-value font-semibold">{Number(selectedCar?.price ?? 0).toLocaleString("fr-FR")} FCFA</span>
              </p>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm border client-theme-button disabled:opacity-60"
                disabled={isSubmitting || carsLoading}
              >
                {isSubmitting ? "Commande en cours..." : "Commander"}
              </button>
            </div>
          </form>
        </article>

        {orders.length === 0 ? (
          <EmptyState
            title="Aucune commande disponible"
            message="Vos commandes apparaitront ici des que vous en passerez une nouvelle."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {paginatedOrders.map((order) => {
                const carInfo =
                  order.voiture && typeof order.voiture === "object"
                    ? `${order.voiture.marque ?? "Voiture"} ${order.voiture.modele ?? order.voiture.model ?? ""}`
                    : "Voiture";

                return (
                  <article
                    key={order._id ?? `${order.dateCommande}-${order.montantTotal}`}
                    className="backdrop-blur-xl rounded-lg p-4 border client-theme-card-soft"
                  >
                    <div className="rounded-lg overflow-hidden h-36 mb-3 client-theme-card">
                      {order.voiture && typeof order.voiture === "object" && "images" in order.voiture && Array.isArray(order.voiture.images) && order.voiture.images[0] ? (
                        <img
                          src={uploadService.resolveImageUrl(order.voiture.images[0])}
                          alt={carInfo.trim()}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center client-theme-text-secondary text-xs">
                          Image indisponible
                        </div>
                      )}
                    </div>
                    <h2 className="text-base font-semibold client-theme-text-primary">{carInfo.trim()}</h2>
                    <p className="client-theme-text-secondary text-sm mt-1">
                      Commande du {formatDate(order.dateCommande ? String(order.dateCommande) : undefined)}
                    </p>
                    <p className="client-theme-text-secondary mt-2 text-sm">Statut: {order.statut}</p>
                    <p className="client-theme-value font-medium mt-2">
                      {Number(order.montantTotal ?? 0).toLocaleString("fr-FR")} FCFA
                    </p>
                  </article>
                );
              })}
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

export default CommandesPage;
