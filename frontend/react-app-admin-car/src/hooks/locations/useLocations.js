import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getAllLocations,
  updateLocationStatus,
  deleteLocation,
} from "../../service/locations/locationsService";

export const useLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllLocations();
      let normalized = [];
      if (Array.isArray(response)) {
        normalized = response;
      } else if (Array.isArray(response?.data)) {
        normalized = response.data;
      }
      setLocations(normalized);
    } catch (error) {
      const status = error?.response?.status;
      const message = String(error?.response?.data?.message || "").toLowerCase();

      if (status === 401 && (message.includes("utilisateur non trouv") || message.includes("admin non trouv"))) {
        setLocations([]);
      } else {
        toast.error(error?.response?.data?.message || "Erreur chargement locations");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const changeStatus = async (locationId, statut) => {
    await updateLocationStatus(locationId, statut);
    toast.success("Statut de location mis a jour");
    fetchLocations();
  };

  const removeLocation = async (locationId) => {
    await deleteLocation(locationId);
    toast.success("Location supprimee");
    fetchLocations();
  };

  return { locations, loading, fetchLocations, changeStatus, removeLocation };
};
