import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { FiMapPin } from "react-icons/fi";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

import AuthenticatedContent from "../../components/AuthenticatedContent";
import EmptyState from "../../components/EmptyState";
import PageHeader from "../../components/PageHeader";
import useAuth from "../../../../shared/hooks/auth";
import { carService } from "../../../../shared/services/car";
import { locationService } from "../../../../shared/services/location";
import uploadService from "../../../../shared/services/upload";
import type { Car } from "../../../../shared/types/car";
import type { LocationInfo } from "../../../../shared/types/location";

interface LocationFormState {
  carId: string;
  dateDebut: string;
  dateFin: string;
  modePaiement: "Espèces" | "Virement" | "Chèque" | "Mobile Money";
  notes: string;
}

const initialForm: LocationFormState = {
  carId: "",
  dateDebut: "",
  dateFin: "",
  modePaiement: "Espèces",
  notes: "",
};

function formatCurrency(amount?: number): string {
  return Number(amount ?? 0).toLocaleString("fr-FR") + " FCFA";
}

function formatDate(value?: string): string {
  if (!value) return "N/A";
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

function getLocationCarName(location: LocationInfo): string {
  const car = location.voiture;
  if (!car) return "Voiture";
  const marque = typeof car.marque === "string" ? car.marque.trim() : "";
  const modele = typeof car.modele === "string" ? car.modele.trim() : "";
  const modelCar = typeof car.modelCar === "string" ? car.modelCar.trim() : "";

  if (marque && modele && marque !== "0") return `${marque} ${modele}`;
  if (marque && modelCar && marque !== "0") return `${marque} ${modelCar}`;
  if (marque && marque !== "0") return marque;
  if (modele) return modele;
  if (modelCar) return modelCar;

  return "Voiture";
}

function getLocationAmount(location: LocationInfo): number {
  if (typeof location.montantTotal === "number" && location.montantTotal > 0) {
    return location.montantTotal;
  }

  const prixParJour = Number(location.prixParJour || 0);
  const duree = Number(location.duree || 0);
  if (prixParJour > 0 && duree > 0) {
    return prixParJour * duree;
  }

  const carPrice = Number(location.voiture?.price || 0);
  if (carPrice > 0 && duree > 0) {
    return carPrice * duree;
  }

  return 0;
}

function LocationsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [locations, setLocations] = useState<LocationInfo[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formState, setFormState] = useState<LocationFormState>(initialForm);
  const [error, setError] = useState<string | null>(null);

  const userId = user?._id || user?.id || "";

  const selectedCar = useMemo(
    () => cars.find((car) => car._id === formState.carId),
    [cars, formState.carId],
  );

  const refreshLocations = useCallback(async () => {
    if (!isAuthenticated || !userId) {
      setLocations([]);
      setLocationsLoading(false);
      return;
    }

    try {
      setLocationsLoading(true);
      setError(null);
      const rows = await locationService.getLocationsByClient(userId);
      setLocations(Array.isArray(rows) ? rows : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors du chargement des locations";
      setError(message);
      setLocations([]);
    } finally {
      setLocationsLoading(false);
    }
  }, [isAuthenticated, userId]);

  useEffect(() => {
    const loadCars = async () => {
      try {
        setCarsLoading(true);
        const data = await carService.getAllCars();
        setCars(Array.isArray(data) ? data.filter((car) => car.disponible) : []);
      } catch {
        toast.error("Impossible de charger les voitures disponibles");
      } finally {
        setCarsLoading(false);
      }
    };

    void loadCars();
  }, []);

  useEffect(() => {
    void refreshLocations();
  }, [refreshLocations]);

  useEffect(() => {
    const requestedCarId = searchParams.get("carId") ?? "";
    const requestedAction = searchParams.get("action") ?? "";
    if (requestedAction !== "louer" || !requestedCarId) return;

    setFormState((prev) => ({ ...prev, carId: requestedCarId }));
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userId) {
      toast.error("Utilisateur introuvable. Reconnectez-vous.");
      return;
    }

    if (!selectedCar?._id) {
      toast.error("Selectionnez une voiture");
      return;
    }

    if (!formState.dateDebut || !formState.dateFin) {
      toast.error("Selectionnez les dates de debut et de fin");
      return;
    }

    const debut = new Date(formState.dateDebut);
    const fin = new Date(formState.dateFin);
    if (Number.isNaN(debut.getTime()) || Number.isNaN(fin.getTime()) || fin <= debut) {
      toast.error("La date de fin doit etre apres la date de debut");
      return;
    }

    setSubmitting(true);
    try {
      await locationService.createLocation({
        client: userId,
        voiture: selectedCar._id,
        dateDebut: debut.toISOString(),
        dateFin: fin.toISOString(),
        prixParJour: Number(selectedCar.price ?? 0),
        modePaiement: formState.modePaiement,
        notes: formState.notes || undefined,
      });

      toast.success("Location creee avec succes");
      setFormState(initialForm);
      await refreshLocations();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la creation de la location";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  let locationsContent: ReactNode;
  if (locationsLoading) {
    locationsContent = <EmptyState compact title="Chargement" message="Chargement de vos locations..." />;
  } else if (locations.length === 0) {
    locationsContent = (
      <EmptyState
        title="Aucune location"
        message="Vos locations apparaitront ici des que vous en creerez une nouvelle."
      />
    );
  } else {
    locationsContent = (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {locations.map((location) => {
          const image = location.voiture?.image ? uploadService.resolveImageUrl(location.voiture.image) : "";
          return (
            <article
              key={location._id || `${location.voiture?._id}-${location.dateDebut}`}
              className="backdrop-blur-xl rounded-lg p-4 border client-theme-card-soft"
            >
              <div className="rounded-lg overflow-hidden h-36 mb-3 client-theme-card">
                {image ? (
                  <img src={image} alt={getLocationCarName(location)} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center client-theme-text-secondary text-xs">
                    Image indisponible
                  </div>
                )}
              </div>

              <h2 className="text-base font-semibold client-theme-text-primary">{getLocationCarName(location)}</h2>
              <p className="client-theme-text-secondary text-sm mt-1">
                Du {formatDate(location.dateDebut)} au {formatDate(location.dateFin)}
              </p>
              <p className="client-theme-value font-medium mt-2">{formatCurrency(getLocationAmount(location))}</p>
              <p className="mt-2 text-xs inline-flex items-center rounded-full border px-2.5 py-1 client-theme-outline-button">
                Statut: {location.statut || "En attente"}
              </p>
            </article>
          );
        })}
      </div>
    );
  }

  return (
    <AuthenticatedContent isLoading={loading} isAuthenticated={isAuthenticated}>
      <section className="space-y-6">
        <PageHeader
          title="Mes Locations"
          subtitle={`Bienvenue, ${(user?.name || "") + " " + (user?.surname || "")}`.trim()}
          icon={FiMapPin}
          onRefresh={() => {
            void refreshLocations();
          }}
        />

        <article className="backdrop-blur-xl rounded-lg p-4 border client-theme-card-soft">
          <h2 className="text-base font-semibold client-theme-text-primary">Demander une location</h2>
          <p className="text-sm client-theme-text-secondary mt-1 mb-4">
            Selectionnez une voiture disponible, les dates et le mode de paiement.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                title="Selectionner la voiture"
                aria-label="Selectionner la voiture"
                value={formState.carId}
                onChange={(event) => setFormState((prev) => ({ ...prev, carId: event.target.value }))}
                className="w-full rounded-lg border px-3 py-2 text-sm client-theme-input"
                disabled={carsLoading || submitting}
                required
              >
                <option value="">Selectionner une voiture</option>
                {cars.map((car) => (
                  <option key={car._id} value={car._id}>
                    {car.marque} {car.modelCar} - {formatCurrency(car.price)} / jour
                  </option>
                ))}
              </select>

              <select
                title="Choisir le mode de paiement"
                aria-label="Choisir le mode de paiement"
                value={formState.modePaiement}
                onChange={(event) => setFormState((prev) => ({ ...prev, modePaiement: event.target.value as LocationFormState["modePaiement"] }))}
                className="w-full rounded-lg border px-3 py-2 text-sm client-theme-input"
                disabled={submitting}
              >
                <option value="Espèces">Espèces</option>
                <option value="Virement">Virement</option>
                <option value="Chèque">Chèque</option>
                <option value="Mobile Money">Mobile Money</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location-date-debut" className="block text-xs client-theme-text-secondary mb-1">
                  Date de debut
                </label>
                <input
                  id="location-date-debut"
                  type="date"
                  title="Date de debut"
                  value={formState.dateDebut}
                  onChange={(event) => setFormState((prev) => ({ ...prev, dateDebut: event.target.value }))}
                  className="w-full rounded-lg border px-3 py-2 text-sm client-theme-input"
                  min={new Date().toISOString().slice(0, 10)}
                  required
                />
              </div>
              <div>
                <label htmlFor="location-date-fin" className="block text-xs client-theme-text-secondary mb-1">
                  Date de fin
                </label>
                <input
                  id="location-date-fin"
                  type="date"
                  title="Date de fin"
                  value={formState.dateFin}
                  onChange={(event) => setFormState((prev) => ({ ...prev, dateFin: event.target.value }))}
                  className="w-full rounded-lg border px-3 py-2 text-sm client-theme-input"
                  min={formState.dateDebut || new Date().toISOString().slice(0, 10)}
                  required
                />
              </div>
            </div>

            <textarea
              className="w-full rounded-lg border px-3 py-2 text-sm client-theme-input"
              rows={3}
              placeholder="Informations complementaires"
              value={formState.notes}
              onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
            />

            <div className="flex items-center justify-between gap-3">
              <p className="text-sm client-theme-text-secondary">
                Prix / jour: <span className="client-theme-value font-semibold">{formatCurrency(selectedCar?.price)}</span>
              </p>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm border client-theme-button disabled:opacity-60"
                disabled={submitting || carsLoading}
              >
                {submitting ? "Creation..." : "Creer la location"}
              </button>
            </div>
          </form>
        </article>

        {error && (
          <div className="text-red-200 bg-red-900/30 border border-red-500/40 rounded-lg p-4">{error}</div>
        )}

        {locationsContent}
      </section>
    </AuthenticatedContent>
  );
}

export default LocationsPage;
