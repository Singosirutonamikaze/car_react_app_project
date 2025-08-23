import { Types } from 'mongoose';

export interface IVente {
  _id?: Types.ObjectId;
  voiture: Types.ObjectId;
  client: Types.ObjectId;
  commande: Types.ObjectId;
  prixVente: number;
  statut: 'En attente' | 'Confirmée' | 'Payée' | 'Annulée';
  dateVente: Date;
  datePaiement?: Date;
  numeroTransaction?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}