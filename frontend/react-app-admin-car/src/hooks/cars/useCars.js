import { useState, useEffect, useCallback } from 'react';
import { getAllCars, createCar, updateCar, deleteCar, toggleCarAvailability, downloadCars } from '../../service/cars/carsService';
import toast from 'react-hot-toast';

export const useCars = () => {
    const sanitizeCarPayload = (payload) => {
      const next = payload ? { ...payload } : {};

      if (typeof next.image === 'string' && next.image.startsWith('blob:')) {
        next.image = null;
      }

      // Le backend lit un body JSON: retirer l'objet File local.
      delete next.imageFile;
      return next;
    };

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const normalizeCarsResponse = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.cars)) return response.cars;
    return [];
  };

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllCars();
      const normalized = normalizeCarsResponse(response);
      setCars(normalized);
    } catch (err) {
      setError(err.message);
      toast.error('Erreur lors du chargement des voitures');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  const addCar = async (data) => {
    try {
      await createCar(sanitizeCarPayload(data));
      toast.success('Voiture ajoutée');
      fetchCars();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'ajout');
      throw err;
    }
  };

  const editCar = async (carId, data) => {
    try {
      await updateCar(carId, sanitizeCarPayload(data));
      toast.success('Voiture modifiée');
      fetchCars();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la modification');
      throw err;
    }
  };

  const removeCar = async (carId) => {
    try {
      await deleteCar(carId);
      toast.success('Voiture supprimée');
      fetchCars();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression');
      throw err;
    }
  };

  const toggleAvailability = async (carId) => {
    try {
      await toggleCarAvailability(carId);
      fetchCars();
    } catch (err) {
      toast.error('Erreur lors du changement de disponibilité');
      throw err;
    }
  };

  const downloadCarsFile = async () => {
    try {
      const blob = await downloadCars();
      const url = globalThis.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'voitures.pdf');
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

  return { cars, loading, error, fetchCars, addCar, editCar, removeCar, toggleAvailability, downloadCarsFile };
};
