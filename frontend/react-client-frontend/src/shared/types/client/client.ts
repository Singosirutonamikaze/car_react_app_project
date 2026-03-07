export interface Client {
  _id?: string;
  id?: string;
  name: string;
  surname: string;
  email: string;
  password?: string;
  profileImageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientDashboardStats {
  totalOrders: number;
  totalFavorites: number;
  totalPurchases: number;
  balance: number;
}
