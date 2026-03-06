import { NextFunction, Response, Request } from "express";
import UserModel from "../models/Client";
import jwt  from "jsonwebtoken";
import Admin from "../models/Admin";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
  admin?: {
    id: string;
    email?: string;
  };
}

export const userProtect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ 
        success: false,
        message: 'Token d\'authentification requis' 
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as any;
    const user = await UserModel.findById(decoded.id).select('-password');
    
    if (!user) {
      res.status(401).json({ 
        success: false,
        message: 'Utilisateur non trouvé' 
      });
      return;
    }

    req.user = { id: user._id.toString(), email: user.email };
    next();
  } catch (error) {
    console.error('Erreur d\'authentification utilisateur:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
};

// middleware/authMiddleware.ts
export const adminProtect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ 
        success: false,
        message: 'Token d\'authentification requis' 
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as any;
    const admin = await Admin.findById(decoded.id).select('-password');
    
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
    console.error('Erreur d\'authentification admin:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
};