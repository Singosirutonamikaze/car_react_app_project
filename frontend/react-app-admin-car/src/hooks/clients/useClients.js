import { useState, useEffect, useCallback } from 'react';
import { getAllClients, createClient, updateClient, deleteClient, downloadClients } from '../../service/clients/clientsService';
import toast from 'react-hot-toast';

export const useClients = () => {
    const sanitizeClientPayload = (payload) => {
      const next = payload ? { ...payload } : {};

      if (typeof next.profileImageUrl === 'string' && next.profileImageUrl.startsWith('blob:')) {
        next.profileImageUrl = null;
      }

      // L'API clients admin est en JSON uniquement: ne pas envoyer File brut.
      delete next.profileImageFile;
      return next;
    };

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const normalizeClientsResponse = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.clients)) return response.clients;
    return [];
  };

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllClients();
      const normalized = normalizeClientsResponse(response);
      setClients(normalized);
    } catch (err) {
      setError(err.message);
      toast.error('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const addClient = async (data) => {
    try {
      await createClient(sanitizeClientPayload(data));
      toast.success('Client ajouté');
      fetchClients();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'ajout');
      throw err;
    }
  };

  const editClient = async (clientId, data) => {
    try {
      await updateClient(clientId, sanitizeClientPayload(data));
      toast.success('Client modifié');
      fetchClients();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la modification');
      throw err;
    }
  };

  const removeClient = async (clientId) => {
    try {
      await deleteClient(clientId);
      toast.success('Client supprimé');
      fetchClients();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression');
      throw err;
    }
  };

  const downloadClientsFile = async () => {
    try {
      const blob = await downloadClients();
      const url = globalThis.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'clients.pdf');
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

  return { clients, loading, error, fetchClients, addClient, editClient, removeClient, downloadClientsFile };
};
