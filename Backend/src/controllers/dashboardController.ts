import { Request, Response } from 'express';
import CommandeModel from '../models/Commande';
import VenteModel from '../models/Vente';
import CarModel from '../models/Car';
import ClientModel from '../models/Client';

// Define interfaces for populated documents to help TypeScript
interface PopulatedClient {
    _id: any;
    name: string;
    surname: string;
    email: string;
    phone?: string;
    profileImageUrl?: string;
}

interface PopulatedVoiture {
    _id: any;
    marque: string;
    model: string;
    year: number;
    price: number;
    couleur: string;
    ville?: string;
}

interface PopulatedCommande {
    _id: any;
    client: PopulatedClient;
    voiture: PopulatedVoiture;
    statut: string;
    montant: number;
    fraisLivraison?: number;
    montantTotal: number;
    dateCommande?: Date;
    dateLivraisonPrevue?: Date;
    createdAt?: Date;
}

interface PopulatedVente {
    _id: any;
    client: PopulatedClient;
    voiture: PopulatedVoiture;
    commande?: {
        _id: any;
        statut: string;
        montantTotal: number;
    };
    prixVente: number;
    statut: string;
    dateVente?: Date;
    datePaiement?: Date;
    numeroTransaction?: string;
    createdAt?: Date;
}

export const getDashboardData = async (req: Request, res: Response): Promise<void> => {
    try {
        // Récupérer toutes les données séparément pour éviter les problèmes de type
        const clients = await ClientModel.find().select('-password').lean();
        const voitures = await CarModel.find().lean();
        const commandes = await CommandeModel.find()
            .populate('client', 'name surname email phone profileImageUrl')
            .populate('voiture', 'marque model year price couleur ville')
            .lean();
        const ventesRaw = await VenteModel.find()
            .populate('client', 'name surname email phone profileImageUrl')
            .populate('voiture', 'marque model year price couleur')
            .populate('commande', 'statut montantTotal')
            .lean();
        
        // Type assertion to bypass complex union type issues
        const ventes = ventesRaw as any[] as PopulatedVente[];

        // Calculer les statistiques
        const totalClients = clients.length;
        const totalVoitures = voitures.length;
        const voituresDisponibles = voitures.filter((v: any) => v.disponible).length;
        const totalCommandes = commandes.length;
        const totalVentes = ventes.length;
        
        // Revenu total (ventes payées) - using explicit typing
        const revenueTotal = (ventes as any[])
            .filter((v: any) => v.statut === 'Payée')
            .reduce((sum: number, vente: any) => sum + (vente.prixVente || 0), 0);

        // Commandes et ventes récentes (30 derniers jours)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const commandesRecent = (commandes as any[])
            .filter((c: any) => c.dateCommande && c.dateCommande >= thirtyDaysAgo)
            .sort((a: any, b: any) => {
                const dateA = a.dateCommande || a.createdAt || new Date(0);
                const dateB = b.dateCommande || b.createdAt || new Date(0);
                return dateB.getTime() - dateA.getTime();
            });

        const ventesRecent = (ventes as any[])
            .filter((v: any) => v.dateVente && v.dateVente >= thirtyDaysAgo)
            .sort((a: any, b: any) => {
                const dateA = a.dateVente || a.createdAt || new Date(0);
                const dateB = b.dateVente || b.createdAt || new Date(0);
                return dateB.getTime() - dateA.getTime();
            });

        // Préparer les données de réponse avec type assertion pour éviter les erreurs de type complexe
        const clientsListe = (clients as any[]).map((client: any) => ({
            id: client._id,
            nom: client.name,
            prenom: client.surname,
            email: client.email,
            profileImageUrl: client.profileImageUrl
        }));

        const voituresListe = (voitures as any[]).map((voiture: any) => ({
            id: voiture._id,
            marque: voiture.marque,
            modele: voiture.model,
            annee: voiture.year,
            prix: voiture.price,
            couleur: voiture.couleur,
            ville: voiture.ville,
            disponible: voiture.disponible
        }));

        const commandesRecentesListe = (commandesRecent as any[])
            .filter((commande: any) => commande.client && commande.voiture) // Filter out commands with null populated fields
            .map((commande: any) => ({
                id: commande._id,
                client: {
                    id: commande.client._id,
                    nomComplet: `${commande.client.name} ${commande.client.surname}`,
                    email: commande.client.email,
                    profileImageUrl: commande.client.profileImageUrl
                },
                voiture: {
                    id: commande.voiture._id,
                    description: `${commande.voiture.marque} ${commande.voiture.model} ${commande.voiture.year}`,
                    prix: commande.voiture.price,
                    ville: commande.voiture.ville
                },
                statut: commande.statut,
                montant: commande.montant,
                fraisLivraison: commande.fraisLivraison,
                montantTotal: commande.montantTotal,
                dateCommande: commande.dateCommande,
                dateLivraisonPrevue: commande.dateLivraisonPrevue
            }));

        const ventesRecentesListe = (ventesRecent as any[])
            .filter((vente: any) => vente.client && vente.voiture) // Filter out sales with null populated fields
            .map((vente: any) => ({
                id: vente._id,
                client: {
                    id: vente.client._id,
                    nomComplet: `${vente.client.name} ${vente.client.surname}`,
                    email: vente.client.email,
                    profileImageUrl: vente.client.profileImageUrl
                },
                voiture: {
                    id: vente.voiture._id,
                    description: `${vente.voiture.marque} ${vente.voiture.model} ${vente.voiture.year}`,
                    prix: vente.voiture.price
                },
                commande: vente.commande ? {
                    id: vente.commande._id,
                    statut: vente.commande.statut,
                    montantTotal: vente.commande.montantTotal
                } : null,
                prixVente: vente.prixVente,
                statut: vente.statut,
                dateVente: vente.dateVente,
                datePaiement: vente.datePaiement,
                numeroTransaction: vente.numeroTransaction
            }));

        const revenue30Jours = (ventesRecent as any[])
            .filter((v: any) => v.statut === 'Payée')
            .reduce((sum: number, vente: any) => sum + (vente.prixVente || 0), 0);

        const payload = {
            clients: {
                total: totalClients,
                liste: clientsListe
            },
            voitures: {
                total: totalVoitures,
                disponibles: voituresDisponibles,
                liste: voituresListe
            },
            commandes: {
                total: totalCommandes,
                recentes: commandesRecentesListe
            },
            ventes: {
                total: totalVentes,
                recentes: ventesRecentesListe
            },
            statistiques: {
                revenueTotal,
                commandes30Jours: commandesRecent.length,
                ventes30Jours: ventesRecent.length,
                revenue30Jours
            }
        };

        res.status(200).json(payload);
    } catch (error) {
        console.error('Erreur de récupération des données dashboard:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};