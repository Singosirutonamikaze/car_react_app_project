import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AdminModel from '../models/Admin';

export interface AuthenticatedRequest extends Request {
  admin: {
    id: string;
    email?: string;
  };
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body || {};

    console.log('Tentative de connexion avec:', email);

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
      return;
    }

    const admin = await AdminModel.findOne({ email });
    console.log('Admin trouvé:', admin ? admin.email : 'Aucun');
    
    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
      return;
    }

    if (!admin.isActive) {
      res.status(401).json({
        success: false,
        message: 'Compte administrateur désactivé'
      });
      return;
    }

    console.log('Mot de passe fourni:', password);
    console.log('Mot de passe stocké (haché):', admin.password);
    
    console.log('Comparaison des mots de passe...');
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    console.log('Résultat de la comparaison:', isPasswordValid);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
      return;
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        token,
        user: {
          id: admin._id,
          email: admin.email,
          isActive: admin.isActive
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const admin = await AdminModel.findById(req.admin.id).select('-password');

    if (!admin) {
      res.status(404).json({
        success: false,
        message: 'Admin non trouvé'
      });
      return;
    }

    res.json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Mot de passe actuel et nouveau mot de passe requis'
      });
      return;
    }

    const admin = await AdminModel.findById(req.admin.id);
    if (!admin) {
      res.status(404).json({
        success: false,
        message: 'Admin non trouvé'
      });
      return;
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isCurrentPasswordValid) {
      res.status(400).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();

    res.json({
      success: true,
      message: 'Mot de passe changé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};
