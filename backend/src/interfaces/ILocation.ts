import { Types } from 'mongoose';

export interface ILocation {
  _id?: Types.ObjectId;
  client: Types.ObjectId;
  voiture: Types.ObjectId;
  dateDebut: Date;
  dateFin: Date;
  duree: number; // en jours
  prixParJour: number;
  montantTotal: number;
  statut: 'En attente' | 'Confirmée' | 'En cours' | 'Terminée' | 'Annulée';
  modePaiement: 'Espèces' | 'Virement' | 'Chèque' | 'Mobile Money';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
