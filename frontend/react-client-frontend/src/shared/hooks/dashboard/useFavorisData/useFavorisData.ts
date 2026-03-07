import { useCallback } from "react";

import useAuth from "../../auth";
import useUser from "../../user";

interface UseFavorisDataResult {
  user: ReturnType<typeof useAuth>["user"];
  displayName: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  favoritesList: NonNullable<ReturnType<typeof useUser>["favorites"]>["favorites"];
  refreshFavorites: () => Promise<void>;
  removeFavorite: (voitureId?: string) => Promise<void>;
}

export default function useFavorisData(): UseFavorisDataResult {
  const { user, loading, isAuthenticated } = useAuth();
  const {
    enhancedUser,
    favorites,
    loading: dashboardLoading,
    error,
    toggleFavorite,
    refreshFavorites,
  } = useUser();

  const favoritesList = favorites?.favorites ?? [];
  const displayName = [enhancedUser?.name ?? user?.name ?? "", enhancedUser?.surname ?? user?.surname ?? ""]
    .join(" ")
    .trim();

  const removeFavorite = useCallback(
    async (voitureId?: string) => {
      if (!voitureId) {
        return;
      }

      try {
        await toggleFavorite(voitureId);
      } catch {
        // The hook already exposes error state.
      }
    },
    [toggleFavorite],
  );

  return {
    user,
    displayName,
    isAuthenticated,
    isLoading: loading || dashboardLoading,
    error,
    favoritesList,
    refreshFavorites,
    removeFavorite,
  };
}
