import axiosInstance from "../axiosInstance";
import { API_PATHS } from "../../utils/apiPath";

export const getAllLocations = async () => {
  const res = await axiosInstance.get(API_PATHS.LOCATIONS.GET_ALL);
  return res.data;
};

export const getLocationById = async (locationId) => {
  const res = await axiosInstance.get(API_PATHS.LOCATIONS.GET_BY_ID(locationId));
  return res.data;
};

export const createLocation = async (data) => {
  const res = await axiosInstance.post(API_PATHS.LOCATIONS.CREATE, data);
  return res.data;
};

export const updateLocationStatus = async (locationId, statut) => {
  const res = await axiosInstance.patch(
    API_PATHS.LOCATIONS.UPDATE_STATUS(locationId),
    { statut },
  );
  return res.data;
};

export const deleteLocation = async (locationId) => {
  const res = await axiosInstance.delete(API_PATHS.LOCATIONS.DELETE(locationId));
  return res.data;
};
