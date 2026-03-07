import { useCallback, useEffect, useMemo, useState } from "react";

import useAuth from "../../auth";
import useUser from "../../user";
import { orderService } from "../../../services/order";
import type { CommandeInfo } from "../../../types/dashboard";

interface CommandeRow {
  _id?: string;
  statut?: string;
  montant?: number;
  montantTotal?: number;
  modePaiement?: string;
  dateCommande?: string | Date;
  voiture?:
  | {
    _id?: string;
    marque?: string;
    model?: string;
    modele?: string;
    modelCar?: string;
    image?: string;
    images?: string[];
  }
  | string;
}

interface UseCommandesDataResult {
  user: ReturnType<typeof useAuth>["user"];
  displayName: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  orders: CommandeRow[];
  refreshOrders: () => Promise<void>;
}

export default function useCommandesData(): UseCommandesDataResult {
  const { user, loading, isAuthenticated } = useAuth();
  const { enhancedUser, loading: dashboardLoading, error: dashboardError } = useUser();

  const [orders, setOrders] = useState<CommandeRow[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const refreshOrders = useCallback(async () => {
    if (!isAuthenticated) {
      setOrders([]);
      setOrdersError(null);
      return;
    }

    try {
      setLoadingOrders(true);
      setOrdersError(null);
      const fetchedOrders = (await orderService.getAllOrders()) as unknown as CommandeRow[];
      setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors du chargement des commandes";
      setOrdersError(message);
    } finally {
      setLoadingOrders(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const fallbackOrders = (enhancedUser?.recentCommandes ?? []) as unknown as CommandeInfo[];
  const displayOrders = orders.length > 0 ? orders : fallbackOrders;
  const displayName = [enhancedUser?.name ?? user?.name ?? "", enhancedUser?.surname ?? user?.surname ?? ""]
    .join(" ")
    .trim();

  const combinedError = useMemo(() => {
    return [dashboardError, ordersError].filter(Boolean).join("\n") || null;
  }, [dashboardError, ordersError]);

  return {
    user,
    displayName,
    isAuthenticated,
    isLoading: loading || dashboardLoading || loadingOrders,
    error: combinedError,
    orders: displayOrders,
    refreshOrders,
  };
}
