export interface LoginData {
    email: string;
    password: string;
}

export interface User {
    name: string;
    surname: string;
    email: string;
    password: string;
    profileImageUrl?: string | null;
}
export interface RegisterData {
    name: string;
    surname: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
    message?: string;
}