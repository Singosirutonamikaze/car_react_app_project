import type { ReactNode } from "react";

export interface DashboardUser {
  _id: string;
  name: string;
  surname: string;
  email: string;
  profileImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalCommandes: number;
  commandesEnCours: number;
  commandesLivrees: number;
  commandesAnnulees: number;
  totalFavorites: number;
  montantTotalCommandes: number;
}

export interface VoitureInfo {
  _id: string;
  marque: string;
  modele: string;
  annee: number;
  prix: number;
  images?: string[];
  disponible?: boolean;
  kilometrage?: number;
  carburant?: string;
}

export interface IAdresseLivraison {
  rue: string;
  ville: string;
  codePostal: string;
  pays: string;
}

export interface CommandeInfo {
  _id: string;
  statut: string;
  montantTotal: number;
  dateCommande: string;
  adresseLivraison?: IAdresseLivraison;
  voiture?: VoitureInfo;
}

export interface FavoriInfo {
  _id: string;
  voiture: VoitureInfo;
  dateAjout: string;
  notes?: string;
}

export interface AchatInfo {
  _id: string;
  voiture: VoitureInfo;
  commande: CommandeInfo;
  prixAchat: number;
  statut: "En attente" | "Confirmé" | "Payé" | "Livré" | "Terminé" | "Annulé";
  dateAchat: string;
  datePaiement?: string;
  dateLivraison?: string;
  numeroTransaction?: string;
  modePaiement: "Especes" | "Virement" | "Cheque" | "Financement";
  notes?: string;
  evaluation?: {
    note: number;
    commentaire?: string;
    dateEvaluation: string;
  };
}

export interface AchatChartPoint {
  date: string;
  totalAchats: number;
  totalMontant: number;
}

export interface AchatChartsResponse {
  success: boolean;
  points: AchatChartPoint[];
}

export interface MarqueFavorite {
  marque: string;
  count: number;
}

export interface UserPreferences {
  marquesFavorites: MarqueFavorite[];
}

export interface EnhancedUser extends DashboardUser {
  lastCommande?: CommandeInfo;
  stats: DashboardStats;
  recentCommandes: CommandeInfo[];
  recentFavorites: FavoriInfo[];
  preferences?: UserPreferences;
}

export interface ActivityItem {
  type: "achat" | "commande" | "favori";
  title: string;
  date: string;
  amount?: number;
  id?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AchatsResponse {
  achats: AchatInfo[];
  stats: Record<string, { count: number; totalMontant: number }>;
  pagination: PaginationInfo;
  success: boolean;
}

export interface FavorisResponse {
  favorites: FavoriInfo[];
  pagination: PaginationInfo;
  success: boolean;
}

export interface UserDataResponse {
  user: EnhancedUser;
  success: boolean;
}

export interface ProfileUpdateData {
  name?: string;
  surname?: string;
  profileImageUrl?: string;
}

export interface EvaluationData {
  note: number;
  commentaire?: string;
}

export interface StatusUpdateData {
  statut: string;
  datePaiement?: string;
  dateLivraison?: string;
  numeroTransaction?: string;
}

export interface ApiError {
  message: string;
  success: false;
  code?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface DashboardHookState {
  enhancedUser: EnhancedUser | null;
  achats: AchatsResponse | null;
  favorites: FavorisResponse | null;
  loading: boolean;
  error: string | null;
}

export interface DashboardHookActions {
  refreshData: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  refreshAchats: () => Promise<void>;
  refreshFavorites: () => Promise<void>;
  toggleFavorite: (voitureId: string) => Promise<void>;
  addEvaluation: (achatId: string, evaluation: EvaluationData) => Promise<void>;
  updateProfile: (profileData: ProfileUpdateData) => Promise<void>;
}

export interface DashboardHookReturn extends DashboardHookState, DashboardHookActions { }

export interface CardProps {
  title: string;
  value: string;
  icon: ReactNode;
  gradient: string;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onClick?: () => void;
  loading?: boolean;
}

export interface ActivityCardProps {
  activity: ActivityItem;
  onActivityClick?: (activity: ActivityItem) => void;
}

export interface StatsCardProps {
  title: string;
  stats: DashboardStats;
  loading?: boolean;
}

export interface FormatterOptions {
  locale?: string;
  currency?: string;
  dateFormat?: Intl.DateTimeFormatOptions;
}

export const ACTIVITY_TYPES = {
  ACHAT: "achat",
  COMMANDE: "commande",
  FAVORI: "favori",
} as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[keyof typeof ACTIVITY_TYPES];

export const STATUTS_ACHAT = {
  EN_ATTENTE: "En attente",
  CONFIRME: "Confirme",
  PAYE: "Paye",
  LIVRE: "Livre",
  TERMINE: "Termine",
  ANNULE: "Annule",
} as const;

export type StatutAchat = (typeof STATUTS_ACHAT)[keyof typeof STATUTS_ACHAT];

export const MODES_PAIEMENT = {
  ESPECES: "Especes",
  VIREMENT: "Virement",
  CHEQUE: "Cheque",
  FINANCEMENT: "Financement",
} as const;

export type ModePaiement = (typeof MODES_PAIEMENT)[keyof typeof MODES_PAIEMENT];

export interface FilterOptions {
  statut?: StatutAchat;
  dateDebut?: string;
  dateFin?: string;
  marque?: string;
  modePaiement?: ModePaiement;
}

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

export interface SearchOptions {
  query: string;
  fields: string[];
}
