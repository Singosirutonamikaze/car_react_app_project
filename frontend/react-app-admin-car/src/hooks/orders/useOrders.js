import { useState, useEffect, useCallback } from 'react';
import { getAllOrders, createOrder, updateOrder, deleteOrder, downloadOrders } from '../../service/orders/ordersService';
import toast from 'react-hot-toast';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const normalizeOrdersResponse = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.orders)) return response.orders;
    return [];
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllOrders();
      const normalized = normalizeOrdersResponse(response);
      setOrders(normalized);
    } catch (err) {
      setError(err.message);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const addOrder = async (data) => {
    try {
      await createOrder(data);
      toast.success('Commande ajoutée');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'ajout');
      throw err;
    }
  };

  const editOrder = async (orderId, data) => {
    try {
      await updateOrder(orderId, data);
      toast.success('Commande modifiée');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la modification');
      throw err;
    }
  };

  const removeOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      toast.success('Commande supprimée');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression');
      throw err;
    }
  };

  const downloadOrdersFile = async () => {
    try {
      const blob = await downloadOrders();
      const url = globalThis.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'commandes.pdf');
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

  return { orders, loading, error, fetchOrders, addOrder, editOrder, removeOrder, downloadOrdersFile };
};
