import axiosInstance from "../axiosInstance";
import { API_PATHS } from "../../utils/apiPath";

export const getUserAchats = async () => {
  try {
    const res = await axiosInstance.get(API_PATHS.ACHATS.GET_USER);
    return res.data;
  } catch (error) {
    if (error?.response?.status === 404) {
      const fallback = await axiosInstance.get(API_PATHS.ACHATS.GET_ALL_FALLBACK);
      return fallback.data;
    }
    throw error;
  }
};

export const createAchat = async (data) => {
  const res = await axiosInstance.post(API_PATHS.ACHATS.CREATE, data);
  return res.data;
};

export const updateAchatStatus = async (achatId, statut) => {
  const res = await axiosInstance.put(API_PATHS.ACHATS.UPDATE_STATUS(achatId), {
    statut,
  });
  return res.data;
};

export const addAchatEvaluation = async (achatId, payload) => {
  const res = await axiosInstance.post(
    API_PATHS.ACHATS.ADD_EVALUATION(achatId),
    payload,
  );
  return res.data;
};
