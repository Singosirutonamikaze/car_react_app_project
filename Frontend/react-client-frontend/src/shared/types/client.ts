export interface Client {
    name: string;
    surname: string;
    email: string;
    password: string;
    profileImageUrl?: string | null
}

export interface DashboardStats {
  totalOrders: number;
  totalFavorites: number;
  totalPurchases: number;
  balance: number;
}