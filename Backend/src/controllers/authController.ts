
import { Request, Response } from 'express';
import UserModel from '../models/Client';
import generateToken from '../utils/generateToken';
import type { Multer } from 'multer';
import { Types } from 'mongoose';
export interface IUserDocument extends Document {
    _id: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    profileImageUrl?: string | null;
    comparePassword(candidatePassword: string): Promise<boolean>;
    toObject(): any;
}
type ReqWithFile = Request & { file?: Multer.File };
type AuthenticatedRequest = Request & { user?: { id: string } };

export const registerUser = async (req: ReqWithFile, res: Response): Promise<void> => {
    try {
        const { name, surname, email, password } = req.body;
        if (!name || !surname || !email || !password) {
            res.status(400).json({ message: "S'il vous plaît, remplissez tous les champs." });
            return;
        }
        const existingUser = await UserModel.findOne({ email }) as IUserDocument | null;
        if (existingUser) {
            res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
            return;
        }
        const profileImageUrl = req.file ? `/uploads/${req.file.filename}` : (req.body.profileImageUrl || null);
        const newUser = new UserModel({
            name,
            surname,
            email,
            password,
            profileImageUrl,
        });
        await newUser.save();
        const token = generateToken(newUser._id.toString());
        const userToReturn = newUser.toObject();
        delete (userToReturn as any).password;
        res.status(201).json({ token, user: userToReturn });
    } catch (error: any) {
        if (error?.code === 11000 && error.keyPattern?.email) {
            res.status(400).json({ message: "L'email est déjà utilisé." });
            return;
        }
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            res.status(400).json({ message: "S'il vous plaît, remplissez tous les champs." });
            return;
        }
        const user = await UserModel.findOne({ email }) as IUserDocument | null;
        if (!user) {
            res.status(400).json({ message: 'Utilisateur non trouvé.' });
            return;
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Mot de passe incorrect.' });
            return;
        }
        const token = generateToken(user._id.toString());
        const userToReturn = user.toObject();
        delete (userToReturn as any).password;
        res.status(200).json({ token, user: userToReturn });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

export const getUserInfo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }
        const user = await UserModel.findById(userId).select('-password') as IUserDocument | null;
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

export const updateUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { name, surname, profileImageUrl } = req.body;
        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                ...(name && { name }),
                ...(surname && { surname }),
                ...(profileImageUrl !== undefined && { profileImageUrl })
            },
            { new: true, runValidators: true }
        ).select('-password');
        if (!updatedUser) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }
        res.status(200).json({
            user: updatedUser,
            message: 'Profil mis à jour avec succès.',
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};

export const getUserData = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }

        if (!Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'ID utilisateur invalide.' });
            return;
        }

        const user = await UserModel.findById(userId)
            .select('-password')
            .populate({
                path: 'commandes',
                options: { sort: { dateCommande: -1 }, limit: 1 } // Seulement la dernière commande
            }) as any;

        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }

        const userObject = user.toObject();

        if (user.commandes && user.commandes.length > 0) {
            userObject.lastCommande = user.commandes[0];
        } else {
            userObject.lastCommande = null;
        }

        delete userObject.commandes;

        res.status(200).json({ user: userObject });

    } catch (error) {
        console.error("Erreur getUserData :", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

export const getUserDataEnhanced = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }

        if (!Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'ID utilisateur invalide.' });
            return;
        }

        const user = await UserModel.findById(userId)
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
            ]) as any;

        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }

        const enrichedUser = user.toObject();
        const commandes = user.commandes || [];
        const favorites = user.favorites || [];

        enrichedUser.lastCommande = commandes[0] || null;

        enrichedUser.stats = {
            totalCommandes: commandes.length,
            commandesEnCours: commandes.filter((cmd: any) =>
                ['En attente', 'Confirmée', 'En cours'].includes(cmd.statut)
            ).length,
            commandesLivrees: commandes.filter((cmd: any) =>
                cmd.statut === 'Livrée'
            ).length,
            commandesAnnulees: commandes.filter((cmd: any) =>
                cmd.statut === 'Annulée'
            ).length,
            totalFavorites: favorites.length,
            montantTotalCommandes: commandes.reduce((total: number, cmd: any) =>
                total + (cmd.montantTotal || 0), 0
            )
        };

        enrichedUser.recentCommandes = commandes.slice(0, 5);

        enrichedUser.recentFavorites = favorites
            .sort((a: any, b: any) => new Date(b.dateAjout || 0).getTime() - new Date(a.dateAjout || 0).getTime())
            .slice(0, 5);

        if (commandes.length > 0) {
            const marques = commandes
                .map((cmd: any) => cmd.voiture?.marque)
                .filter(Boolean);

            const marqueCount = marques.reduce((acc: any, marque: string) => {
                acc[marque] = (acc[marque] || 0) + 1;
                return acc;
            }, {});

            enrichedUser.preferences = {
                marquesFavorites: Object.entries(marqueCount)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .slice(0, 3)
                    .map(([marque, count]) => ({ marque, count }))
            };
        }

        delete enrichedUser.commandes;
        delete enrichedUser.favorites;

        res.status(200).json({
            user: enrichedUser,
            success: true
        });

    } catch (error) {
        console.error("Erreur getUserDataEnhanced :", error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};

export const getUserDataLight = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }

        if (!Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'ID utilisateur invalide.' });
            return;
        }

        const user = await UserModel.findById(userId)
            .select('name surname email profileImageUrl createdAt updatedAt');

        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }

        res.status(200).json({
            user: user.toObject(),
            success: true
        });

    } catch (error) {
        console.error("Erreur getUserDataLight :", error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};

export const getUserDataPaginated = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const commandesPage = parseInt(req.query.commandesPage as string) || 1;
        const commandesLimit = parseInt(req.query.commandesLimit as string) || 5;
        const favoritesPage = parseInt(req.query.favoritesPage as string) || 1;
        const favoritesLimit = parseInt(req.query.favoritesLimit as string) || 5;

        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }

        if (!Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'ID utilisateur invalide.' });
            return;
        }

        const user = await UserModel.findById(userId).select('-password');

        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }

        const [totalCommandes, totalFavorites] = await Promise.all([
            UserModel.aggregate([
                { $match: { _id: new Types.ObjectId(userId) } },
                { $project: { commandesCount: { $size: { $ifNull: ['$commandes', []] } } } }
            ]),
            UserModel.aggregate([
                { $match: { _id: new Types.ObjectId(userId) } },
                { $project: { favoritesCount: { $size: { $ifNull: ['$favorites', []] } } } }
            ])
        ]);

        const userWithCommandes = await UserModel.findById(userId)
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
            }) as any;

        const userWithFavorites = await UserModel.findById(userId)
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
            }) as any;

        const enrichedUser = user.toObject() as any;
        const commandes = userWithCommandes?.commandes || [];
        const favorites = userWithFavorites?.favorites || [];
        const totalCommandesCount = totalCommandes[0]?.commandesCount || 0;
        const totalFavoritesCount = totalFavorites[0]?.favoritesCount || 0;

        enrichedUser.commandesPaginated = {
            data: commandes,
            pagination: {
                currentPage: commandesPage,
                totalPages: Math.ceil(totalCommandesCount / commandesLimit),
                totalCount: totalCommandesCount,
                hasNextPage: commandesPage * commandesLimit < totalCommandesCount,
                hasPrevPage: commandesPage > 1
            }
        };

        enrichedUser.favoritesPaginated = {
            data: favorites,
            pagination: {
                currentPage: favoritesPage,
                totalPages: Math.ceil(totalFavoritesCount / favoritesLimit),
                totalCount: totalFavoritesCount,
                hasNextPage: favoritesPage * favoritesLimit < totalFavoritesCount,
                hasPrevPage: favoritesPage > 1
            }
        };

        enrichedUser.stats = {
            totalCommandes: totalCommandesCount,
            totalFavorites: totalFavoritesCount,
            lastCommande: commandes[0] || null
        };

        res.status(200).json({
            user: enrichedUser,
            success: true
        });

    } catch (error) {
        console.error("Erreur getUserDataPaginated :", error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};

export const getUserDataCompatible = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const enhanced = req.query.enhanced === 'true';

        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }

        if (!Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'ID utilisateur invalide.' });
            return;
        }

        if (enhanced) {
            return getUserDataEnhanced(req, res);
        } else {
            return getUserData(req, res);
        }

    } catch (error) {
        console.error("Erreur getUserDataCompatible :", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};