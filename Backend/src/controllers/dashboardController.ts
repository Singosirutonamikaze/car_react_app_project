import { Request, Response } from 'express';
import CommandeModel from '../models/Commande';
import VenteModel from '../models/Vente';
import CarModel from '../models/Car';
import ClientModel from '../models/Client';

export const getDashboardData = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Début de la récupération des données dashboard...");
        
        // Récupérer toutes les données séparément
        const clients = await ClientModel.find().select('-password').lean();
        const voitures = await CarModel.find().lean();
        const commandes = await CommandeModel.find()
            .populate('client', 'name surname email phone profileImageUrl')
            .populate('voiture', 'marque model year price couleur ville')
            .lean();
        const ventes = await VenteModel.find()
            .populate('client', 'name surname email phone profileImageUrl')
            .populate('voiture', 'marque model year price couleur')
            .populate('commande', 'statut montantTotal')
            .lean();

        console.log(`Données récupérées - Clients: ${clients.length}, Voitures: ${voitures.length}, Commandes: ${commandes.length}, Ventes: ${ventes.length}`);

        // Calculer les statistiques de base
        const totalClients = clients.length;
        const totalVoitures = voitures.length;
        const voituresDisponibles = voitures.filter((v: any) => v.disponible).length;
        const totalCommandes = commandes.length;
        const totalVentes = ventes.length;
        
        // Revenu total (toutes les ventes confirmées ou payées)
        const revenueTotal = ventes
            .filter((v: any) => v.statut === 'Payée' || v.statut === 'Confirmée')
            .reduce((sum: number, vente: any) => sum + (vente.prixVente || 0), 0);

        // Période des 30 derniers jours
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        console.log(`Date de référence 30 jours: ${thirtyDaysAgo.toISOString()}`);

        // Commandes des 30 derniers jours (utiliser createdAt)
        const commandesRecent = commandes
            .filter((c: any) => {
                const date = c.createdAt;
                return date && new Date(date) >= thirtyDaysAgo;
            })
            .sort((a: any, b: any) => {
                const dateA = a.createdAt || new Date(0);
                const dateB = b.createdAt || new Date(0);
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            });

        // Ventes des 30 derniers jours (utiliser createdAt au lieu de dateVente)
        const ventesRecent = ventes
            .filter((v: any) => {
                const date = v.createdAt; // Utiliser createdAt plutôt que dateVente
                return date && new Date(date) >= thirtyDaysAgo;
            })
            .sort((a: any, b: any) => {
                const dateA = a.createdAt || new Date(0);
                const dateB = b.createdAt || new Date(0);
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            });

        // Revenu des 30 derniers jours
        const revenue30Jours = ventesRecent
            .filter((v: any) => v.statut === 'Payée' || v.statut === 'Confirmée')
            .reduce((sum: number, vente: any) => sum + (vente.prixVente || 0), 0);

        // Log des dates des ventes pour le débogage
        console.log("Dates de création des ventes:");
        ventes.forEach((v: any) => {
            console.log(`- Vente ${v._id}: ${v.createdAt}, statut: ${v.statut}, prix: ${v.prixVente}`);
        });

        // Préparer les données de réponse
        const clientsListe = clients.map((client: any) => ({
            id: client._id,
            nom: client.name,
            prenom: client.surname,
            email: client.email,
            profileImageUrl: client.profileImageUrl
        }));

        const voituresListe = voitures.map((voiture: any) => ({
            id: voiture._id,
            marque: voiture.marque,
            modele: voiture.model,
            annee: voiture.year,
            prix: voiture.price,
            couleur: voiture.couleur,
            ville: voiture.ville,
            disponible: voiture.disponible
        }));

        // Commandes récentes (toutes, pas seulement 30 jours)
        const commandesRecentesListe = commandes
            .filter((commande: any) => commande.client && commande.voiture)
            .sort((a: any, b: any) => {
                const dateA = a.dateCommande || a.createdAt || new Date(0);
                const dateB = b.dateCommande || b.createdAt || new Date(0);
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            })
            .slice(0, 10)
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

        // Ventes récentes (toutes, pas seulement 30 jours)
        const ventesRecentesListe = ventes
            .filter((vente: any) => vente.client && vente.voiture)
            .sort((a: any, b: any) => {
                const dateA = a.dateVente || a.createdAt || new Date(0);
                const dateB = b.dateVente || b.createdAt || new Date(0);
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            })
            .slice(0, 10)
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

        console.log("Données dashboard préparées avec succès");
        console.log(`Résumé - Revenu total: ${revenueTotal}, Ventes 30j: ${ventesRecent.length}, Revenu 30j: ${revenue30Jours}`);

        res.status(200).json(payload);
    } catch (error) {
        console.error('Erreur de récupération des données dashboard:', error);
        res.status(500).json({ 
            success: false,
            message: 'Erreur interne du serveur',
            error: error.message 
        });
    }
};