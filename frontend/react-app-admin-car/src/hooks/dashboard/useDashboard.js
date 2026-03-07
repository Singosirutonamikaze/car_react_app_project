import { useState, useEffect, useCallback } from 'react';
import { getDashboardData } from '../../service/dashboard/dashboardService';
import toast from 'react-hot-toast';

export const useDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboardData();
      setData(res);
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
