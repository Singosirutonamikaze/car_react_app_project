export interface Adresse {
  rue: string;
  ville: string;
  codePostal: string;
  pays: string;
}

export interface Order {
  _id?: string;
  client?: string;
  voiture: string;
  statut:
  | "En attente"
  | "Confirmee"
  | "Confirmée"
  | "En cours"
  | "Livree"
  | "Livrée"
  | "Annulee"
  | "Annulée";
  montant: number;
  fraisLivraison: number;
  montantTotal: number;
  modePaiement: "Especes" | "Espèces" | "Virement" | "Cheque" | "Chèque" | "Financement";
  adresseLivraison: Adresse;
  dateCommande: Date;
  dateLivraisonPrevue?: Date;
  dateLivraisonReelle?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LinkedAchat {
  _id?: string;
  statut?: string;
  commande?:
  | string
  | {
    _id?: string;
    statut?: string;
    montantTotal?: number;
    dateCommande?: string | Date;
  };
}

export interface CreateOrderResponse {
  success?: boolean;
  message?: string;
  data?: Order;
  achat?: LinkedAchat;
}
