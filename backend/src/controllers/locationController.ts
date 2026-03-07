import { Request, Response } from 'express';
import LocationModel from '../models/Location';
import CarModel from '../models/Car';
import UserModel from '../models/Client';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

// Récupérer toutes les locations (admin)
export const getAllLocations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { statut, client, voiture } = req.query;

    const filter: any = {};
    if (statut) filter.statut = statut;
    if (client) filter.client = client;
    if (voiture) filter.voiture = voiture;

    const locations = await LocationModel.find(filter)
      .populate('client', 'name surname email')
      .populate('voiture', 'marque modelCar year image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: locations,
      count: locations.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des locations:', error);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
};

// Récupérer une location par ID
export const getLocationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const location = await LocationModel.findById(id)
      .populate('client', 'name surname email')
      .populate('voiture', 'marque modelCar year image price');

    if (!location) {
      res.status(404).json({ success: false, message: 'Location non trouvée' });
      return;
    }

    res.status(200).json({ success: true, data: location });
  } catch (error) {
    console.error('Erreur lors de la récupération de la location:', error);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
};

// Créer une nouvelle location
export const createLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { client, voiture, dateDebut, dateFin, prixParJour, modePaiement, notes } = req.body;
    const resolvedClientId = authReq.user?.id || client;

    if (!resolvedClientId || !voiture || !dateDebut || !dateFin || !prixParJour || !modePaiement) {
      res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis'
      });
      return;
    }

    const prixParJourNumber = Number(prixParJour);
    if (!Number.isFinite(prixParJourNumber) || prixParJourNumber <= 0) {
      res.status(400).json({ success: false, message: 'Prix par jour invalide' });
      return;
    }

    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);

    if (fin <= debut) {
      res.status(400).json({
        success: false,
        message: 'La date de fin doit être postérieure à la date de début'
      });
      return;
    }

    // Vérifier que la voiture existe et est disponible
    const car = await CarModel.findById(voiture);
    if (!car) {
      res.status(404).json({ success: false, message: 'Voiture non trouvée' });
      return;
    }
    if (!car.disponible) {
      res.status(400).json({ success: false, message: 'Cette voiture n\'est pas disponible' });
      return;
    }

    // Vérifier que le client existe
    const clientDoc = await UserModel.findById(resolvedClientId);
    if (!clientDoc) {
      res.status(404).json({ success: false, message: 'Client non trouvé' });
      return;
    }

    // Calculer la durée et le montant total
    const duree = Math.ceil((fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24));
    const montantTotal = duree * prixParJourNumber;

    const nouvelleLocation = new LocationModel({
      client: resolvedClientId,
      voiture,
      dateDebut: debut,
      dateFin: fin,
      duree,
      prixParJour: prixParJourNumber,
      montantTotal,
      modePaiement,
      notes,
      statut: 'En attente'
    });

    await nouvelleLocation.save();

    // Ajouter la location au client
    await UserModel.findByIdAndUpdate(resolvedClientId, {
      $push: { locations: nouvelleLocation._id }
    });

    const locationPopulee = await LocationModel.findById(nouvelleLocation._id)
      .populate('client', 'name surname email')
      .populate('voiture', 'marque modelCar year image price');

    res.status(201).json({
      success: true,
      message: 'Location créée avec succès',
      data: locationPopulee
    });
  } catch (error) {
    console.error('Erreur lors de la création de la location:', error);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
};

// Mettre à jour le statut d'une location
export const updateLocationStatut = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { statut, notes } = req.body;

    const statutsValides = ['En attente', 'Confirmée', 'En cours', 'Terminée', 'Annulée'];
    if (statut && !statutsValides.includes(statut)) {
      res.status(400).json({ success: false, message: 'Statut invalide' });
      return;
    }

    const updates: any = {};
    if (statut) updates.statut = statut;
    if (notes !== undefined) updates.notes = notes;

    const location = await LocationModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    })
      .populate('client', 'name surname email')
      .populate('voiture', 'marque modelCar year image price');

    if (!location) {
      res.status(404).json({ success: false, message: 'Location non trouvée' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Location mise à jour avec succès',
      data: location
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la location:', error);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
};

// Supprimer une location
export const deleteLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const location = await LocationModel.findByIdAndDelete(id);
    if (!location) {
      res.status(404).json({ success: false, message: 'Location non trouvée' });
      return;
    }

    // Retirer la référence du client
    await UserModel.findByIdAndUpdate(location.client, {
      $pull: { locations: location._id }
    });

    res.status(200).json({ success: true, message: 'Location supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la location:', error);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
};

// Récupérer les locations d'un client spécifique
export const getLocationsByClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clientId } = req.params;

    const locations = await LocationModel.find({ client: clientId })
      .populate('voiture', 'marque modelCar year image price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: locations,
      count: locations.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des locations du client:', error);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
};
