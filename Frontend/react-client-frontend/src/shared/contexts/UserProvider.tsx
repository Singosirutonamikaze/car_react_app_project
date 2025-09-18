// src/shared/contexts/AuthContext.tsx
import { useEffect, useState, type ReactNode } from 'react';
import type { Client } from '../types/client';
import { AuthContext, type AuthContextType } from './AuthContext';
import clientService from '../services/clientService';
import authService from '../services/authService';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<Client | null>(null);
    const [loading, setLoading] = useState(true);
    const isAuthenticated = !!user;

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const userData = await clientService.getUser();
                setUser(userData);
            }
        } catch (error) {
            console.error('Échec de la vérification d\'authentification:', error);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const { token, user: userData } = await authService.login(email, password);
        localStorage.setItem('token', token);
        setUser(userData);
    };

    const register = async (userData: Omit<Client, 'id'>) => {
        const { token, user: newUser } = await authService.register(userData);
        localStorage.setItem('token', token);
        setUser(newUser);
        return newUser;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};