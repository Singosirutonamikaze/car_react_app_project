"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFavoriteClean = exports.toggleFavoriteSimple = exports.toggleFavorite = exports.removeFavorite = exports.addFavorite = exports.getUserFavorites = void 0;
const Favorites_1 = require("../models/Favorites");
const Client_1 = __importDefault(require("../models/Client"));
const mongoose_1 = require("mongoose");
const getUserFavorites = async (req, res) => {
    try {
        const userId = req.user?.id;
        const page = Number.parseInt(req.query.page) || 1;
        const limit = Number.parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }
        const user = await Client_1.default.findById(userId).populate({
            path: 'favorites',
            populate: {
                path: 'voiture',
                select: 'marque modele annee prix images disponible kilometrage carburant'
            },
            options: {
                sort: { dateAjout: -1 },
                skip: skip,
                limit: limit
            }
        });
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }
        // Conversion sûre pour le comptage
        const favoriteIds = (user.favorites || []).map(fav => fav instanceof mongoose_1.Types.ObjectId ? fav : new mongoose_1.Types.ObjectId(fav));
        const totalFavorites = await Favorites_1.FavoriteModel.countDocuments({
            _id: { $in: favoriteIds }
        });
        res.status(200).json({
            favorites: user.favorites || [],
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalFavorites / limit),
                totalCount: totalFavorites,
                hasNextPage: page * limit < totalFavorites,
                hasPrevPage: page > 1
            },
            success: true
        });
    }
    catch (error) {
        console.error("Erreur getUserFavorites :", error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};
exports.getUserFavorites = getUserFavorites;
// Ajouter un favori
const addFavorite = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { voitureId, notes } = req.body;
        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }
        if (!voitureId) {
            res.status(400).json({ message: 'ID de voiture requis.' });
            return;
        }
        // Vérifier si déjà en favoris
        const user = await Client_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }
        // Vérifier si la voiture est déjà en favoris AVANT de créer le document
        const existingFavoriteInDb = await Favorites_1.FavoriteModel.findOne({ voiture: voitureId });
        if (existingFavoriteInDb && user.favorites) {
            const favoriteExists = user.favorites.some(fav => {
                const favId = fav instanceof mongoose_1.Types.ObjectId ? fav : new mongoose_1.Types.ObjectId(fav);
                return favId.equals(existingFavoriteInDb._id);
            });
            if (favoriteExists) {
                res.status(409).json({ message: 'Voiture déjà en favoris.' });
                return;
            }
        }
        // Créer le favori
        const newFavorite = new Favorites_1.FavoriteModel({
            voiture: voitureId,
            notes: notes || undefined
        });
        const savedFavorite = await newFavorite.save();
        // Ajouter à l'utilisateur
        user.favorites = user.favorites || [];
        user.favorites.push(savedFavorite._id);
        await user.save();
        // Populer la réponse
        const populatedFavorite = await Favorites_1.FavoriteModel.findById(savedFavorite._id)
            .populate('voiture', 'marque modele annee prix images disponible');
        res.status(201).json({
            message: 'Ajouté aux favoris.',
            favorite: populatedFavorite,
            success: true
        });
    }
    catch (error) {
        console.error("Erreur addFavorite :", error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};
exports.addFavorite = addFavorite;
// Supprimer un favori
const removeFavorite = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { favoriteId } = req.params;
        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }
        if (!favoriteId || !mongoose_1.Types.ObjectId.isValid(favoriteId)) {
            res.status(400).json({ message: 'ID de favori invalide.' });
            return;
        }
        const user = await Client_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }
        const favoriteObjectId = new mongoose_1.Types.ObjectId(favoriteId);
        // Supprimer de l'utilisateur avec gestion de type sûre
        user.favorites = user.favorites?.filter(fav => {
            const favId = fav instanceof mongoose_1.Types.ObjectId ? fav : new mongoose_1.Types.ObjectId(fav);
            return !favId.equals(favoriteObjectId);
        }) || [];
        await user.save();
        // Supprimer le document favori
        await Favorites_1.FavoriteModel.findByIdAndDelete(favoriteObjectId);
        res.status(200).json({
            message: 'Supprimé des favoris.',
            success: true
        });
    }
    catch (error) {
        console.error("Erreur removeFavorite :", error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};
exports.removeFavorite = removeFavorite;
const toggleFavorite = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { voitureId } = req.body;
        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }
        if (!voitureId || !mongoose_1.Types.ObjectId.isValid(voitureId)) {
            res.status(400).json({ message: 'ID de voiture invalide.' });
            return;
        }
        const user = await Client_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }
        // Chercher si la voiture est déjà en favoris
        const existingFavorite = await Favorites_1.FavoriteModel.findOne({ voiture: voitureId });
        let favoriteExists = false;
        if (existingFavorite && user.favorites) {
            favoriteExists = user.favorites.some(fav => {
                const favId = fav instanceof mongoose_1.Types.ObjectId ? fav : new mongoose_1.Types.ObjectId(fav);
                return favId.equals(existingFavorite._id);
            });
        }
        if (favoriteExists && existingFavorite) {
            // Supprimer
            user.favorites = user.favorites?.filter(fav => {
                const favId = fav instanceof mongoose_1.Types.ObjectId ? fav : new mongoose_1.Types.ObjectId(fav);
                return !favId.equals(existingFavorite._id);
            }) || [];
            await user.save();
            await Favorites_1.FavoriteModel.findByIdAndDelete(existingFavorite._id);
            res.status(200).json({
                message: 'Supprimé des favoris.',
                isFavorite: false,
                success: true
            });
        }
        else {
            // Ajouter
            const newFavorite = new Favorites_1.FavoriteModel({ voiture: voitureId });
            const savedFavorite = await newFavorite.save();
            user.favorites = user.favorites || [];
            user.favorites.push(savedFavorite._id);
            await user.save();
            res.status(200).json({
                message: 'Ajouté aux favoris.',
                isFavorite: true,
                favoriteId: savedFavorite._id,
                success: true
            });
        }
    }
    catch (error) {
        console.error("Erreur toggleFavorite :", error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};
exports.toggleFavorite = toggleFavorite;
// Version alternative plus simple du toggle si vous préférez
const toggleFavoriteSimple = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { voitureId } = req.body;
        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }
        if (!voitureId || !mongoose_1.Types.ObjectId.isValid(voitureId)) {
            res.status(400).json({ message: 'ID de voiture invalide.' });
            return;
        }
        const user = await Client_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }
        const voitureObjectId = new mongoose_1.Types.ObjectId(String(voitureId));
        // Chercher un favori existant pour cette voiture ET cet utilisateur
        const existingFavorite = await Favorites_1.FavoriteModel.findOne({
            voiture: voitureObjectId,
            _id: { $in: user.favorites || [] }
        });
        if (existingFavorite) {
            // Supprimer
            user.favorites = user.favorites?.filter(fav => {
                const favId = fav instanceof mongoose_1.Types.ObjectId ? fav : new mongoose_1.Types.ObjectId(fav);
                return !favId.equals(existingFavorite._id);
            }) || [];
            await user.save();
            await Favorites_1.FavoriteModel.findByIdAndDelete(existingFavorite._id);
            res.status(200).json({
                message: 'Supprimé des favoris.',
                isFavorite: false,
                success: true
            });
        }
        else {
            // Ajouter
            const newFavorite = new Favorites_1.FavoriteModel({ voiture: voitureObjectId });
            const savedFavorite = await newFavorite.save();
            user.favorites = user.favorites || [];
            user.favorites.push(savedFavorite._id);
            await user.save();
            res.status(200).json({
                message: 'Ajouté aux favoris.',
                isFavorite: true,
                favoriteId: savedFavorite._id,
                success: true
            });
        }
    }
    catch (error) {
        console.error("Erreur toggleFavoriteSimple :", error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};
exports.toggleFavoriteSimple = toggleFavoriteSimple;
// Fonction utilitaire pour conversion sûre des ObjectId
const toObjectId = (value) => {
    if (value instanceof mongoose_1.Types.ObjectId) {
        return value;
    }
    if (typeof value === 'string' && mongoose_1.Types.ObjectId.isValid(value)) {
        return new mongoose_1.Types.ObjectId(value);
    }
    throw new Error('Invalid ObjectId format');
};
// Version avec fonction utilitaire (plus propre)
const toggleFavoriteClean = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { voitureId } = req.body;
        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }
        if (!voitureId || !mongoose_1.Types.ObjectId.isValid(voitureId)) {
            res.status(400).json({ message: 'ID de voiture invalide.' });
            return;
        }
        const user = await Client_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }
        const voitureObjectId = new mongoose_1.Types.ObjectId(String(voitureId));
        // Conversion sûre des favoris en ObjectIds
        const favoriteIds = (user.favorites || []).map(fav => {
            try {
                return toObjectId(fav);
            }
            catch {
                return null;
            }
        }).filter(id => id !== null);
        // Chercher si déjà en favoris
        const existingFavorite = await Favorites_1.FavoriteModel.findOne({
            voiture: voitureObjectId,
            _id: { $in: favoriteIds }
        });
        if (existingFavorite) {
            // Supprimer
            user.favorites = favoriteIds.filter(favId => !favId.equals(existingFavorite._id));
            await user.save();
            await Favorites_1.FavoriteModel.findByIdAndDelete(existingFavorite._id);
            res.status(200).json({
                message: 'Supprimé des favoris.',
                isFavorite: false,
                success: true
            });
        }
        else {
            // Ajouter
            const newFavorite = new Favorites_1.FavoriteModel({ voiture: voitureObjectId });
            const savedFavorite = await newFavorite.save();
            user.favorites = [...favoriteIds, savedFavorite._id];
            await user.save();
            res.status(200).json({
                message: 'Ajouté aux favoris.',
                isFavorite: true,
                favoriteId: savedFavorite._id,
                success: true
            });
        }
    }
    catch (error) {
        console.error("Erreur toggleFavoriteClean :", error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};
exports.toggleFavoriteClean = toggleFavoriteClean;
