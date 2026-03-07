import type { Client, ClientDashboardStats } from "../../types/client";
import { API_CONFIG, API_PATHS } from "../../utils/constants";

const clientService = {
  async getUser(): Promise<Client> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_PATHS.USER.GET_PROFILE}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Echec de la recuperation des donnees utilisateur");
    }

    const data = await response.json();
    if (data && typeof data === "object" && "user" in data) {
      return data.user as Client;
    }

    return data as Client;
  },

  async getDashboardStats(): Promise<ClientDashboardStats> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_PATHS.DASHBOARD.GET_DASHBOARD_DATA}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Echec de la recuperation des statistiques du tableau de bord");
    }
    return response.json();
  },
};

export default clientService;
