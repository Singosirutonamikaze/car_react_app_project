
import { Request, Response } from 'express';
import UserModel from '../models/Client';
import generateToken from '../utils/generateToken';
import { Types } from 'mongoose';

interface PopulatedVoiture {
    marque: string;
    modele?: string;
    annee?: number;
    prix?: number;
    images?: string[];
    disponible?: boolean;
}

interface PopulatedCommande {
    statut: string;
    montantTotal?: number;
    voiture?: PopulatedVoiture;
    dateCommande: Date;
}

interface PopulatedFavorite {
    voiture?: PopulatedVoiture;
    dateAjout?: Date;
}

export interface IUserDocument {
    _id: Types.ObjectId | string;
    name: string;
    surname: string;
    email: string;
    password: string;
    profileImageUrl?: string | null;
    comparePassword(candidatePassword: string): Promise<boolean>;
    toObject(): Record<string, unknown>;
}
type ReqWithFile = Request & { file?: Express.Multer.File };
type AuthenticatedRequest = Request & { user?: { id: string } };

export const registerUser = async (req: ReqWithFile, res: Response): Promise<void> => {
    try {
        const { name, surname, email, password } = req.body;
        if (!name || !surname || !email || !password) {
            res.status(400).json({ message: "S'il vous plaît, remplissez tous les champs." });
            return;
        }
        const existingUser = await UserModel.findOne({ email });
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
        const userToReturn = newUser.toObject() as Record<string, unknown>;
        delete userToReturn['password'];
        res.status(201).json({ token, user: userToReturn });
    } catch (error: unknown) {
        const mongoErr = error as { code?: number; keyPattern?: Record<string, unknown> };
        if (mongoErr?.code === 11000 && mongoErr.keyPattern?.email) {
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
        const user: IUserDocument | null = await UserModel.findOne({ email });
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
        const userToReturn: Record<string, unknown> = user.toObject();
        delete userToReturn['password'];
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
            .populate<{ commandes: PopulatedCommande[] }>({
                path: 'commandes',
                options: { sort: { dateCommande: -1 }, limit: 1 }
            });

        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }

        const userObject: Record<string, unknown> = user.toObject();

        if (user.commandes && user.commandes.length > 0) {
            userObject['lastCommande'] = user.commandes[0];
        } else {
            userObject['lastCommande'] = null;
        }

        delete userObject['commandes'];

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
            .populate<{ commandes: PopulatedCommande[]; favorites: PopulatedFavorite[] }>([
                {
                    path: 'commandes',
                    populate: {
                        path: 'voiture',
                        select: 'marque modelCar year price image'
                    },
                    options: { sort: { dateCommande: -1 } }
                },
                {
                    path: 'favorites',
                    populate: {
                        path: 'voiture',
                        select: 'marque modelCar year price image disponible'
                    }
                }
            ]);

        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }

        const enrichedUser: Record<string, unknown> = user.toObject();
        const commandes: PopulatedCommande[] = user.commandes || [];
        const favorites: PopulatedFavorite[] = user.favorites || [];

        enrichedUser['lastCommande'] = commandes[0] || null;

        enrichedUser['stats'] = {
            totalCommandes: commandes.length,
            commandesEnCours: commandes.filter(cmd =>
                ['En attente', 'Confirmée', 'En cours'].includes(cmd.statut)
            ).length,
            commandesLivrees: commandes.filter(cmd =>
                cmd.statut === 'Livrée'
            ).length,
            commandesAnnulees: commandes.filter(cmd =>
                cmd.statut === 'Annulée'
            ).length,
            totalFavorites: favorites.length,
            montantTotalCommandes: commandes.reduce((total, cmd) =>
                total + (cmd.montantTotal || 0), 0
            )
        };

        enrichedUser['recentCommandes'] = commandes.slice(0, 5);

        enrichedUser['recentFavorites'] = [...favorites]
            .sort((a, b) => new Date(b.dateAjout || 0).getTime() - new Date(a.dateAjout || 0).getTime())
            .slice(0, 5);

        if (commandes.length > 0) {
            const marques = commandes
                .map(cmd => cmd.voiture?.marque)
                .filter((marque): marque is string => Boolean(marque));

            const marqueCount = marques.reduce<Record<string, number>>((acc, marque) => {
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
        const commandesPage = Number.parseInt(req.query.commandesPage as string) || 1;
        const commandesLimit = Number.parseInt(req.query.commandesLimit as string) || 5;
        const favoritesPage = Number.parseInt(req.query.favoritesPage as string) || 1;
        const favoritesLimit = Number.parseInt(req.query.favoritesLimit as string) || 5;

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
            UserModel.aggregate<{ commandesCount: number }>([
                { $match: { _id: new Types.ObjectId(userId) } },
                { $project: { commandesCount: { $size: { $ifNull: ['$commandes', []] } } } }
            ]),
            UserModel.aggregate<{ favoritesCount: number }>([
                { $match: { _id: new Types.ObjectId(userId) } },
                { $project: { favoritesCount: { $size: { $ifNull: ['$favorites', []] } } } }
            ])
        ]);

        const userWithCommandes = await UserModel.findById(userId)
            .populate<{ commandes: PopulatedCommande[] }>({
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

        const userWithFavorites = await UserModel.findById(userId)
            .populate<{ favorites: PopulatedFavorite[] }>({
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

        const enrichedUser: Record<string, unknown> = user.toObject();
        const commandes: PopulatedCommande[] = userWithCommandes?.commandes || [];
        const favorites: PopulatedFavorite[] = userWithFavorites?.favorites || [];
        const totalCommandesCount: number = totalCommandes[0]?.commandesCount || 0;
        const totalFavoritesCount: number = totalFavorites[0]?.favoritesCount || 0;

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