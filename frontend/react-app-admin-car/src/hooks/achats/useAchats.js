import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getUserAchats,
  updateAchatStatus,
  addAchatEvaluation,
} from "../../service/achats/achatsService";

export const useAchats = () => {
  const [achats, setAchats] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAchats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUserAchats();
      let normalized = [];
      if (Array.isArray(response)) {
        normalized = response;
      } else if (Array.isArray(response?.data)) {
        normalized = response.data;
      }
      setAchats(normalized);
    } catch (error) {
      const status = error?.response?.status;
      const message = String(error?.response?.data?.message || "").toLowerCase();

      if (status === 401 && message.includes("utilisateur non trouv")) {
        setAchats([]);
      } else {
        toast.error(error?.response?.data?.message || "Erreur chargement achats");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAchats();
  }, [fetchAchats]);

  const changeStatus = async (achatId, statut) => {
    await updateAchatStatus(achatId, statut);
    toast.success("Statut d'achat mis a jour");
    fetchAchats();
  };

  const rateAchat = async (achatId, payload) => {
    await addAchatEvaluation(achatId, payload);
    toast.success("Evaluation enregistree");
    fetchAchats();
  };

  return { achats, loading, fetchAchats, changeStatus, rateAchat };
};
