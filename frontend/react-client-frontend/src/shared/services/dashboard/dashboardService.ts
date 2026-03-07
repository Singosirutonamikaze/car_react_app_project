import { API_CONFIG, API_PATHS } from "../../utils/constants";
import type {
  EnhancedUser,
  AchatsResponse,
  AchatChartsResponse,
  FavorisResponse,
  UserDataResponse,
  ProfileUpdateData,
  EvaluationData,
  StatusUpdateData,
  AchatInfo,
} from "../../types/dashboard";

class DashboardService {
  private readonly payloadTooLargeMessage = "Erreur trop large";

  private getAuthHeaders(token: string) {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  private async makeRequest<T>(url: string, token: string): Promise<T> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, {
      method: "GET",
      headers: this.getAuthHeaders(token),
    });
    if (!response.ok) {
      if (response.status === 413) {
        throw new Error(this.payloadTooLargeMessage);
      }
      throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.success && data.success !== undefined) {
      throw new Error(data.message || "Erreur lors de la requete");
    }
    return data;
  }

  async getUserEnhancedData(token: string): Promise<EnhancedUser> {
    const data = await this.makeRequest<UserDataResponse>(API_PATHS.USER.GET_USER_ENHANCED, token);
    return data.user;
  }

  async getUserAchats(token: string, page = 1, limit = 10): Promise<AchatsResponse> {
    try {
      const data = await this.makeRequest<AchatsResponse>(
        `${API_PATHS.ACHATS.GET_ALL}?page=${page}&limit=${limit}`,
        token,
      );
      return data;
    } catch {
      return {
        achats: [],
        stats: {},
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
        success: false,
      };
    }
  }

  async getUserAchatsChartsByDate(token: string): Promise<AchatChartsResponse> {
    try {
      const data = await this.makeRequest<AchatChartsResponse>(API_PATHS.ACHATS.CHARTS, token);
      return data;
    } catch {
      return {
        success: false,
        points: [],
      };
    }
  }

  async getUserFavorites(token: string, page = 1, limit = 10): Promise<FavorisResponse> {
    try {
      const data = await this.makeRequest<FavorisResponse>(
        `${API_PATHS.FAVORITES.GET_ALL}?page=${page}&limit=${limit}`,
        token,
      );
      return data;
    } catch {
      return {
        favorites: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
        success: false,
      };
    }
  }

  async getUserBasicData(token: string): Promise<EnhancedUser> {
    const data = await this.makeRequest<UserDataResponse>(API_PATHS.USER.GET_USER_DATA, token);
    return data.user;
  }

  async getUserProfile(token: string): Promise<EnhancedUser> {
    const data = await this.makeRequest<UserDataResponse>(API_PATHS.USER.GET_PROFILE, token);
    return data.user;
  }

  async updateUserProfile(token: string, profileData: ProfileUpdateData): Promise<UserDataResponse> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_PATHS.USER.UPDATE_PROFILE}`, {
      method: "PUT",
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      if (response.status === 413) {
        throw new Error(this.payloadTooLargeMessage);
      }

      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Erreur lors de la mise a jour du profil");
    }
    return data;
  }

  async toggleFavorite(token: string, voitureId: string): Promise<FavorisResponse> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_PATHS.FAVORITES.TOGGLE}`, {
      method: "PUT",
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({ voitureId }),
    });
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Erreur lors de la modification des favoris");
    }
    return data;
  }

  async addEvaluationToAchat(token: string, achatId: string, evaluation: EvaluationData): Promise<AchatsResponse> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_PATHS.ACHATS.ADD_EVALUATION(achatId)}`, {
      method: "POST",
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(evaluation),
    });
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Erreur lors de l'ajout de l'evaluation");
    }
    return data;
  }

  async updateAchatStatus(token: string, achatId: string, statusData: StatusUpdateData): Promise<AchatsResponse> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_PATHS.ACHATS.UPDATE_STATUS(achatId)}`, {
      method: "PUT",
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(statusData),
    });
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Erreur lors de la mise a jour du statut");
    }
    return data;
  }

  async createAchat(token: string, achatData: AchatInfo): Promise<AchatsResponse> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_PATHS.ACHATS.CREATE}`, {
      method: "POST",
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(achatData),
    });
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Erreur lors de la creation de l'achat");
    }
    return data;
  }

  getTokenFromStorage(): string | null {
    return localStorage.getItem("token");
  }

  isAuthenticated(): boolean {
    const token = this.getTokenFromStorage();
    return token !== null && token.length > 0;
  }

  handleError(error: unknown): string {
    if (typeof error === "object" && error !== null && "message" in error) {
      const message = (error as Error).message;
      if (message.includes("413")) {
        return this.payloadTooLargeMessage;
      }
      return message;
    }
    if (typeof error === "string") {
      return error;
    }
    return "Une erreur inattendue s'est produite";
  }

  formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Date invalide";
    }
  }

  formatCurrency(amount: number): string {
    try {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(amount);
    } catch {
      return `${amount} EUR`;
    }
  }

  getImageUrl(filename: string): string {
    if (!filename) return "";
    if (filename.startsWith("http")) {
      return filename;
    }
    return `${API_CONFIG.BASE_URL}${API_PATHS.UPLOADS.GET_IMAGE(filename)}`;
  }
}

export const dashboardService = new DashboardService();
export default DashboardService;
