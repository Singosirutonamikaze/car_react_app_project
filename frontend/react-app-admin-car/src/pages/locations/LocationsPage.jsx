import { useMemo, useState } from "react";
import { useLocations } from "../../hooks/locations/useLocations";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import EmptyState from "../../components/alerts/EmptyState";
import { LuMapPinned } from "react-icons/lu";

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `${new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)} FCFA`;
};

const getLocationAmount = (location) => {
  if (Number(location?.montantTotal) > 0) {
    return Number(location.montantTotal);
  }
  if (Number(location?.montant) > 0) {
    return Number(location.montant);
  }
  if (Number(location?.prixTotal) > 0) {
    return Number(location.prixTotal);
  }

  const prixParJour = Number(location?.prixParJour || 0);
  const duree = Number(location?.duree || 0);
  if (prixParJour > 0 && duree > 0) {
    return prixParJour * duree;
  }

  return 0;
};

const normalizeStatus = (value) =>
  String(value || "")
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const STATUS_OPTIONS = [
  { value: "En attente", label: "En attente" },
  { value: "Confirm\u00e9e", label: "Confirmee" },
  { value: "En cours", label: "En cours" },
  { value: "Termin\u00e9e", label: "Terminee" },
  { value: "Annul\u00e9e", label: "Annulee" },
];

const FILTER_OPTIONS = [
  "Tous",
  "En attente",
  "Confirmee",
  "En cours",
  "Terminee",
  "Annulee",
];

const getClientName = (location) =>
  location?.client?.nom || location?.client?.name || location?.nomClient || "-";

const getCarName = (location) => {
  if (location?.voiture?.marque && location?.voiture?.modele) {
    return `${location.voiture.marque} ${location.voiture.modele}`;
  }
  if (location?.voiture?.marque && location?.voiture?.modelCar) {
    return `${location.voiture.marque} ${location.voiture.modelCar}`;
  }
  return location?.car?.name || location?.voiture?.name || "-";
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(value));
};

function LocationsPage() {
  const { locations, loading, changeStatus, removeLocation } = useLocations();
  const [selectedStatus, setSelectedStatus] = useState("Tous");

  const filtered = useMemo(() => {
    const normalizedFilter = normalizeStatus(selectedStatus);
    if (!normalizedFilter || normalizedFilter === "tous") {
      return locations;
    }
    return locations.filter(
      (item) => normalizeStatus(item?.statut) === normalizedFilter,
    );
  }, [locations, selectedStatus]);

  let content = null;
  if (loading) {
    content = (
      <EmptyState
        title="Chargement"
        message="Chargement des locations..."
        compact
      />
    );
  } else if (filtered.length === 0) {
    content = (
      <EmptyState
        title="Aucune location trouvee"
        message="Aucune location ne correspond aux filtres selectionnes."
        compact
      />
    );
  } else {
    content = (
      <>
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filtered.map((location) => {
            const id = location?._id || location?.id;
            const clientName = getClientName(location);
            const carName = getCarName(location);

            return (
              <article
                key={id}
                className="rounded-lg border border-cyan-300/25 bg-[#06253A]/55 p-4"
              >
                <p className="text-sm text-slate-300">Client</p>
                <p className="mb-2 text-slate-100 font-medium">{clientName}</p>

                <p className="text-sm text-slate-300">Voiture</p>
                <p className="mb-2 text-slate-100">{carName}</p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-300">Debut</p>
                    <p className="text-slate-100">
                      {formatDate(location?.dateDebut || location?.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-300">Fin</p>
                    <p className="text-slate-100">
                      {formatDate(location?.dateFin || location?.endDate)}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-slate-100 font-semibold">
                  {formatCurrency(getLocationAmount(location))}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-md px-3 py-1 text-xs font-medium bg-cyan-500/20 text-cyan-100">
                    {location?.statut || "-"}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2">
                  <select
                    value={location?.statut || "En attente"}
                    onChange={(event) => changeStatus(id, event.target.value)}
                    className="filter-control w-full"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeLocation(id)}
                    className="h-11 rounded-md bg-rose-600 text-white hover:bg-rose-500"
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <table className="hidden w-full min-w-215 md:table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Voiture</th>
              <th>Debut</th>
              <th>Fin</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((location) => {
              const id = location?._id || location?.id;
              const clientName = getClientName(location);
              const carName = getCarName(location);

              return (
                <tr key={id}>
                  <td className="text-slate-100">{clientName}</td>
                  <td className="text-slate-100">{carName}</td>
                  <td>
                    <span className="text-slate-200">
                      {formatDate(location?.dateDebut || location?.startDate)}
                    </span>
                  </td>
                  <td>
                    <span className="text-slate-200">
                      {formatDate(location?.dateFin || location?.endDate)}
                    </span>
                  </td>
                  <td>
                    <span className="text-slate-100">
                      {formatCurrency(getLocationAmount(location))}
                    </span>
                  </td>
                  <td>
                    <span className="inline-flex rounded-md px-3 py-1 text-xs font-medium bg-cyan-500/20 text-cyan-100">
                      {location?.statut || "-"}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <select
                        value={location?.statut || "En attente"}
                        onChange={(event) =>
                          changeStatus(id, event.target.value)
                        }
                        className="filter-control max-w-40"
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeLocation(id)}
                        className="h-11 rounded-md bg-rose-600 px-4 text-white hover:bg-rose-500"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  }

  return (
    <DashboardLayout activeMenu="Locations">
      <section className="page-shell space-y-6">
        <div className="page-header-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="page-header-left">
              <div className="page-header-icon">
                <LuMapPinned className="text-xl" />
              </div>
              <div>
                <h1 className="page-title">Liste des Locations</h1>
                <p className="page-subtitle">
                  Gestion des locations avec controles de statut et suppression
                  rapide.
                </p>
              </div>
            </div>
            <div className="w-full md:w-56">
              <label
                htmlFor="locations-status-filter"
                className="block text-sm font-medium mb-2 text-slate-200"
              >
                Filtrer par statut
              </label>
              <select
                id="locations-status-filter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="filter-control w-full"
              >
                {FILTER_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="card p-6 overflow-x-auto">{content}</div>
      </section>
    </DashboardLayout>
  );
}

export default LocationsPage;
