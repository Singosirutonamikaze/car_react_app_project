import { Types } from 'mongoose';

export interface IAdresseLivraison {
  rue: string;
  ville: string;
  codePostal: string;
  pays: string;
}

export interface ICommande {
  _id?: Types.ObjectId;
  client: Types.ObjectId;
  voiture: Types.ObjectId;
  statut: 'En attente' | 'Confirmée' | 'En cours' | 'Livrée' | 'Annulée';
  montant: number;
  fraisLivraison: number;
  montantTotal: number;
  modePaiement: 'Espèces' | 'Virement' | 'Chèque' | 'Financement';
  adresseLivraison: IAdresseLivraison;
  dateCommande: Date;
  dateLivraisonPrevue?: Date;
  dateLivraisonReelle?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}