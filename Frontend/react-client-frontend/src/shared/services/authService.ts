import type { AuthResponse, LoginData, RegisterData } from "../types/auth";
import { API_CONFIG, API_PATHS } from "../utils/constants";

export const authService = {
    async login(data: LoginData): Promise<AuthResponse> {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_PATHS.AUTH.LOGIN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Échec de la connexion');
        }

        return result;
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_PATHS.AUTH.REGISTER}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Échec de l'inscription");
        }

        return result;
    },
};