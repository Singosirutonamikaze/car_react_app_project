import { useState, useEffect, useCallback } from 'react';
import { getAllSales, createSale, updateSale, updateSaleStatus, deleteSale, exportSales } from '../../service/sales/salesService';
import toast from 'react-hot-toast';

export const useSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const normalizeSalesResponse = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.ventes)) return response.ventes;
    if (Array.isArray(response?.sales)) return response.sales;
    return [];
  };

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllSales();
      const normalized = normalizeSalesResponse(response);
      setSales(normalized);
    } catch (err) {
      setError(err.message);
      toast.error('Erreur lors du chargement des ventes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSales(); }, [fetchSales]);

  const addSale = async (data) => {
    try {
      await createSale(data);
      toast.success('Vente ajoutée');
      fetchSales();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'ajout');
      throw err;
    }
  };

  const editSale = async (saleId, data) => {
    try {
      await updateSale(saleId, data);
      toast.success('Vente modifiée');
      fetchSales();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la modification');
      throw err;
    }
  };

  const changeStatus = async (saleId, status) => {
    try {
      await updateSaleStatus(saleId, status);
      toast.success('Statut mis à jour');
      fetchSales();
    } catch (err) {
      toast.error('Erreur lors du changement de statut');
      throw err;
    }
  };

  const removeSale = async (saleId) => {
    try {
      await deleteSale(saleId);
      toast.success('Vente supprimée');
      fetchSales();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression');
      throw err;
    }
  };

  const exportSalesFile = async () => {
    try {
      const blob = await exportSales();
      const url = globalThis.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ventes.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      globalThis.URL.revokeObjectURL(url);
      toast.success('PDF téléchargé');
    } catch (err) {
      toast.error('Erreur lors du téléchargement');
      throw err;
    }
  };

  return { sales, loading, error, fetchSales, addSale, editSale, changeStatus, removeSale, exportSalesFile };
};
