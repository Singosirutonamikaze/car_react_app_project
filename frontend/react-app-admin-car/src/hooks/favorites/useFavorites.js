import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getUserFavorites,
  toggleFavorite,
  removeFavorite,
} from "../../service/favorites/favoritesService";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUserFavorites();
      let normalized = [];
      if (Array.isArray(response)) {
        normalized = response;
      } else if (Array.isArray(response?.favorites)) {
        normalized = response.favorites;
      } else if (Array.isArray(response?.data)) {
        normalized = response.data;
      }
      setFavorites(normalized);
    } catch (error) {
      const status = error?.response?.status;
      const message = String(error?.response?.data?.message || "").toLowerCase();

      if (status === 401 && message.includes("utilisateur non trouv")) {
        setFavorites([]);
      } else {
        toast.error(error?.response?.data?.message || "Erreur chargement favoris");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggle = async (carId) => {
    await toggleFavorite(carId);
    fetchFavorites();
  };

  const remove = async (favoriteId) => {
    await removeFavorite(favoriteId);
    toast.success("Favori retire");
    fetchFavorites();
  };

  return { favorites, loading, fetchFavorites, toggle, remove };
};
