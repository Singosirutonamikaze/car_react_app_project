import { useState, useEffect, useCallback } from 'react';

import useAuth from './useAuth';
import { dashboardService } from '../services/dashboardService';
import type {
  EnhancedUser,
  AchatsResponse,
  FavorisResponse,
  ProfileUpdateData,
  EvaluationData
} from '../types/dashboard';

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
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const getToken = useCallback((): string => {
    const token = dashboardService.getTokenFromStorage();
    if (!token) {
      throw new Error('Token non trouvé. Veuillez vous reconnecter.');
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
      console.error('Erreur lors du chargement des données utilisateur:', errorMessage);
      updateState({ error: errorMessage });
    }
  }, [getToken, updateState]);

  const refreshAchats = useCallback(async (): Promise<void> => {
    try {
      const token = getToken();
      const achats = await dashboardService.getUserAchats(token, 1, 10);
      updateState({ achats, error: null });
    } catch (error) {
      const errorMessage = dashboardService.handleError(error);
      console.error('Erreur lors du chargement des achats:', errorMessage);
      // Ne pas considérer l'échec des achats comme une erreur critique
      updateState({ achats: { achats: [], stats: {}, pagination: { currentPage: 1, totalPages: 0, totalCount: 0, hasNextPage: false, hasPrevPage: false }, success: false } });
    }
  }, [getToken, updateState]);

  const refreshFavorites = useCallback(async (): Promise<void> => {
    try {
      const token = getToken();
      const favorites = await dashboardService.getUserFavorites(token, 1, 10);
      updateState({ favorites, error: null });
    } catch (error) {
      const errorMessage = dashboardService.handleError(error);
      console.error('Erreur lors du chargement des favoris:', errorMessage);
      // Ne pas considérer l'échec des favoris comme une erreur critique
      updateState({ favorites: { favorites: [], pagination: { currentPage: 1, totalPages: 0, totalCount: 0, hasNextPage: false, hasPrevPage: false }, success: false } });
    }
  }, [getToken, updateState]);

  const refreshData = useCallback(async (): Promise<void> => {
    updateState({ loading: true, error: null });

    try {
      await Promise.allSettled([
        refreshUserData(),
        refreshAchats(),
        refreshFavorites(),
      ]);
    } finally {
      updateState({ loading: false });
    }
  }, [refreshUserData, refreshAchats, refreshFavorites, updateState]);

  const toggleFavorite = useCallback(async (voitureId: string): Promise<void> => {
    try {
      const token = getToken();
      await dashboardService.toggleFavorite(token, voitureId);

      // Rafraîchir les données utilisateur et les favoris
      await Promise.allSettled([
        refreshUserData(),
        refreshFavorites(),
      ]);
    } catch (error) {
      const errorMessage = dashboardService.handleError(error);
      console.error('Erreur lors de la modification des favoris:', errorMessage);
      updateState({ error: errorMessage });
      throw error; // Relancer l'erreur pour que le composant puisse la gérer
    }
  }, [getToken, refreshUserData, refreshFavorites, updateState]);

  const addEvaluation = useCallback(async (achatId: string, evaluation: EvaluationData): Promise<void> => {
    try {
      const token = getToken();
      await dashboardService.addEvaluationToAchat(token, achatId, evaluation);

      // Rafraîchir les achats
      await refreshAchats();
    } catch (error) {
      const errorMessage = dashboardService.handleError(error);
      console.error('Erreur lors de l\'ajout de l\'évaluation:', errorMessage);
      updateState({ error: errorMessage });
      throw error;
    }
  }, [getToken, refreshAchats, updateState]);

  const updateProfile = useCallback(async (profileData: ProfileUpdateData): Promise<void> => {
    try {
      const token = getToken();
      await dashboardService.updateUserProfile(token, profileData);

      // Rafraîchir les données utilisateur
      await refreshUserData();
    } catch (error) {
      const errorMessage = dashboardService.handleError(error);
      console.error('Erreur lors de la mise à jour du profil:', errorMessage);
      updateState({ error: errorMessage });
      throw error;
    }
  }, [getToken, refreshUserData, updateState]);

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