import type { CreateLocationPayload, LocationInfo, LocationsResponse } from "../../types/location";
import { API_CONFIG, API_PATHS } from "../../utils/constants";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function parseJsonSafe<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  return data as T;
}

export const locationService = {
  async getLocationsByClient(clientId: string): Promise<LocationInfo[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_PATHS.LOCATIONS.GET_BY_CLIENT(clientId)}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await parseJsonSafe<{ message?: string }>(response);
      throw new Error(errorData.message || "Echec de la recuperation des locations");
    }

    const result = await parseJsonSafe<LocationsResponse | LocationInfo[]>(response);
    if (Array.isArray(result)) {
      return result;
    }
    return Array.isArray(result.data) ? result.data : [];
  },

  async createLocation(payload: CreateLocationPayload): Promise<LocationInfo> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_PATHS.LOCATIONS.CREATE}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await parseJsonSafe<{ message?: string }>(response);
      throw new Error(errorData.message || "Echec de la creation de la location");
    }

    const result = await parseJsonSafe<{ success?: boolean; data?: LocationInfo } | LocationInfo>(response);
    if (result && typeof result === "object" && "data" in result && result.data) {
      return result.data;
    }
    return result as LocationInfo;
  },
};

export default locationService;
