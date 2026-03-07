import axiosInstance from "../axiosInstance";
import { API_PATHS } from "../../utils/apiPath";

export const getUserFavorites = async () => {
  const res = await axiosInstance.get(API_PATHS.FAVORITES.GET_ALL);
  return res.data;
};

export const toggleFavorite = async (carId) => {
  const res = await axiosInstance.put(API_PATHS.FAVORITES.TOGGLE, { carId });
  return res.data;
};

export const removeFavorite = async (favoriteId) => {
  const res = await axiosInstance.delete(API_PATHS.FAVORITES.REMOVE(favoriteId));
  return res.data;
};
