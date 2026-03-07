import axiosInstance from "../axiosInstance";
import { API_PATHS } from "../../utils/apiPath";

const mapOrdersToAchats = (orders) => {
  if (!Array.isArray(orders)) {
    return [];
  }

  return orders.map((order) => ({
    _id: order?._id,
    statut: order?.statut,
    dateAchat: order?.dateCommande || order?.createdAt,
    createdAt: order?.createdAt || order?.dateCommande,
    prixAchat: Number(order?.montantTotal ?? order?.montant ?? 0),
    commande: order,
    client: order?.client,
    voiture: order?.voiture,
  }));
};

export const getUserAchats = async () => {
  const endpointCandidates = [
    API_PATHS.ACHATS.GET_USER,
    API_PATHS.ACHATS.GET_ALL_FALLBACK,
    API_PATHS.ACHATS.GET_FROM_ORDERS,
  ];

  let lastError;
  for (const endpoint of endpointCandidates) {
    try {
      const res = await axiosInstance.get(endpoint);

      if (endpoint === API_PATHS.ACHATS.GET_FROM_ORDERS) {
        const payload = res?.data;
        let orders = [];
        if (Array.isArray(payload)) {
          orders = payload;
        } else if (Array.isArray(payload?.data)) {
          orders = payload.data;
        }

        return {
          success: true,
          achats: mapOrdersToAchats(orders),
        };
      }

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
