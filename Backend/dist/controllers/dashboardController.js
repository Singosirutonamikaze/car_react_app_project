"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardData = void 0;
const Commande_1 = __importDefault(require("../models/Commande"));
const Vente_1 = __importDefault(require("../models/Vente"));
const Car_1 = __importDefault(require("../models/Car"));
const Client_1 = __importDefault(require("../models/Client"));
const getDashboardData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Début de la récupération des données dashboard...");
        // Récupérer toutes les données séparément
        const clients = yield Client_1.default.find().select('-password').lean();
        const voitures = yield Car_1.default.find().lean();
        const commandes = yield Commande_1.default.find()
            .populate('client', 'name surname email phone profileImageUrl')
            .populate('voiture', 'marque model year price couleur ville')
            .lean();
        const ventes = yield Vente_1.default.find()
            .populate('client', 'name surname email phone profileImageUrl')
            .populate('voiture', 'marque model year price couleur')
            .populate('commande', 'statut montantTotal')
            .lean();
        console.log(`Données récupérées - Clients: ${clients.length}, Voitures: ${voitures.length}, Commandes: ${commandes.length}, Ventes: ${ventes.length}`);
        // Calculer les statistiques de base
        const totalClients = clients.length;
        const totalVoitures = voitures.length;
        const voituresDisponibles = voitures.filter((v) => v.disponible).length;
        const totalCommandes = commandes.length;
        const totalVentes = ventes.length;
        // Revenu total (toutes les ventes confirmées ou payées)
        const revenueTotal = ventes
            .filter((v) => v.statut === 'Payée' || v.statut === 'Confirmée')
            .reduce((sum, vente) => sum + (vente.prixVente || 0), 0);
        // Période des 30 derniers jours
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        console.log(`Date de référence 30 jours: ${thirtyDaysAgo.toISOString()}`);
        // Commandes des 30 derniers jours (utiliser createdAt)
        const commandesRecent = commandes
            .filter((c) => {
            const date = c.createdAt;
            return date && new Date(date) >= thirtyDaysAgo;
        })
            .sort((a, b) => {
            const dateA = a.createdAt || new Date(0);
            const dateB = b.createdAt || new Date(0);
            return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
        // Ventes des 30 derniers jours (utiliser createdAt au lieu de dateVente)
        const ventesRecent = ventes
            .filter((v) => {
            const date = v.createdAt; // Utiliser createdAt plutôt que dateVente
            return date && new Date(date) >= thirtyDaysAgo;
        })
            .sort((a, b) => {
            const dateA = a.createdAt || new Date(0);
            const dateB = b.createdAt || new Date(0);
            return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
        // Revenu des 30 derniers jours
        const revenue30Jours = ventesRecent
            .filter((v) => v.statut === 'Payée' || v.statut === 'Confirmée')
            .reduce((sum, vente) => sum + (vente.prixVente || 0), 0);
        // Log des dates des ventes pour le débogage
        console.log("Dates de création des ventes:");
        ventes.forEach((v) => {
            console.log(`- Vente ${v._id}: ${v.createdAt}, statut: ${v.statut}, prix: ${v.prixVente}`);
        });
        // Préparer les données de réponse
        const clientsListe = clients.map((client) => ({
            id: client._id,
            nom: client.name,
            prenom: client.surname,
            email: client.email,
            profileImageUrl: client.profileImageUrl
        }));
        const voituresListe = voitures.map((voiture) => ({
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
            .filter((commande) => commande.client && commande.voiture)
            .sort((a, b) => {
            const dateA = a.dateCommande || a.createdAt || new Date(0);
            const dateB = b.dateCommande || b.createdAt || new Date(0);
            return new Date(dateB).getTime() - new Date(dateA).getTime();
        })
            .slice(0, 10)
            .map((commande) => ({
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
            .filter((vente) => vente.client && vente.voiture)
            .sort((a, b) => {
            const dateA = a.dateVente || a.createdAt || new Date(0);
            const dateB = b.dateVente || b.createdAt || new Date(0);
            return new Date(dateB).getTime() - new Date(dateA).getTime();
        })
            .slice(0, 10)
            .map((vente) => ({
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
    }
    catch (error) {
        console.error('Erreur de récupération des données dashboard:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
            error: error.message
        });
    }
});
exports.getDashboardData = getDashboardData;
