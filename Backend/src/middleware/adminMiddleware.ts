// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AdminModel from '../models/Admin';

export interface AuthenticatedRequest extends Request {
  admin?: any;
}

export const adminAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ 
        success: false,
        message: 'Token d\'authentification requis' 
      });
      return;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET non défini');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    const admin = await AdminModel.findById(decoded.id).select('-password');
    
    if (!admin || !admin.isActive) {
      res.status(401).json({ 
        success: false,
        message: 'Admin non trouvé ou compte désactivé' 
      });
      return;
    }

    req.admin = { id: admin._id.toString(), email: admin.email };
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
};