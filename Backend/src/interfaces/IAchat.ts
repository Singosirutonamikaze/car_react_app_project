import { Types } from "mongoose";

export interface IAchat {
    _id?: Types.ObjectId;
    voiture: Types.ObjectId;
    commande: Types.ObjectId;
    prixAchat: number;
    statut: 'En attente' | 'Confirmé' | 'Payé' | 'Livré' | 'Terminé' | 'Annulé';
    dateAchat: Date;
    datePaiement?: Date;
    dateLivraison?: Date;
    numeroTransaction?: string;
    modePaiement: 'Espèces' | 'Virement' | 'Chèque' | 'Financement';
    notes?: string;
    evaluation?: {
        note: number;
        commentaire?: string;
        dateEvaluation: Date;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IPopulatedAchat extends Omit<IAchat, 'voiture' | 'commande'> {
    voiture: {
        _id: Types.ObjectId;
        marque: string;
        modele: string;
        annee: number;
        prix: number;
        images?: string[];
    };
    commande: {
        _id: Types.ObjectId;
        statut: string;
        montantTotal: number;
        dateCommande: Date;
        adresseLivraison: any;
    };
}

export interface IAchatDocument extends Document, Omit<IAchat, '_id'> { }
