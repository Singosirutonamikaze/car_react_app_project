import { Request, Response } from 'express';
import { Types } from 'mongoose';
import CommandeModel from '../models/Commande';
import VenteModel from '../models/Vente';
import CarModel from '../models/Car';
import ClientModel from '../models/Client';
import LocationModel from '../models/Location';

// Types pour les documents lean populés
interface LeanClient {
    _id: Types.ObjectId;
    name: string;
    surname: string;
    email: string;
    phone?: string;
    profileImageUrl?: string;
}

interface LeanCar {
    _id: Types.ObjectId;
    marque: string;
    model: string;
    year: number;
    price: number;
    couleur?: string;
    ville?: string;
    disponible: boolean;
}

interface LeanCommandePopulated {
    _id: Types.ObjectId;
    client: LeanClient;
    voiture: LeanCar;
    statut: string;
    montant: number;
    fraisLivraison: number;
    montantTotal: number;
    dateCommande?: Date;
    dateLivraisonPrevue?: Date;
    createdAt?: Date;
}

interface LeanVentePopulated {
    _id: Types.ObjectId;
    client: LeanClient;
    voiture: { _id: Types.ObjectId; marque: string; model: string; year: number; price: number; couleur?: string; };
    commande?: { _id: Types.ObjectId; statut: string; montantTotal: number; };
    prixVente: number;
    statut: string;
    dateVente?: Date;
    datePaiement?: Date;
    numeroTransaction?: string;
    createdAt?: Date;
}

export const getDashboardData = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Début de la récupération des données dashboard...");

        const clients = await ClientModel.find().select('-password').lean<LeanClient[]>();
        const voitures = await CarModel.find().lean<LeanCar[]>();
        const commandes = await CommandeModel.find()
            .populate('client', 'name surname email phone profileImageUrl')
            .populate('voiture', 'marque model year price couleur ville')
            .lean<LeanCommandePopulated[]>();
        const ventes = await VenteModel.find()
            .populate('client', 'name surname email phone profileImageUrl')
            .populate('voiture', 'marque model year price couleur')
            .populate('commande', 'statut montantTotal')
            .lean<LeanVentePopulated[]>();
        const locations = await LocationModel.find().lean<any[]>();

        console.log(`Données récupérées - Clients: ${clients.length}, Voitures: ${voitures.length}, Commandes: ${commandes.length}, Ventes: ${ventes.length}, Locations: ${locations.length}`);

        const totalClients = clients.length;
        const totalVoitures = voitures.length;
        const voituresDisponibles = voitures.filter(v => v.disponible).length;
        const totalCommandes = commandes.length;
        const totalVentes = ventes.length;
        const voituresLouees = locations.filter((location) => ['Confirmée', 'En cours', 'Terminée'].includes(location?.statut)).length;

        const revenueTotal = ventes
            .filter(v => v.statut === 'Payée' || v.statut === 'Confirmée')
            .reduce((sum, vente) => sum + (vente.prixVente || 0), 0);

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        console.log(`Date de référence 30 jours: ${thirtyDaysAgo.toISOString()}`);

        const commandesRecent = commandes
            .filter(c => {
                const date = c.createdAt;
                return date && new Date(date) >= thirtyDaysAgo;
            })
            .sort((a, b) => {
                const dateA = a.createdAt ?? new Date(0);
                const dateB = b.createdAt ?? new Date(0);
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            });

        const ventesRecent = ventes
            .filter(v => {
                const date = v.createdAt;
                return date && new Date(date) >= thirtyDaysAgo;
            })
            .sort((a, b) => {
                const dateA = a.createdAt ?? new Date(0);
                const dateB = b.createdAt ?? new Date(0);
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            });

        const revenue30Jours = ventesRecent
            .filter(v => v.statut === 'Payée' || v.statut === 'Confirmée')
            .reduce((sum, vente) => sum + (vente.prixVente || 0), 0);

        const locationsRecent = locations.filter((location) => {
            const date = location?.createdAt;
            return date && new Date(date) >= thirtyDaysAgo;
        });

        console.log("Dates de création des ventes:");
        ventes.forEach(v => {
            console.log(`- Vente ${v._id}: ${v.createdAt}, statut: ${v.statut}, prix: ${v.prixVente}`);
        });

        const clientsListe = clients.map(client => ({
            id: client._id,
            nom: client.name,
            prenom: client.surname,
            email: client.email,
            profileImageUrl: client.profileImageUrl
        }));

        const voituresListe = voitures.map(voiture => ({
            id: voiture._id,
            marque: voiture.marque,
            modele: voiture.model,
            annee: voiture.year,
            prix: voiture.price,
            couleur: voiture.couleur,
            ville: voiture.ville,
            disponible: voiture.disponible
        }));

        const commandesRecentesListe = commandes
            .filter(commande => commande.client && commande.voiture)
            .sort((a, b) => {
                const dateA = a.dateCommande ?? a.createdAt ?? new Date(0);
                const dateB = b.dateCommande ?? b.createdAt ?? new Date(0);
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            })
            .slice(0, 10)
            .map(commande => ({
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

        const ventesRecentesListe = ventes
            .filter(vente => vente.client && vente.voiture)
            .sort((a, b) => {
                const dateA = a.dateVente ?? a.createdAt ?? new Date(0);
                const dateB = b.dateVente ?? b.createdAt ?? new Date(0);
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            })
            .slice(0, 10)
            .map(vente => ({
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

        const payload = {
            clients: {
                total: totalClients,
                liste: clientsListe
            },
            voitures: {
                total: totalVoitures,
                disponibles: voituresDisponibles,
                loue: voituresLouees,
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
                locations30Jours: locationsRecent.length,
                revenue30Jours
            }
        };

        console.log("Données dashboard préparées avec succès");
        console.log(`Résumé - Revenu total: ${revenueTotal}, Ventes 30j: ${ventesRecent.length}, Revenu 30j: ${revenue30Jours}`);

        res.status(200).json(payload);
    } catch (error) {
        console.error('Erreur de récupération des données dashboard:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};