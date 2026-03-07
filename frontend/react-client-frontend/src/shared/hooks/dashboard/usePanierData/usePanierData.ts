import useAuth from "../../auth";
import useUser from "../../user";

const PANIER_STATUTS = new Set(["en attente", "confirme", "paye"]);

function normalizeStatus(value?: string): string {
  return (value || "")
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

interface UsePanierDataResult {
  user: ReturnType<typeof useAuth>["user"];
  displayName: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  pendingItems: NonNullable<ReturnType<typeof useUser>["achats"]>["achats"];
  refreshAchats: () => Promise<void>;
}

export default function usePanierData(): UsePanierDataResult {
  const { user, loading, isAuthenticated } = useAuth();
  const { enhancedUser, achats, loading: dashboardLoading, error, refreshAchats } = useUser();

  const pendingItems = (achats?.achats ?? []).filter((item) => PANIER_STATUTS.has(normalizeStatus(item.statut)));
  const displayName = [enhancedUser?.name ?? user?.name ?? "", enhancedUser?.surname ?? user?.surname ?? ""]
    .join(" ")
    .trim();

  return {
    user,
    displayName,
    isAuthenticated,
    isLoading: loading || dashboardLoading,
    error,
    pendingItems,
    refreshAchats,
  };
}
