import { useState, useEffect, useCallback } from "react";

import useAuth from "../../auth";
import { dashboardService } from "../../../services/dashboard";
import type {
  EnhancedUser,
  AchatsResponse,
  FavorisResponse,
  ProfileUpdateData,
  EvaluationData,
} from "../../../types/dashboard";

interface DashboardState {
  enhancedUser: EnhancedUser | null;
  achats: AchatsResponse | null;
  favorites: FavorisResponse | null;
  loading: boolean;
  error: string | null;
}

interface UseDashboardReturn extends DashboardState {
  refreshData: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  refreshAchats: () => Promise<void>;
  refreshFavorites: () => Promise<void>;
  toggleFavorite: (voitureId: string) => Promise<void>;
  addEvaluation: (achatId: string, evaluation: EvaluationData) => Promise<void>;
  updateProfile: (profileData: ProfileUpdateData) => Promise<void>;
}

export const useDashboard = (): UseDashboardReturn => {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<DashboardState>({
    enhancedUser: null,
    achats: null,
    favorites: null,
    loading: true,
    error: null,
  });

  const updateState = useCallback((updates: Partial<DashboardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const getToken = useCallback((): string => {
    const token = dashboardService.getTokenFromStorage();
    if (!token) {
      throw new Error("Token non trouve. Veuillez vous reconnecter.");
    }
    return token;
  }, []);

  const refreshUserData = useCallback(async (): Promise<void> => {
    try {
      const token = getToken();
      const enhancedUser = await dashboardService.getUserEnhancedData(token);
      updateState({ enhancedUser, error: null });
    } catch (error) {
      const errorMessage = dashboardService.handleError(error);
      updateState({ error: errorMessage });
    }
  }, [getToken, updateState]);

  const refreshAchats = useCallback(async (): Promise<void> => {
    try {
      const token = getToken();
      const achats = await dashboardService.getUserAchats(token, 1, 10);
      updateState({ achats, error: null });
    } catch {
      updateState({
        achats: {
          achats: [],
          stats: {},
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalCount: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
          success: false,
        },
      });
    }
  }, [getToken, updateState]);

  const refreshFavorites = useCallback(async (): Promise<void> => {
    try {
      const token = getToken();
      const favorites = await dashboardService.getUserFavorites(token, 1, 10);
      updateState({ favorites, error: null });
    } catch {
      updateState({
        favorites: {
          favorites: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalCount: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
          success: false,
        },
      });
    }
  }, [getToken, updateState]);

  const refreshData = useCallback(async (): Promise<void> => {
    updateState({ loading: true, error: null });
    try {
      await Promise.allSettled([refreshUserData(), refreshAchats(), refreshFavorites()]);
    } finally {
      updateState({ loading: false });
    }
  }, [refreshUserData, refreshAchats, refreshFavorites, updateState]);

  const toggleFavorite = useCallback(
    async (voitureId: string): Promise<void> => {
      try {
        const token = getToken();
        await dashboardService.toggleFavorite(token, voitureId);
        await Promise.allSettled([refreshUserData(), refreshFavorites()]);
      } catch (error) {
        const errorMessage = dashboardService.handleError(error);
        updateState({ error: errorMessage });
        throw error;
      }
    },
    [getToken, refreshUserData, refreshFavorites, updateState],
  );

  const addEvaluation = useCallback(
    async (achatId: string, evaluation: EvaluationData): Promise<void> => {
      try {
        const token = getToken();
        await dashboardService.addEvaluationToAchat(token, achatId, evaluation);
        await refreshAchats();
      } catch (error) {
        const errorMessage = dashboardService.handleError(error);
        updateState({ error: errorMessage });
        throw error;
      }
    },
    [getToken, refreshAchats, updateState],
  );

  const updateProfile = useCallback(
    async (profileData: ProfileUpdateData): Promise<void> => {
      try {
        const token = getToken();
        await dashboardService.updateUserProfile(token, profileData);
        await refreshUserData();
      } catch (error) {
        const errorMessage = dashboardService.handleError(error);
        updateState({ error: errorMessage });
        throw error;
      }
    },
    [getToken, refreshUserData, updateState],
  );

  useEffect(() => {
    if (isAuthenticated && dashboardService.isAuthenticated()) {
      refreshData();
    } else {
      updateState({
        enhancedUser: null,
        achats: null,
        favorites: null,
        loading: false,
        error: null,
      });
    }
  }, [isAuthenticated, refreshData, updateState]);

  return {
    ...state,
    refreshData,
    refreshUserData,
    refreshAchats,
    refreshFavorites,
    toggleFavorite,
    addEvaluation,
    updateProfile,
  };
};

export default useDashboard;
