export interface Adresse {
  rue: string;
  ville: string;
  codePostal: string;
  pays: string;
}

export interface Order {
  _id?: string;
  client: string;
  voiture: string;
  statut: 'En attente' | 'Confirmée' | 'En cours' | 'Livrée' | 'Annulée';
  montant: number;
  fraisLivraison: number;
  montantTotal: number;
  modePaiement: 'Espèces' | 'Virement' | 'Chèque' | 'Financement';
  adresseLivraison: Adresse;
  dateCommande: Date;
  dateLivraisonPrevue?: Date;
  dateLivraisonReelle?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}