export interface LocationCarInfo {
  _id?: string;
  marque?: string;
  modele?: string;
  modelCar?: string;
  year?: number;
  image?: string;
}

export interface LocationInfo {
  _id?: string;
  client?: string;
  voiture?: LocationCarInfo;
  dateDebut: string;
  dateFin: string;
  duree?: number;
  prixParJour: number;
  montantTotal?: number;
  statut?: "En attente" | "Confirmée" | "En cours" | "Terminée" | "Annulée";
  modePaiement: "Espèces" | "Virement" | "Chèque" | "Mobile Money";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLocationPayload {
  client?: string;
  voiture: string;
  dateDebut: string;
  dateFin: string;
  prixParJour: number;
  modePaiement: "Espèces" | "Virement" | "Chèque" | "Mobile Money";
  notes?: string;
}

export interface LocationsResponse {
  success: boolean;
  data: LocationInfo[];
  count?: number;
}
