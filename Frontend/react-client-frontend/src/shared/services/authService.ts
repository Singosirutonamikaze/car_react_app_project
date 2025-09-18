import { API_CONFIG, API_PATHS } from '../utils/constants';
import type { Client } from '../types/client';

export interface LoginResponse {
    token: string;
    user: Client;
}

const authService = {
    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_PATHS.AUTH.LOGIN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Échec de la connexion');
        }

        return response.json();
    },

    async register(userData: Omit<Client, 'id'>): Promise<LoginResponse> {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_PATHS.AUTH.REGISTER}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Échec de l\'inscription');
        }

        return response.json();
    },
};

export default authService;