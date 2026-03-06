"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocationsByClient = exports.deleteLocation = exports.updateLocationStatut = exports.createLocation = exports.getLocationById = exports.getAllLocations = void 0;
const Location_1 = __importDefault(require("../models/Location"));
const Car_1 = __importDefault(require("../models/Car"));
const Client_1 = __importDefault(require("../models/Client"));
// Récupérer toutes les locations (admin)
const getAllLocations = async (req, res) => {
    try {
        const { statut, client, voiture } = req.query;
        const filter = {};
        if (statut)
            filter.statut = statut;
        if (client)
            filter.client = client;
        if (voiture)
            filter.voiture = voiture;
        const locations = await Location_1.default.find(filter)
            .populate('client', 'name surname email')
            .populate('voiture', 'marque modelCar year image')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: locations,
            count: locations.length
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des locations:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
};
exports.getAllLocations = getAllLocations;
// Récupérer une location par ID
const getLocationById = async (req, res) => {
    try {
        const { id } = req.params;
        const location = await Location_1.default.findById(id)
            .populate('client', 'name surname email')
            .populate('voiture', 'marque modelCar year image price');
        if (!location) {
            res.status(404).json({ success: false, message: 'Location non trouvée' });
            return;
        }
        res.status(200).json({ success: true, data: location });
    }
    catch (error) {
        console.error('Erreur lors de la récupération de la location:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
};
exports.getLocationById = getLocationById;
// Créer une nouvelle location
const createLocation = async (req, res) => {
    try {
        const { client, voiture, dateDebut, dateFin, prixParJour, modePaiement, notes } = req.body;
        if (!client || !voiture || !dateDebut || !dateFin || !prixParJour || !modePaiement) {
            res.status(400).json({
                success: false,
                message: 'Tous les champs obligatoires doivent être remplis'
            });
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
        const car = await Car_1.default.findById(voiture);
        if (!car) {
            res.status(404).json({ success: false, message: 'Voiture non trouvée' });
            return;
        }
        if (!car.disponible) {
            res.status(400).json({ success: false, message: 'Cette voiture n\'est pas disponible' });
            return;
        }
        // Vérifier que le client existe
        const clientDoc = await Client_1.default.findById(client);
        if (!clientDoc) {
            res.status(404).json({ success: false, message: 'Client non trouvé' });
            return;
        }
        // Calculer la durée et le montant total
        const duree = Math.ceil((fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24));
        const montantTotal = duree * prixParJour;
        const nouvelleLocation = new Location_1.default({
            client,
            voiture,
            dateDebut: debut,
            dateFin: fin,
            duree,
            prixParJour,
            montantTotal,
            modePaiement,
            notes,
            statut: 'En attente'
        });
        await nouvelleLocation.save();
        // Ajouter la location au client
        await Client_1.default.findByIdAndUpdate(client, {
            $push: { locations: nouvelleLocation._id }
        });
        const locationPopulee = await Location_1.default.findById(nouvelleLocation._id)
            .populate('client', 'name surname email')
            .populate('voiture', 'marque modelCar year image');
        res.status(201).json({
            success: true,
            message: 'Location créée avec succès',
            data: locationPopulee
        });
    }
    catch (error) {
        console.error('Erreur lors de la création de la location:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
};
exports.createLocation = createLocation;
// Mettre à jour le statut d'une location
const updateLocationStatut = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut, notes } = req.body;
        const statutsValides = ['En attente', 'Confirmée', 'En cours', 'Terminée', 'Annulée'];
        if (statut && !statutsValides.includes(statut)) {
            res.status(400).json({ success: false, message: 'Statut invalide' });
            return;
        }
        const updates = {};
        if (statut)
            updates.statut = statut;
        if (notes !== undefined)
            updates.notes = notes;
        const location = await Location_1.default.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true
        })
            .populate('client', 'name surname email')
            .populate('voiture', 'marque modelCar year image');
        if (!location) {
            res.status(404).json({ success: false, message: 'Location non trouvée' });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Location mise à jour avec succès',
            data: location
        });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour de la location:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
};
exports.updateLocationStatut = updateLocationStatut;
// Supprimer une location
const deleteLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const location = await Location_1.default.findByIdAndDelete(id);
        if (!location) {
            res.status(404).json({ success: false, message: 'Location non trouvée' });
            return;
        }
        // Retirer la référence du client
        await Client_1.default.findByIdAndUpdate(location.client, {
            $pull: { locations: location._id }
        });
        res.status(200).json({ success: true, message: 'Location supprimée avec succès' });
    }
    catch (error) {
        console.error('Erreur lors de la suppression de la location:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
};
exports.deleteLocation = deleteLocation;
// Récupérer les locations d'un client spécifique
const getLocationsByClient = async (req, res) => {
    try {
        const { clientId } = req.params;
        const locations = await Location_1.default.find({ client: clientId })
            .populate('voiture', 'marque modelCar year image')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: locations,
            count: locations.length
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des locations du client:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
};
exports.getLocationsByClient = getLocationsByClient;
