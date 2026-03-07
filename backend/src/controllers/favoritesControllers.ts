import { Request, Response } from 'express';
import { FavoriteModel } from '../models/Favorites';
import UserModel from '../models/Client';
import { Types } from 'mongoose';

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}

export const getUserFavorites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const page = Number.parseInt(req.query.page as string) || 1;
        const limit = Number.parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;

        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }

        const user = await UserModel.findById(userId).populate({
            path: 'favorites',
            populate: {
                path: 'voiture',
                select: 'marque modelCar year price image disponible kilometrage carburant'
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
        const favoriteIds = (user.favorites || []).map(fav =>
            fav instanceof Types.ObjectId ? fav : new Types.ObjectId(fav as string)
        );

        const totalFavorites = await FavoriteModel.countDocuments({
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

    } catch (error) {
        console.error("Erreur getUserFavorites :", error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};

export const getAllFavoritesAdmin = async (_req: Request, res: Response): Promise<void> => {
    try {
        const favorites = await FavoriteModel.find({})
            .populate('voiture', 'marque modelCar year price image disponible kilometrage carburant')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            favorites,
            count: favorites.length
        });
    } catch (error) {
        console.error('Erreur getAllFavoritesAdmin :', error);
        res.status(500).json({
            message: 'Erreur interne du serveur.',
            success: false
        });
    }
};

// Ajouter un favori
export const addFavorite = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { notes } = req.body;
        const voitureId = req.body?.voitureId ?? req.body?.carId;

        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }

        if (!voitureId || !Types.ObjectId.isValid(String(voitureId))) {
            res.status(400).json({ message: 'ID de voiture requis.' });
            return;
        }

        const voitureObjectId = new Types.ObjectId(String(voitureId));

        // Vérifier si déjà en favoris
        const user = await UserModel.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }

        // Vérifier si la voiture est déjà en favoris AVANT de créer le document
        const existingFavoriteInDb = await FavoriteModel.findOne({ voiture: voitureObjectId });

        if (existingFavoriteInDb && user.favorites) {
            const favoriteExists = user.favorites.some(fav => {
                const favId = fav instanceof Types.ObjectId ? fav : new Types.ObjectId(fav as string);
                return favId.equals(existingFavoriteInDb._id as Types.ObjectId);
            });

            if (favoriteExists) {
                res.status(409).json({ message: 'Voiture déjà en favoris.' });
                return;
            }
        }

        // Créer le favori
        const newFavorite = new FavoriteModel({
            voiture: voitureObjectId,
            notes: notes || undefined
        });

        const savedFavorite = await newFavorite.save();

        // Ajouter à l'utilisateur
        user.favorites = user.favorites || [];
        user.favorites.push(savedFavorite._id as Types.ObjectId);
        await user.save();

        // Populer la réponse
        const populatedFavorite = await FavoriteModel.findById(savedFavorite._id)
            .populate('voiture', 'marque modelCar year price image disponible');

        res.status(201).json({
            message: 'Ajouté aux favoris.',
            favorite: populatedFavorite,
            success: true
        });

    } catch (error) {
        console.error("Erreur addFavorite :", error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};

// Supprimer un favori
export const removeFavorite = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { favoriteId } = req.params;

        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }

        if (!favoriteId || !Types.ObjectId.isValid(favoriteId)) {
            res.status(400).json({ message: 'ID de favori invalide.' });
            return;
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }

        const favoriteObjectId = new Types.ObjectId(favoriteId);

        // Supprimer de l'utilisateur avec gestion de type sûre
        user.favorites = user.favorites?.filter(fav => {
            const favId = fav instanceof Types.ObjectId ? fav : new Types.ObjectId(fav as string);
            return !favId.equals(favoriteObjectId);
        }) || [];

        await user.save();

        // Supprimer le document favori
        await FavoriteModel.findByIdAndDelete(favoriteObjectId);

        res.status(200).json({
            message: 'Supprimé des favoris.',
            success: true
        });

    } catch (error) {
        console.error("Erreur removeFavorite :", error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};

export const removeFavoriteAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { favoriteId } = req.params;

        if (!favoriteId || !Types.ObjectId.isValid(favoriteId)) {
            res.status(400).json({ message: 'ID de favori invalide.', success: false });
            return;
        }

        const favoriteObjectId = new Types.ObjectId(favoriteId);
        const deleted = await FavoriteModel.findByIdAndDelete(favoriteObjectId);

        if (!deleted) {
            res.status(404).json({ message: 'Favori non trouvé.', success: false });
            return;
        }

        await UserModel.updateMany(
            { favorites: favoriteObjectId },
            { $pull: { favorites: favoriteObjectId } }
        );

        res.status(200).json({
            message: 'Favori supprimé avec succès.',
            success: true
        });
    } catch (error) {
        console.error('Erreur removeFavoriteAdmin :', error);
        res.status(500).json({
            message: 'Erreur interne du serveur.',
            success: false
        });
    }
};

export const toggleFavorite = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const voitureId = req.body?.voitureId ?? req.body?.carId;

        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }

        if (!voitureId || !Types.ObjectId.isValid(String(voitureId))) {
            res.status(400).json({ message: 'ID de voiture invalide.' });
            return;
        }

        const voitureObjectId = new Types.ObjectId(String(voitureId));

        const user = await UserModel.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }

        // Chercher si la voiture est déjà en favoris
        const existingFavorite = await FavoriteModel.findOne({ voiture: voitureObjectId });

        let favoriteExists = false;
        if (existingFavorite && user.favorites) {
            favoriteExists = user.favorites.some(fav => {
                const favId = fav instanceof Types.ObjectId ? fav : new Types.ObjectId(fav as string);
                return favId.equals(existingFavorite._id as Types.ObjectId);
            });
        }

        if (favoriteExists && existingFavorite) {
            // Supprimer
            user.favorites = user.favorites?.filter(fav => {
                const favId = fav instanceof Types.ObjectId ? fav : new Types.ObjectId(fav as string);
                return !favId.equals(existingFavorite._id as Types.ObjectId);
            }) || [];

            await user.save();
            await FavoriteModel.findByIdAndDelete(existingFavorite._id as Types.ObjectId);

            res.status(200).json({
                message: 'Supprimé des favoris.',
                isFavorite: false,
                success: true
            });
        } else {
            // Ajouter
            const newFavorite = new FavoriteModel({ voiture: voitureObjectId });
            const savedFavorite = await newFavorite.save();

            user.favorites = user.favorites || [];
            user.favorites.push(savedFavorite._id as Types.ObjectId);
            await user.save();

            res.status(200).json({
                message: 'Ajouté aux favoris.',
                isFavorite: true,
                favoriteId: savedFavorite._id,
                success: true
            });
        }

    } catch (error) {
        console.error("Erreur toggleFavorite :", error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};

// Version alternative plus simple du toggle si vous préférez
export const toggleFavoriteSimple = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const voitureId = req.body?.voitureId ?? req.body?.carId;

        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }

        if (!voitureId || !Types.ObjectId.isValid(String(voitureId))) {
            res.status(400).json({ message: 'ID de voiture invalide.' });
            return;
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }

        const voitureObjectId = new Types.ObjectId(String(voitureId));

        // Chercher un favori existant pour cette voiture ET cet utilisateur
        const existingFavorite = await FavoriteModel.findOne({
            voiture: voitureObjectId,
            _id: { $in: user.favorites || [] }
        });

        if (existingFavorite) {
            // Supprimer
            user.favorites = user.favorites?.filter(fav => {
                const favId = fav instanceof Types.ObjectId ? fav : new Types.ObjectId(fav as string);
                return !favId.equals(existingFavorite._id as Types.ObjectId);
            }) || [];

            await user.save();
            await FavoriteModel.findByIdAndDelete(existingFavorite._id as Types.ObjectId);

            res.status(200).json({
                message: 'Supprimé des favoris.',
                isFavorite: false,
                success: true
            });
        } else {
            // Ajouter
            const newFavorite = new FavoriteModel({ voiture: voitureObjectId });
            const savedFavorite = await newFavorite.save();

            user.favorites = user.favorites || [];
            user.favorites.push(savedFavorite._id as Types.ObjectId);
            await user.save();

            res.status(200).json({
                message: 'Ajouté aux favoris.',
                isFavorite: true,
                favoriteId: savedFavorite._id,
                success: true
            });
        }

    } catch (error) {
        console.error("Erreur toggleFavoriteSimple :", error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};

// Fonction utilitaire pour conversion sûre des ObjectId
const toObjectId = (value: unknown): Types.ObjectId => {
    if (value instanceof Types.ObjectId) {
        return value;
    }
    if (typeof value === 'string' && Types.ObjectId.isValid(value)) {
        return new Types.ObjectId(value);
    }
    throw new Error('Invalid ObjectId format');
};

// Version avec fonction utilitaire (plus propre)
export const toggleFavoriteClean = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const voitureId = req.body?.voitureId ?? req.body?.carId;

        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }

        if (!voitureId || !Types.ObjectId.isValid(String(voitureId))) {
            res.status(400).json({ message: 'ID de voiture invalide.' });
            return;
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }

        const voitureObjectId = new Types.ObjectId(String(voitureId));

        // Conversion sûre des favoris en ObjectIds
        const favoriteIds = (user.favorites || []).map(fav => {
            try {
                return toObjectId(fav);
            } catch {
                return null;
            }
        }).filter(id => id !== null);

        // Chercher si déjà en favoris
        const existingFavorite = await FavoriteModel.findOne({
            voiture: voitureObjectId,
            _id: { $in: favoriteIds }
        });

        if (existingFavorite) {
            // Supprimer
            user.favorites = favoriteIds.filter(favId =>
                !favId.equals(existingFavorite._id as Types.ObjectId)
            );

            await user.save();
            await FavoriteModel.findByIdAndDelete(existingFavorite._id as Types.ObjectId);

            res.status(200).json({
                message: 'Supprimé des favoris.',
                isFavorite: false,
                success: true
            });
        } else {
            // Ajouter
            const newFavorite = new FavoriteModel({ voiture: voitureObjectId });
            const savedFavorite = await newFavorite.save();

            user.favorites = [...favoriteIds, savedFavorite._id as Types.ObjectId];
            await user.save();

            res.status(200).json({
                message: 'Ajouté aux favoris.',
                isFavorite: true,
                favoriteId: savedFavorite._id,
                success: true
            });
        }

    } catch (error) {
        console.error("Erreur toggleFavoriteClean :", error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};