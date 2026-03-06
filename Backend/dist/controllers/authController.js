"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDataCompatible = exports.getUserDataPaginated = exports.getUserDataLight = exports.getUserDataEnhanced = exports.getUserData = exports.updateUserProfile = exports.getUserInfo = exports.loginUser = exports.registerUser = void 0;
const Client_1 = __importDefault(require("../models/Client"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const mongoose_1 = require("mongoose");
const registerUser = async (req, res) => {
    try {
        const { name, surname, email, password } = req.body;
        if (!name || !surname || !email || !password) {
            res.status(400).json({ message: "S'il vous plaît, remplissez tous les champs." });
            return;
        }
        const existingUser = await Client_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
            return;
        }
        const profileImageUrl = req.file ? `/uploads/${req.file.filename}` : (req.body.profileImageUrl || null);
        const newUser = new Client_1.default({
            name,
            surname,
            email,
            password,
            profileImageUrl,
        });
        await newUser.save();
        const token = (0, generateToken_1.default)(newUser._id.toString());
        const userToReturn = newUser.toObject();
        delete userToReturn['password'];
        res.status(201).json({ token, user: userToReturn });
    }
    catch (error) {
        const mongoErr = error;
        if (mongoErr?.code === 11000 && mongoErr.keyPattern?.email) {
            res.status(400).json({ message: "L'email est déjà utilisé." });
            return;
        }
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            res.status(400).json({ message: "S'il vous plaît, remplissez tous les champs." });
            return;
        }
        const user = await Client_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Utilisateur non trouvé.' });
            return;
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Mot de passe incorrect.' });
            return;
        }
        const token = (0, generateToken_1.default)(user._id.toString());
        const userToReturn = user.toObject();
        delete userToReturn['password'];
        res.status(200).json({ token, user: userToReturn });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};
exports.loginUser = loginUser;
const getUserInfo = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }
        const user = await Client_1.default.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }
        res.status(200).json({ user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};
exports.getUserInfo = getUserInfo;
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { name, surname, profileImageUrl } = req.body;
        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }
        const updatedUser = await Client_1.default.findByIdAndUpdate(userId, {
            ...(name && { name }),
            ...(surname && { surname }),
            ...(profileImageUrl !== undefined && { profileImageUrl })
        }, { new: true, runValidators: true }).select('-password');
        if (!updatedUser) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }
        res.status(200).json({
            user: updatedUser,
            message: 'Profil mis à jour avec succès.',
            success: true
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};
exports.updateUserProfile = updateUserProfile;
const getUserData = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }
        if (!mongoose_1.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'ID utilisateur invalide.' });
            return;
        }
        const user = await Client_1.default.findById(userId)
            .select('-password')
            .populate({
            path: 'commandes',
            options: { sort: { dateCommande: -1 }, limit: 1 }
        });
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }
        const userObject = user.toObject();
        if (user.commandes && user.commandes.length > 0) {
            userObject['lastCommande'] = user.commandes[0];
        }
        else {
            userObject['lastCommande'] = null;
        }
        delete userObject['commandes'];
        res.status(200).json({ user: userObject });
    }
    catch (error) {
        console.error("Erreur getUserData :", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};
exports.getUserData = getUserData;
const getUserDataEnhanced = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }
        if (!mongoose_1.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'ID utilisateur invalide.' });
            return;
        }
        const user = await Client_1.default.findById(userId)
            .select('-password')
            .populate([
            {
                path: 'commandes',
                populate: {
                    path: 'voiture',
                    select: 'marque modele annee prix images'
                },
                options: { sort: { dateCommande: -1 } }
            },
            {
                path: 'favorites',
                populate: {
                    path: 'voiture',
                    select: 'marque modele annee prix images disponible'
                }
            }
        ]);
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }
        const enrichedUser = user.toObject();
        const commandes = user.commandes || [];
        const favorites = user.favorites || [];
        enrichedUser['lastCommande'] = commandes[0] || null;
        enrichedUser['stats'] = {
            totalCommandes: commandes.length,
            commandesEnCours: commandes.filter(cmd => ['En attente', 'Confirmée', 'En cours'].includes(cmd.statut)).length,
            commandesLivrees: commandes.filter(cmd => cmd.statut === 'Livrée').length,
            commandesAnnulees: commandes.filter(cmd => cmd.statut === 'Annulée').length,
            totalFavorites: favorites.length,
            montantTotalCommandes: commandes.reduce((total, cmd) => total + (cmd.montantTotal || 0), 0)
        };
        enrichedUser['recentCommandes'] = commandes.slice(0, 5);
        enrichedUser['recentFavorites'] = [...favorites]
            .sort((a, b) => new Date(b.dateAjout || 0).getTime() - new Date(a.dateAjout || 0).getTime())
            .slice(0, 5);
        if (commandes.length > 0) {
            const marques = commandes
                .map(cmd => cmd.voiture?.marque)
                .filter((marque) => Boolean(marque));
            const marqueCount = marques.reduce((acc, marque) => {
                acc[marque] = (acc[marque] || 0) + 1;
                return acc;
            }, {});
            enrichedUser['preferences'] = {
                marquesFavorites: Object.entries(marqueCount)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([marque, count]) => ({ marque, count }))
            };
        }
        delete enrichedUser['commandes'];
        delete enrichedUser['favorites'];
        res.status(200).json({
            user: enrichedUser,
            success: true
        });
    }
    catch (error) {
        console.error("Erreur getUserDataEnhanced :", error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};
exports.getUserDataEnhanced = getUserDataEnhanced;
const getUserDataLight = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }
        if (!mongoose_1.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'ID utilisateur invalide.' });
            return;
        }
        const user = await Client_1.default.findById(userId)
            .select('name surname email profileImageUrl createdAt updatedAt');
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }
        res.status(200).json({
            user: user.toObject(),
            success: true
        });
    }
    catch (error) {
        console.error("Erreur getUserDataLight :", error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};
exports.getUserDataLight = getUserDataLight;
const getUserDataPaginated = async (req, res) => {
    try {
        const userId = req.user?.id;
        const commandesPage = Number.parseInt(req.query.commandesPage) || 1;
        const commandesLimit = Number.parseInt(req.query.commandesLimit) || 5;
        const favoritesPage = Number.parseInt(req.query.favoritesPage) || 1;
        const favoritesLimit = Number.parseInt(req.query.favoritesLimit) || 5;
        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }
        if (!mongoose_1.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'ID utilisateur invalide.' });
            return;
        }
        const user = await Client_1.default.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }
        const [totalCommandes, totalFavorites] = await Promise.all([
            Client_1.default.aggregate([
                { $match: { _id: new mongoose_1.Types.ObjectId(userId) } },
                { $project: { commandesCount: { $size: { $ifNull: ['$commandes', []] } } } }
            ]),
            Client_1.default.aggregate([
                { $match: { _id: new mongoose_1.Types.ObjectId(userId) } },
                { $project: { favoritesCount: { $size: { $ifNull: ['$favorites', []] } } } }
            ])
        ]);
        const userWithCommandes = await Client_1.default.findById(userId)
            .populate({
            path: 'commandes',
            populate: {
                path: 'voiture',
                select: 'marque modele annee prix images'
            },
            options: {
                sort: { dateCommande: -1 },
                skip: (commandesPage - 1) * commandesLimit,
                limit: commandesLimit
            }
        });
        const userWithFavorites = await Client_1.default.findById(userId)
            .populate({
            path: 'favorites',
            populate: {
                path: 'voiture',
                select: 'marque modele annee prix images disponible'
            },
            options: {
                sort: { dateAjout: -1 },
                skip: (favoritesPage - 1) * favoritesLimit,
                limit: favoritesLimit
            }
        });
        const enrichedUser = user.toObject();
        const commandes = userWithCommandes?.commandes || [];
        const favorites = userWithFavorites?.favorites || [];
        const totalCommandesCount = totalCommandes[0]?.commandesCount || 0;
        const totalFavoritesCount = totalFavorites[0]?.favoritesCount || 0;
        enrichedUser['commandesPaginated'] = {
            data: commandes,
            pagination: {
                currentPage: commandesPage,
                totalPages: Math.ceil(totalCommandesCount / commandesLimit),
                totalCount: totalCommandesCount,
                hasNextPage: commandesPage * commandesLimit < totalCommandesCount,
                hasPrevPage: commandesPage > 1
            }
        };
        enrichedUser['favoritesPaginated'] = {
            data: favorites,
            pagination: {
                currentPage: favoritesPage,
                totalPages: Math.ceil(totalFavoritesCount / favoritesLimit),
                totalCount: totalFavoritesCount,
                hasNextPage: favoritesPage * favoritesLimit < totalFavoritesCount,
                hasPrevPage: favoritesPage > 1
            }
        };
        enrichedUser['stats'] = {
            totalCommandes: totalCommandesCount,
            totalFavorites: totalFavoritesCount,
            lastCommande: commandes[0] || null
        };
        res.status(200).json({
            user: enrichedUser,
            success: true
        });
    }
    catch (error) {
        console.error("Erreur getUserDataPaginated :", error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};
exports.getUserDataPaginated = getUserDataPaginated;
const getUserDataCompatible = async (req, res) => {
    try {
        const userId = req.user?.id;
        const enhanced = req.query.enhanced === 'true';
        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }
        if (!mongoose_1.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'ID utilisateur invalide.' });
            return;
        }
        if (enhanced) {
            return (0, exports.getUserDataEnhanced)(req, res);
        }
        else {
            return (0, exports.getUserData)(req, res);
        }
    }
    catch (error) {
        console.error("Erreur getUserDataCompatible :", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};
exports.getUserDataCompatible = getUserDataCompatible;
