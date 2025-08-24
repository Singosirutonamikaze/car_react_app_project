import { Request, Response } from 'express';
import CommandeModel from '../models/Commande';

// Interface pour les documents populés
interface PopulatedCommande {
  _id: any;
  client: any;
  voiture: any;
  statut: string;
  montant: number;
  fraisLivraison: number;
  montantTotal: number;
  modePaiement: string;
  adresseLivraison: any;
  dateCommande: Date;
  dateLivraisonPrevue?: Date;
  dateLivraisonReelle?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const getAllCommande = async (req: Request, res: Response): Promise<void> => {
    try {
        const commandes = await CommandeModel.find()
            .populate('client', 'name surname email')
            .populate('voiture', 'marque model year price') as unknown as PopulatedCommande[];
        
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

export const addCommande = async (req: Request, res: Response): Promise<void> => {
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

        // Validation des données requises
        if (!client || !voiture || !montant || !modePaiement || !adresseLivraison) {
            res.status(400).json({
                success: false,
                message: 'Tous les champs obligatoires doivent être remplis'
            });
            return;
        }

        const nouvelleCommande = new CommandeModel({
            client,
            voiture,
            statut: statut || 'En attente',
            montant,
            fraisLivraison: fraisLivraison || 0,
            modePaiement,
            adresseLivraison,
            dateLivraisonPrevue,
            notes
        });

        await nouvelleCommande.save();

        // Populer les références pour la réponse
        const commandePopulee = await CommandeModel.findById(nouvelleCommande._id)
            .populate('client', 'name surname email')
            .populate('voiture', 'marque model year price');

        res.status(201).json({
            success: true,
            message: 'Commande créée avec succès',
            data: commandePopulee
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
         .populate('voiture', 'marque model year price');

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
            .populate('voiture', 'marque model year price');

        // Formater les données pour l'export
        const dataForExport = commandes.map(commande => {
            let clientName = '';
            let clientEmail = '';
            if (commande.client && typeof commande.client === 'object' && 'name' in commande.client && 'surname' in commande.client && 'email' in commande.client) {
                clientName = `${(commande.client as any).name} ${(commande.client as any).surname}`;
                clientEmail = (commande.client as any).email;
            } else {
                clientName = commande.client?.toString() || '';
                clientEmail = '';
            }

            let voitureInfo = '';
            let voiturePrice = '';
            if (commande.voiture && typeof commande.voiture === 'object' && 'marque' in commande.voiture && 'model' in commande.voiture && 'year' in commande.voiture && 'price' in commande.voiture) {
                voitureInfo = `${(commande.voiture as any).marque} ${(commande.voiture as any).model} (${(commande.voiture as any).year})`;
                voiturePrice = (commande.voiture as any).price;
            } else {
                voitureInfo = commande.voiture?.toString() || '';
                voiturePrice = '';
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