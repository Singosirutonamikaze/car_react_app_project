import { Request, Response } from "express";
import { AchatModel } from "../models/Achat";
import UserModel from "../models/Client";
import CommandeModel from "../models/Commande";
import { Types } from "mongoose";

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}

function buildDateRangeFilter(from?: string, to?: string): { $gte?: Date; $lte?: Date } | null {
    const dateFilter: { $gte?: Date; $lte?: Date } = {};

    if (from) {
        const fromDate = new Date(from);
        if (!Number.isNaN(fromDate.getTime())) {
            dateFilter.$gte = fromDate;
        }
    }

    if (to) {
        const toDate = new Date(to);
        if (!Number.isNaN(toDate.getTime())) {
            toDate.setHours(23, 59, 59, 999);
            dateFilter.$lte = toDate;
        }
    }

    return Object.keys(dateFilter).length > 0 ? dateFilter : null;
}
export const getUserAchats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const page = Number.parseInt(req.query.page as string) || 1;
        const limit = Number.parseInt(req.query.limit as string) || 10;
        const statut = req.query.statut as string;
        const skip = (page - 1) * limit;

        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }

        const user = await UserModel.findById(userId).populate({
            path: 'achats',
            populate: [
                {
                    path: 'voiture',
                    select: 'marque modelCar year price image'
                },
                {
                    path: 'commande',
                    select: 'statut montantTotal dateCommande adresseLivraison'
                }
            ],
            match: statut ? { statut } : {},
            options: {
                sort: { dateAchat: -1 },
                skip: skip,
                limit: limit
            }
        });

        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }

        const matchQuery = statut ? { statut } : {};
        const totalAchats = await AchatModel.countDocuments({
            _id: { $in: user.achats },
            ...matchQuery
        });

        const stats = await AchatModel.aggregate([
            { $match: { _id: { $in: user.achats } } },
            {
                $group: {
                    _id: '$statut',
                    count: { $sum: 1 },
                    totalMontant: { $sum: '$prixAchat' }
                }
            }
        ]);

        res.status(200).json({
            achats: user.achats || [],
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalAchats / limit),
                totalCount: totalAchats,
                hasNextPage: page * limit < totalAchats,
                hasPrevPage: page > 1
            },
            stats: stats.reduce((acc, stat) => {
                acc[stat._id] = {
                    count: stat.count,
                    totalMontant: stat.totalMontant
                };
                return acc;
            }, {}),
            success: true
        });

    } catch (error) {
        console.error("Erreur getUserAchats :", error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};

export const createAchat = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const {
            voitureId,
            commandeId,
            prixAchat,
            modePaiement,
            numeroTransaction,
            notes
        } = req.body;

        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }

        if (!voitureId || !commandeId || !prixAchat || !modePaiement) {
            res.status(400).json({ message: 'Données requises manquantes.' });
            return;
        }

        // Vérifier que la commande appartient à l'utilisateur
        const commande = await CommandeModel.findOne({
            _id: commandeId,
            client: userId,
            statut: { $in: ['En attente', 'Confirmée', 'En cours'] }
        });

        if (!commande) {
            res.status(404).json({ message: 'Commande non trouvée ou non valide.' });
            return;
        }

        const achatExistant = await AchatModel.findOne({ commande: commandeId });
        if (achatExistant) {
            const achatExistantPopule = await AchatModel.findById(achatExistant._id)
                .populate('voiture', 'marque modelCar year price image')
                .populate('commande', 'statut montantTotal dateCommande');

            res.status(200).json({
                message: 'Un achat existe déjà pour cette commande.',
                achat: achatExistantPopule,
                success: true
            });
            return;
        }

        // Créer l'achat
        const nouvelAchat = new AchatModel({
            voiture: voitureId,
            commande: commandeId,
            prixAchat,
            modePaiement,
            numeroTransaction,
            notes,
            statut: 'Confirmé'
        });

        const savedAchat = await nouvelAchat.save();

        // Ajouter à l'utilisateur
        const user = await UserModel.findById(userId);
        if (user) {
            user.achats = user.achats || [];
            user.achats.push(savedAchat._id as Types.ObjectId);
            await user.save();
        }

        // Mettre à jour le statut de la commande
        commande.statut = 'En cours';
        await commande.save();

        // Populer la réponse
        const populatedAchat = await AchatModel.findById(savedAchat._id)
            .populate('voiture', 'marque modelCar year price image')
            .populate('commande', 'statut montantTotal dateCommande');

        res.status(201).json({
            message: 'Achat créé avec succès.',
            achat: populatedAchat,
            success: true
        });

    } catch (error) {
        console.error("Erreur createAchat :", error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};

// Mettre à jour le statut d'un achat
export const updateAchatStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { achatId } = req.params;
        const { statut, datePaiement, dateLivraison, numeroTransaction } = req.body;

        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }

        // Vérifier que l'achat appartient à l'utilisateur
        const user = await UserModel.findById(userId);
        if (!user || !user.achats?.some(a => a.equals(new Types.ObjectId(achatId)))) {
            res.status(404).json({ message: 'Achat non trouvé.' });
            return;
        }

        const updateData: any = { statut };
        if (datePaiement) updateData.datePaiement = datePaiement;
        if (dateLivraison) updateData.dateLivraison = dateLivraison;
        if (numeroTransaction) updateData.numeroTransaction = numeroTransaction;

        const updatedAchat = await AchatModel.findByIdAndUpdate(
            achatId,
            updateData,
            { new: true, runValidators: true }
        )
            .populate('voiture', 'marque modele annee prix')
            .populate('commande', 'statut montantTotal');

        res.status(200).json({
            message: 'Statut mis à jour avec succès.',
            achat: updatedAchat,
            success: true
        });

    } catch (error) {
        console.error("Erreur updateAchatStatus :", error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};

// Ajouter une évaluation à un achat
export const addEvaluationAchat = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { achatId } = req.params;
        const { note, commentaire } = req.body;

        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }

        if (!note || note < 1 || note > 5) {
            res.status(400).json({ message: 'Note invalide (1-5 requis).' });
            return;
        }

        const user = await UserModel.findById(userId);
        if (!user || !user.achats?.some(a => a.equals(new Types.ObjectId(achatId)))) {
            res.status(404).json({ message: 'Achat non trouvé.' });
            return;
        }

        const achat = await AchatModel.findById(achatId);
        if (!achat || !['Livré', 'Terminé'].includes(achat.statut)) {
            res.status(400).json({ message: 'L\'achat doit être livré pour être évalué.' });
            return;
        }

        achat.evaluation = {
            note,
            commentaire,
            dateEvaluation: new Date()
        };

        await achat.save();

        res.status(200).json({
            message: 'Évaluation ajoutée avec succès.',
            evaluation: achat.evaluation,
            success: true
        });

    } catch (error) {
        console.error("Erreur addEvaluationAchat :", error);
        res.status(500).json({
            message: "Erreur interne du serveur.",
            success: false
        });
    }
};

export const getAllAchatsAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const authReq = req as AuthenticatedRequest;
        const adminId = authReq.admin?.id;

        if (!adminId) {
            res.status(401).json({ message: 'Non autorisé.', success: false });
            return;
        }

        const page = Number.parseInt(req.query.page as string) || 1;
        const limit = Number.parseInt(req.query.limit as string) || 20;
        const statut = req.query.statut as string | undefined;
        const from = req.query.from as string | undefined;
        const to = req.query.to as string | undefined;
        const skip = (page - 1) * limit;

        const filter: Record<string, unknown> = {};
        if (statut) filter.statut = statut;

        const dateFilter = buildDateRangeFilter(from, to);
        if (dateFilter) filter.dateAchat = dateFilter;

        const [achats, totalCount] = await Promise.all([
            AchatModel.find(filter)
                .populate('voiture', 'marque modelCar year price image')
                .populate({
                    path: 'commande',
                    select: 'statut montantTotal dateCommande client',
                    populate: {
                        path: 'client',
                        select: 'name surname email'
                    }
                })
                .sort({ dateAchat: -1 })
                .skip(skip)
                .limit(limit),
            AchatModel.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            achats,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                hasNextPage: page * limit < totalCount,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Erreur getAllAchatsAdmin :', error);
        res.status(500).json({
            message: 'Erreur interne du serveur.',
            success: false
        });
    }
};

export const getUserAchatsChartsByDate = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.', success: false });
            return;
        }

        const from = req.query.from as string | undefined;
        const to = req.query.to as string | undefined;

        const user = await UserModel.findById(userId).select('achats');
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.', success: false });
            return;
        }

        const match: Record<string, unknown> = {
            _id: { $in: user.achats || [] }
        };

        const dateFilter = buildDateRangeFilter(from, to);
        if (dateFilter) match.dateAchat = dateFilter;

        const points = await AchatModel.aggregate([
            { $match: match },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$dateAchat'
                        }
                    },
                    totalAchats: { $sum: 1 },
                    totalMontant: { $sum: '$prixAchat' }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    totalAchats: 1,
                    totalMontant: 1
                }
            }
        ]);

        res.status(200).json({ success: true, points });
    } catch (error) {
        console.error('Erreur getUserAchatsChartsByDate :', error);
        res.status(500).json({ message: 'Erreur interne du serveur.', success: false });
    }
};

export const getAdminAchatsChartsByDate = async (req: Request, res: Response): Promise<void> => {
    try {
        const authReq = req as AuthenticatedRequest;
        if (!authReq.admin?.id) {
            res.status(401).json({ message: 'Non autorisé.', success: false });
            return;
        }

        const from = req.query.from as string | undefined;
        const to = req.query.to as string | undefined;
        const statut = req.query.statut as string | undefined;

        const match: Record<string, unknown> = {};
        if (statut) match.statut = statut;

        const dateFilter = buildDateRangeFilter(from, to);
        if (dateFilter) match.dateAchat = dateFilter;

        const points = await AchatModel.aggregate([
            { $match: match },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$dateAchat'
                        }
                    },
                    totalAchats: { $sum: 1 },
                    totalMontant: { $sum: '$prixAchat' }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    totalAchats: 1,
                    totalMontant: 1
                }
            }
        ]);

        res.status(200).json({ success: true, points });
    } catch (error) {
        console.error('Erreur getAdminAchatsChartsByDate :', error);
        res.status(500).json({ message: 'Erreur interne du serveur.', success: false });
    }
};

export const updateAchatStatusAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const authReq = req as AuthenticatedRequest;
        if (!authReq.admin?.id) {
            res.status(401).json({ message: 'Non autorisé.', success: false });
            return;
        }

        const { id } = req.params;
        const { statut, datePaiement, dateLivraison, numeroTransaction } = req.body;

        if (!id || !Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'ID achat invalide.', success: false });
            return;
        }

        const updateData: Record<string, unknown> = {};
        if (statut) updateData.statut = statut;
        if (datePaiement) updateData.datePaiement = datePaiement;
        if (dateLivraison) updateData.dateLivraison = dateLivraison;
        if (numeroTransaction) updateData.numeroTransaction = numeroTransaction;

        const updatedAchat = await AchatModel.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        })
            .populate('voiture', 'marque modelCar year price image')
            .populate('commande', 'statut montantTotal dateCommande');

        if (!updatedAchat) {
            res.status(404).json({ message: 'Achat non trouvé.', success: false });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Statut achat mis à jour avec succès.',
            achat: updatedAchat
        });
    } catch (error) {
        console.error('Erreur updateAchatStatusAdmin :', error);
        res.status(500).json({ message: 'Erreur interne du serveur.', success: false });
    }
};