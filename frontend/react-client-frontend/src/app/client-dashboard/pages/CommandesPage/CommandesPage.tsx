import { useCallback, useEffect, useMemo, useState } from "react";
import { FiPackage } from "react-icons/fi";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

import AuthenticatedContent from "../../components/AuthenticatedContent";
import EmptyState from "../../components/EmptyState";
import PageHeader from "../../components/PageHeader";
import useCommandesData from "../../../../shared/hooks/dashboard/useCommandesData";
import { carService } from "../../../../shared/services/car";
import { dashboardService } from "../../../../shared/services/dashboard";
import { orderService } from "../../../../shared/services/order";
import uploadService from "../../../../shared/services/upload";
import type { Car } from "../../../../shared/types/car";

interface CommandeFormState {
  carId: string;
  modePaiement: "Espèces" | "Virement" | "Chèque" | "Financement";
  rue: string;
  ville: string;
  codePostal: string;
  pays: string;
  notes: string;
}

interface OrderCar {
  marque?: string;
  modele?: string;
  model?: string;
  modelCar?: string;
  image?: string;
  images?: string[];
}

interface AchatRow {
  statut?: string;
  dateAchat?: string;
  modePaiement?: string;
  commande?: string | { _id?: string };
}

interface AchatDetails {
  statut: string;
  dateAchat: string;
  modePaiement: string;
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

function normalizeStatus(value?: string): string {
  return (value || "")
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getStatusClassName(status?: string): string {
  const normalized = normalizeStatus(status);
  if (normalized === "en attente") return "bg-amber-500/20 text-amber-200 border-amber-400/40";
  if (normalized === "confirmee" || normalized === "confirme" || normalized === "en cours") return "bg-blue-500/20 text-blue-200 border-blue-400/40";
  if (normalized === "paye") return "bg-cyan-500/20 text-cyan-200 border-cyan-400/40";
  if (normalized === "livree" || normalized === "termine") return "bg-emerald-500/20 text-emerald-200 border-emerald-400/40";
  if (normalized === "annulee") return "bg-rose-500/20 text-rose-200 border-rose-400/40";
  return "bg-slate-500/20 text-slate-200 border-slate-400/40";
}

function getOrderCar(order: { voiture?: unknown }): OrderCar | null {
  if (!order.voiture || typeof order.voiture !== "object") return null;
  return order.voiture as OrderCar;
}

function getOrderImage(orderCar: OrderCar | null): string {
  if (!orderCar) return "";
  if (Array.isArray(orderCar.images) && orderCar.images[0]) return orderCar.images[0];
  if (typeof orderCar.image === "string" && orderCar.image.trim()) return orderCar.image;
  return "";
}

function CommandesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { displayName, isAuthenticated, isLoading, error, orders, refreshOrders } = useCommandesData();
  const [page, setPage] = useState(1);
  const [cars, setCars] = useState<Car[]>([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [achatByOrderId, setAchatByOrderId] = useState<Record<string, AchatDetails>>({});
  const [formState, setFormState] = useState<CommandeFormState>(initialCommandeForm);

  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(orders.length / itemsPerPage));
  const paginatedOrders = useMemo(() => orders.slice((page - 1) * itemsPerPage, page * itemsPerPage), [orders, page]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
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
    if (requestedAction !== "commander" || !requestedCarId) return;

    setFormState((prev) => ({ ...prev, carId: requestedCarId }));
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const selectedCar = useMemo(() => cars.find((car) => car._id === formState.carId), [cars, formState.carId]);

  const refreshLinkedAchats = useCallback(async () => {
    if (!isAuthenticated) {
      setAchatByOrderId({});
      return;
    }

    try {
      const token = globalThis.localStorage.getItem("token");
      if (!token) {
        setAchatByOrderId({});
        return;
      }

      const achatsResponse = await dashboardService.getUserAchats(token, 1, 200);
      const achats = Array.isArray(achatsResponse.achats) ? (achatsResponse.achats as unknown as AchatRow[]) : [];

      const nextMap = achats.reduce<Record<string, AchatDetails>>((acc, achat) => {
        const commande = achat.commande;
        const commandeId = typeof commande === "string" ? commande : commande?._id;
        if (commandeId && achat.statut) {
          acc[commandeId] = {
            statut: achat.statut,
            dateAchat: achat.dateAchat || "",
            modePaiement: achat.modePaiement || "",
          };
        }
        return acc;
      }, {});

      setAchatByOrderId(nextMap);
    } catch {
      setAchatByOrderId({});
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refreshLinkedAchats();
  }, [refreshLinkedAchats]);

  const handleRefresh = useCallback(async () => {
    await Promise.all([refreshOrders(), refreshLinkedAchats()]);
  }, [refreshLinkedAchats, refreshOrders]);

  const submitCreateOrder = async () => {
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
      const montant = Number(selectedCar.price ?? 0);
      const creationResult = await orderService.createOrder({
        voiture: formState.carId,
        statut: "Confirmée",
        montant,
        fraisLivraison: 0,
        montantTotal: montant,
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

      if (!creationResult.data || !creationResult.achat) {
        throw new Error("Reponse invalide: data + achat attendus apres la commande.");
      }

      toast.success("Commande creee avec succes (achat lie confirme)");
      setFormState(initialCommandeForm);
      setPage(1);
      await Promise.all([refreshOrders(), refreshLinkedAchats()]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la creation de la commande";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitCreateOrder();
  };

  return (
    <AuthenticatedContent isLoading={isLoading} isAuthenticated={isAuthenticated}>
      <section className="space-y-6">
        <PageHeader title="Mes Commandes" subtitle={`Bienvenue, ${displayName}`.trim()} icon={FiPackage} onRefresh={handleRefresh} />

        {error && <div className="text-red-200 bg-red-900/30 border border-red-500/40 rounded-lg p-4">{error}</div>}

        <article className="backdrop-blur-xl rounded-lg p-4 border client-theme-card-soft">
          <h2 className="text-base font-semibold client-theme-text-primary">Passer une commande</h2>
          <p className="text-sm client-theme-text-secondary mt-1 mb-4">Flux dashboard uniquement: vous pouvez commander ici sans passer par la page d'accueil.</p>

          <form onSubmit={handleCreateOrder} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                title="Selectionner la voiture"
                aria-label="Selectionner la voiture"
                value={formState.carId}
                onChange={(event) => setFormState((prev) => ({ ...prev, carId: event.target.value }))}
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

              <select
                title="Choisir le mode de paiement"
                aria-label="Choisir le mode de paiement"
                value={formState.modePaiement}
                onChange={(event) => setFormState((prev) => ({ ...prev, modePaiement: event.target.value as CommandeFormState["modePaiement"] }))}
                className="w-full rounded-lg border px-3 py-2 text-sm client-theme-input"
                disabled={isSubmitting}
              >
                <option value="Espèces">Espèces</option>
                <option value="Virement">Virement</option>
                <option value="Chèque">Chèque</option>
                <option value="Financement">Financement</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="w-full rounded-lg border px-3 py-2 text-sm client-theme-input" placeholder="Rue" value={formState.rue} onChange={(event) => setFormState((prev) => ({ ...prev, rue: event.target.value }))} required />
              <input className="w-full rounded-lg border px-3 py-2 text-sm client-theme-input" placeholder="Ville" value={formState.ville} onChange={(event) => setFormState((prev) => ({ ...prev, ville: event.target.value }))} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input className="w-full rounded-lg border px-3 py-2 text-sm client-theme-input" placeholder="Code postal" value={formState.codePostal} onChange={(event) => setFormState((prev) => ({ ...prev, codePostal: event.target.value }))} pattern="[0-9]{5}" maxLength={5} required />
              <input className="w-full rounded-lg border px-3 py-2 text-sm client-theme-input md:col-span-2" placeholder="Pays" value={formState.pays} onChange={(event) => setFormState((prev) => ({ ...prev, pays: event.target.value }))} required />
            </div>

            <textarea className="w-full rounded-lg border px-3 py-2 text-sm client-theme-input" rows={3} placeholder="Informations complementaires" value={formState.notes} onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))} />

            <div className="flex items-center justify-between gap-3">
              <p className="text-sm client-theme-text-secondary">Montant: <span className="client-theme-value font-semibold">{Number(selectedCar?.price ?? 0).toLocaleString("fr-FR")} FCFA</span></p>
              <button type="submit" className="px-4 py-2 rounded-lg text-sm border client-theme-button disabled:opacity-60" disabled={isSubmitting || carsLoading}>
                {isSubmitting ? "Commande en cours..." : "Commander"}
              </button>
            </div>
          </form>
        </article>

        {orders.length === 0 ? (
          <EmptyState title="Aucune commande disponible" message="Vos commandes apparaitront ici des que vous en passerez une nouvelle." />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {paginatedOrders.map((order) => {
                const orderCar = getOrderCar(order);
                const imageValue = getOrderImage(orderCar);
                const carInfo = orderCar
                  ? `${orderCar.marque ?? "Voiture"} ${orderCar.modele ?? orderCar.modelCar ?? orderCar.model ?? ""}`
                  : "Voiture";

                return (
                  <article key={order._id ?? `${order.dateCommande}-${order.montantTotal}`} className="backdrop-blur-xl rounded-lg p-4 border client-theme-card-soft">
                    <div className="rounded-lg overflow-hidden h-36 mb-3 client-theme-card">
                      {imageValue ? (
                        <img src={uploadService.resolveImageUrl(imageValue)} alt={carInfo.trim()} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center client-theme-text-secondary text-xs">Image indisponible</div>
                      )}
                    </div>
                    <h2 className="text-base font-semibold client-theme-text-primary">{carInfo.trim()}</h2>
                    <p className="client-theme-text-secondary text-sm mt-1">Commande du {formatDate(order.dateCommande ? String(order.dateCommande) : undefined)}</p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClassName(order.statut)}`}>
                        {order.statut || "Inconnu"}
                      </span>
                    </div>
                    {order._id && (
                      <div className="mt-2">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClassName(achatByOrderId[order._id]?.statut)}`}>
                          Achat lie: {achatByOrderId[order._id]?.statut || "Non trouve"}
                        </span>
                      </div>
                    )}
                    {order._id && achatByOrderId[order._id] && (
                      <div className="mt-2 rounded-md border client-theme-card p-2">
                        <p className="text-xs client-theme-text-secondary font-medium">Détails achat</p>
                        <p className="text-xs client-theme-text-secondary mt-1">
                          Date: <span className="client-theme-text-primary">{formatDate(achatByOrderId[order._id].dateAchat || undefined)}</span>
                        </p>
                        <p className="text-xs client-theme-text-secondary mt-0.5">
                          Mode paiement: <span className="client-theme-text-primary">{achatByOrderId[order._id].modePaiement || "N/A"}</span>
                        </p>
                      </div>
                    )}
                    <p className="client-theme-value font-medium mt-2">{Number(order.montantTotal ?? 0).toLocaleString("fr-FR")} FCFA</p>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between rounded-lg border client-theme-card-soft p-3">
                <button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="px-3 py-2 rounded-lg text-xs border disabled:opacity-40 client-theme-outline-button">Precedent</button>
                <p className="text-xs client-theme-text-secondary">Page {page} / {totalPages}</p>
                <button onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages} className="px-3 py-2 rounded-lg text-xs border disabled:opacity-40 client-theme-outline-button">Suivant</button>
              </div>
            )}
          </>
        )}
      </section>
    </AuthenticatedContent>
  );
}

export default CommandesPage;
