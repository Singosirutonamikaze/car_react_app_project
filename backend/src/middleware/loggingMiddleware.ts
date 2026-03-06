import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        name: string;
        surname: string;
    };
    admin?: {
        adminId: string;
        email: string;
        name: string;
        surname: string;
    };
}

export const logAction = (action: string) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.admin) {
            console.log(`[${new Date().toISOString()}] Admin ${req.admin.email} (${req.admin.adminId}) - Action: ${action}`);
        } else if (req.user) {
            console.log(`[${new Date().toISOString()}] User ${req.user.email} (${req.user.id}) - Action: ${action}`);
        } else {
            console.log(`[${new Date().toISOString()}] Unknown user - Action: ${action}`);
        }
        next();
    };
};

// Middleware pour logger toutes les requêtes
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
};

// Middleware pour logger les erreurs
export const errorLogger = (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`[${new Date().toISOString()}] Error: ${error.message}`);
    console.error(error.stack);
    next(error);
};