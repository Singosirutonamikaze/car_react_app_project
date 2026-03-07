import { Request, Response } from 'express';
import { Types } from 'mongoose';
import CommandeModel from '../models/Commande';
import { AchatModel } from '../models/Achat';
import { IAdresseLivraison } from '../interfaces/ICommande';
import UserModel from '../models/Client';
import CarModel from '../models/Car';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

interface PopulatedClient {
    _id: Types.ObjectId;
    name: string;
    surname: string;
    email: string;
}

interface PopulatedVoiture {
    _id: Types.ObjectId;
    marque: string;
    modelCar: string;
    year: number;
    price: number;
    image?: string;
}

// Interface pour les documents populés
interface PopulatedCommande {
    _id: Types.ObjectId;
    client: PopulatedClient;
    voiture: PopulatedVoiture;
    statut: string;
    montant: number;
    fraisLivraison: number;
    montantTotal: number;
    modePaiement: string;
    adresseLivraison: IAdresseLivraison;
    dateCommande: Date;
    dateLivraisonPrevue?: Date;
    dateLivraisonReelle?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export const getAllCommande = async (req: Request, res: Response): Promise<void> => {
    try {
        const authReq = req as AuthenticatedRequest;
        let query: Record<string, unknown> = {};
        if (!authReq.admin && authReq.user?.id) {
            query = { client: authReq.user.id };
        }

        const commandes = await CommandeModel.find(query)
            .populate('client', 'name surname email')
            .populate('voiture', 'marque modelCar year price image') as unknown as PopulatedCommande[];

        res.status(200).json({
            success: true,
            data: commandes,
            count: commandes.length
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

export const addCommande = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const {
            client,
            voiture,
            statut,
            montant,
            fraisLivraison,
            modePaiement,
            adresseLivraison,
            dateLivraisonPrevue,
            notes
        } = req.body;

        const clientId = req.user?.id || client;

        // Validation des données requises
        if (!clientId || !voiture || !montant || !modePaiement || !adresseLivraison) {
            res.status(400).json({
                success: false,
                message: 'Tous les champs obligatoires doivent être remplis'
            });
            return;
        }

        const [clientExists, carExists] = await Promise.all([
            UserModel.findById(clientId).select('_id'),
            CarModel.findById(voiture).select('_id')
        ]);

        if (!clientExists) {
            res.status(404).json({
                success: false,
                message: 'Client introuvable'
            });
            return;
        }

        if (!carExists) {
            res.status(404).json({
                success: false,
                message: 'Voiture introuvable'
            });
            return;
        }

        const montantNumber = Number(String(montant).replaceAll(/[\s,]/g, ''));
        const fraisLivraisonNumber = Number(String(fraisLivraison ?? 0).replaceAll(/[\s,]/g, ''));

        const nouvelleCommande = new CommandeModel({
            client: clientId,
            voiture,
            // Le flux métier simplifié considère une commande comme un achat validé.
            statut: statut || 'Confirmée',
            montant: Number.isFinite(montantNumber) ? montantNumber : 0,
            fraisLivraison: Number.isFinite(fraisLivraisonNumber) ? fraisLivraisonNumber : 0,
            modePaiement,
            adresseLivraison,
            dateLivraisonPrevue,
            notes
        });

        await nouvelleCommande.save();

        const nouvelAchat = new AchatModel({
            voiture,
            commande: nouvelleCommande._id,
            prixAchat: Number.isFinite(montantNumber) ? montantNumber : 0,
            modePaiement,
            notes,
            statut: 'Confirmé'
        });

        await nouvelAchat.save();

        await UserModel.findByIdAndUpdate(
            clientId,
            {
                $addToSet: {
                    commandes: nouvelleCommande._id,
                    achats: nouvelAchat._id
                }
            },
            { new: false }
        );

        // Populer les références pour la réponse
        const commandePopulee = await CommandeModel.findById(nouvelleCommande._id)
            .populate('client', 'name surname email')
            .populate('voiture', 'marque modelCar year price image');

        const achatPopule = await AchatModel.findById(nouvelAchat._id)
            .populate('voiture', 'marque modelCar year price image')
            .populate('commande', 'statut montantTotal dateCommande');

        res.status(201).json({
            success: true,
            message: 'Commande et achat créés avec succès',
            data: commandePopulee,
            achat: achatPopule
        });
    } catch (error) {
        console.error('Erreur lors de la création de la commande:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

export const updateCommande = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!id) {
            res.status(400).json({
                success: false,
                message: 'ID de la commande requis'
            });
            return;
        }

        // Ne pas permettre la modification du montantTotal directement
        if (updates.montantTotal) {
            delete updates.montantTotal;
        }

        const commande = await CommandeModel.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        ).populate('client', 'name surname email')
            .populate('voiture', 'marque modelCar year price image');

        if (!commande) {
            res.status(404).json({
                success: false,
                message: 'Commande non trouvée'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Commande mise à jour avec succès',
            data: commande
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la commande:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

export const deleteCommande = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({
                success: false,
                message: 'ID de la commande requis'
            });
            return;
        }

        const commande = await CommandeModel.findByIdAndDelete(id);

        if (!commande) {
            res.status(404).json({
                success: false,
                message: 'Commande non trouvée'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Commande supprimée avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de la commande:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

export const downloadsCommande = async (req: Request, res: Response): Promise<void> => {
    try {
        const commandes = await CommandeModel.find()
            .populate('client', 'name surname email')
            .populate('voiture', 'marque modelCar year price image');

        // Formater les données pour l'export
        const dataForExport = commandes.map(commande => {
            let clientName = '';
            let clientEmail = '';
            if (commande.client && typeof commande.client === 'object' && 'name' in commande.client && 'surname' in commande.client && 'email' in commande.client) {
                const c = commande.client as { name: string; surname: string; email: string };
                clientName = `${c.name} ${c.surname}`;
                clientEmail = c.email;
            } else {
                clientName = commande.client?.toString() || '';
            }

            let voitureInfo = '';
            let voiturePrice: string | number = '';
            if (commande.voiture && typeof commande.voiture === 'object' && 'marque' in commande.voiture && 'modelCar' in commande.voiture && 'year' in commande.voiture && 'price' in commande.voiture) {
                const v = commande.voiture as { marque: string; modelCar: string; year: number; price: number };
                voitureInfo = `${v.marque} ${v.modelCar} (${v.year})`;
                voiturePrice = v.price;
            } else {
                voitureInfo = commande.voiture?.toString() || '';
            }

            return {
                'Numéro Commande': commande._id,
                'Client': clientName,
                'Email Client': clientEmail,
                'Voiture': voitureInfo,
                'Prix Voiture': voiturePrice,
                'Statut': commande.statut,
                'Montant': commande.montant,
                'Frais Livraison': commande.fraisLivraison,
                'Montant Total': commande.montantTotal,
                'Mode Paiement': commande.modePaiement,
                'Date Commande': commande.dateCommande,
                'Date Livraison Prévue': commande.dateLivraisonPrevue,
                'Ville Livraison': commande.adresseLivraison?.ville || ''
            };
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=commandes.csv');

        let csv = 'Numéro Commande,Client,Email Client,Voiture,Prix Voiture,Statut,Montant,Frais Livraison,Montant Total,Mode Paiement,Date Commande,Date Livraison Prévue,Ville Livraison\n';

        dataForExport.forEach(row => {
            csv += `"${Object.values(row).join('","')}"\n`;
        });

        res.status(200).send(csv);
    } catch (error) {
        console.error('Erreur lors de l\'export des commandes:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'export des commandes'
        });
    }
};