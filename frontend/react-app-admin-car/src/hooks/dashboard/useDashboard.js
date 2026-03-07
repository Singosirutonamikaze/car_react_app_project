import { useState, useEffect, useCallback } from 'react';
import { getDashboardData } from '../../service/dashboard/dashboardService';
import { getAllLocations } from '../../service/locations/locationsService';
import toast from 'react-hot-toast';

const normalizeStatus = (value) =>
  String(value || '')
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const isActiveLocationStatus = (status) => {
  const normalized = normalizeStatus(status);
  return normalized === 'confirmee' || normalized === 'en cours' || normalized === 'terminee';
};

const extractLocations = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.locations)) return response.locations;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.locations)) return response.data.locations;
  return [];
};

export const useDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboardData();
      let enriched = res;

      try {
        const locationsResponse = await getAllLocations();
        const locations = extractLocations(locationsResponse);

        if (locations.length > 0) {
          const now = new Date();
          const thirtyDaysAgo = new Date(now);
          thirtyDaysAgo.setDate(now.getDate() - 30);

          const activeCount = locations.filter((item) =>
            isActiveLocationStatus(item?.statut),
          ).length;

          const locationsLast30Days = locations.filter((item) => {
            const dateValue = item?.createdAt || item?.dateCreation || item?.dateDebut;
            if (!dateValue) return false;
            const date = new Date(dateValue);
            return !Number.isNaN(date.getTime()) && date >= thirtyDaysAgo;
          }).length;

          const currentLoue = Number(res?.voitures?.loue || 0);
          const currentLocations30Jours = Number(res?.statistiques?.locations30Jours || 0);

          enriched = {
            ...res,
            voitures: {
              ...res?.voitures,
              loue: Math.max(currentLoue, activeCount),
            },
            statistiques: {
              ...res?.statistiques,
              locations30Jours: Math.max(currentLocations30Jours, locationsLast30Days),
            },
          };
        }
      } catch {
        // Keep dashboard payload if locations fallback is unavailable.
      }

      setData(enriched);
    } catch (err) {
      setError(err.message);
      toast.error('Erreur lors du chargement du tableau de bord');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
