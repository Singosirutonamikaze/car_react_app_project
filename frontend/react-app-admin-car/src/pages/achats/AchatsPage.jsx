import { useMemo, useState } from "react";
import { useAchats } from "../../hooks/achats/useAchats";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import EmptyState from "../../components/alerts/EmptyState";
import { LuReceiptText } from "react-icons/lu";

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `${new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)} FCFA`;
};

const normalizeStatus = (value) =>
  String(value || "")
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const STATUS_FILTER_MAP = {
  tous: null,
  en_attente: "en attente",
  confirme: "confirme",
  annule: "annule",
  paye: "paye",
  livre: "livre",
  termine: "termine",
};

const STATUS_OPTIONS = [
  { value: "En attente", label: "En attente" },
  { value: "Confirme", label: "Confirme" },
  { value: "Paye", label: "Paye" },
  { value: "Livre", label: "Livre" },
  { value: "Termine", label: "Termine" },
  { value: "Annule", label: "Annule" },
];

const getClientName = (achat) => {
  const commandeClient = achat?.commande?.client;
  const combinedName =
    `${commandeClient?.name || ""} ${commandeClient?.surname || ""}`.trim();
  return (
    achat?.client?.nom ||
    achat?.client?.name ||
    combinedName ||
    achat?.nomClient ||
    "-"
  );
};

const getCarName = (achat) => {
  if (
    achat?.voiture?.marque &&
    (achat?.voiture?.modele || achat?.voiture?.modelCar)
  ) {
    return `${achat.voiture.marque} ${achat.voiture.modele || achat.voiture.modelCar}`;
  }
  return (
    achat?.car?.name || achat?.voiture?.name || achat?.modeleVoiture || "-"
  );
};

const getAmount = (achat) =>
  achat?.prixAchat || achat?.montant || achat?.prixTotal || 0;

const formatDate = (value) => {
  if (!value) {
    return "-";
  }
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(value));
};

function AchatsPage() {
  const { achats, loading, changeStatus } = useAchats();
  const [selectedStatus, setSelectedStatus] = useState("Tous");

  const statusOptions = [
    "Tous",
    "en_attente",
    "confirme",
    "paye",
    "livre",
    "termine",
    "annule",
  ];

  const filtered = useMemo(() => {
    const filterStatus =
      STATUS_FILTER_MAP[String(selectedStatus || "").toLowerCase()] ?? null;
    if (!filterStatus) {
      return achats;
    }
    return achats.filter(
      (item) => normalizeStatus(item?.statut) === filterStatus,
    );
  }, [achats, selectedStatus]);

  let content = null;
  if (loading) {
    content = (
      <EmptyState
        title="Chargement"
        message="Chargement des achats..."
        compact
      />
    );
  } else if (filtered.length === 0) {
    content = (
      <EmptyState
        title="Aucun achat trouve"
        message="Aucun achat ne correspond aux filtres selectionnes."
        compact
      />
    );
  } else {
    content = (
      <>
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filtered.map((achat) => {
            const id = achat?._id || achat?.id;
            const clientName = getClientName(achat);
            const carName = getCarName(achat);

            return (
              <article
                key={id}
                className="rounded-lg border border-cyan-300/25 bg-[#06253A]/55 p-4"
              >
                <p className="text-sm text-slate-300">Client</p>
                <p className="mb-2 text-slate-100 font-medium">{clientName}</p>

                <p className="text-sm text-slate-300">Voiture</p>
                <p className="mb-2 text-slate-100">{carName}</p>

                <p className="text-sm text-slate-300">Montant</p>
                <p className="mb-2 text-slate-100 font-semibold">
                  {formatCurrency(getAmount(achat))}
                </p>

                <p className="text-sm text-slate-300">Date</p>
                <p className="mb-3 text-slate-200">
                  {formatDate(achat?.createdAt || achat?.dateAchat)}
                </p>

                <span className="inline-flex rounded-md px-3 py-1 text-xs font-medium bg-cyan-500/20 text-cyan-100">
                  {achat?.statut || "-"}
                </span>

                <div className="mt-3">
                  <select
                    value={achat?.statut || "En attente"}
                    onChange={(event) => changeStatus(id, event.target.value)}
                    className="filter-control w-full"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </article>
            );
          })}
        </div>

        <table className="hidden w-full min-w-210 md:table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Voiture</th>
              <th>Montant</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((achat) => {
              const id = achat?._id || achat?.id;
              const clientName = getClientName(achat);
              const carName = getCarName(achat);

              return (
                <tr key={id}>
                  <td className="text-slate-100">{clientName}</td>
                  <td className="text-slate-100">{carName}</td>
                  <td className="text-slate-100">
                    {formatCurrency(getAmount(achat))}
                  </td>
                  <td className="text-slate-200">
                    {formatDate(achat?.createdAt || achat?.dateAchat)}
                  </td>
                  <td>
                    <span className="inline-flex rounded-md px-3 py-1 text-xs font-medium bg-cyan-500/20 text-cyan-100">
                      {achat?.statut || "-"}
                    </span>
                  </td>
                  <td>
                    <select
                      value={achat?.statut || "En attente"}
                      onChange={(event) => changeStatus(id, event.target.value)}
                      className="filter-control max-w-40"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
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
    <DashboardLayout activeMenu="Achats">
      <section className="page-shell space-y-6">
        <div className="page-header-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="page-header-left">
              <div className="page-header-icon">
                <LuReceiptText className="text-xl" />
              </div>
              <div>
                <h1 className="page-title">Liste des Achats</h1>
                <p className="page-subtitle">
                  Suivi de toutes les operations d'achat avec statut en temps
                  reel.
                </p>
              </div>
            </div>
            <div className="w-full md:w-56">
              <label
                htmlFor="achats-status-filter"
                className="block text-sm font-medium mb-2 text-slate-200"
              >
                Filtrer par statut
              </label>
              <select
                id="achats-status-filter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="filter-control w-full"
              >
                {statusOptions.map((option) => (
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

export default AchatsPage;
