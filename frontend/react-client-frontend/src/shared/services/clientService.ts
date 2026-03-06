import type { Client, DashboardStats } from "../types/client";
import { API_CONFIG, API_PATHS } from "../utils/constants";

const clientService = {
  async getUser(): Promise<Client> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_PATHS.AUTH.GET_USER}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error("Échec de la récupération des données utilisateur");
    }
    return response.json();
  },
  async getDashboardStats(): Promise<DashboardStats> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_PATHS.DASHBOARD.GET_DASHBOARD_DATA}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error("Échec de la récupération des statistiques du tableau de bord");
    }
    return response.json();
  },
};

export default clientService;