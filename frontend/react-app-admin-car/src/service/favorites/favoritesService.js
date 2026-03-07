import axiosInstance from "../axiosInstance";
import { API_PATHS } from "../../utils/apiPath";

export const getUserFavorites = async () => {
  const endpointCandidates = [
    API_PATHS.FAVORITES.GET_ALL,
    API_PATHS.FAVORITES.GET_ALL_COMPAT,
    API_PATHS.FAVORITES.GET_ALL_COMPAT_ALT,
    API_PATHS.FAVORITES.GET_USER_COMPAT,
  ];

  let lastError;
  for (const endpoint of endpointCandidates) {
    try {
      const res = await axiosInstance.get(endpoint);
      return res.data;
    } catch (error) {
      if (error?.response?.status === 404) {
        lastError = error;
        continue;
      }
      throw error;
    }
  }

  throw lastError;
};

export const toggleFavorite = async (carId) => {
  const res = await axiosInstance.put(API_PATHS.FAVORITES.TOGGLE, { carId });
  return res.data;
};

export const removeFavorite = async (favoriteId) => {
  const endpointCandidates = [
    API_PATHS.FAVORITES.REMOVE(favoriteId),
    API_PATHS.FAVORITES.REMOVE_COMPAT(favoriteId),
    API_PATHS.FAVORITES.REMOVE_USER_COMPAT(favoriteId),
  ];

  let lastError;
  for (const endpoint of endpointCandidates) {
    try {
      const res = await axiosInstance.delete(endpoint);
      return res.data;
    } catch (error) {
      if (error?.response?.status === 404) {
        lastError = error;
        continue;
      }
      throw error;
    }
  }

  throw lastError;
};
