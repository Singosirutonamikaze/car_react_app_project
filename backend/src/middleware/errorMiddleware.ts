import { Request, Response, NextFunction } from 'express';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  // Payload JSON trop volumineux
  if ((error as any).type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Image trop lourde. Taille maximale autorisee: 1 Mo.'
    });
  }

  // Erreur Multer: fichier trop volumineux
  if ((error as any).code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'Image trop lourde. Taille maximale autorisee: 1 Mo.'
    });
  }

  // Erreur de validation Mongoose
  if (error.name === 'ValidationError' && (error as any).errors) {
    const errors = Object.values((error as any).errors).map((err: any) => ({
      field: err.path,
      message: err.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors
    });
  }
  
  // Erreur de duplication (unique constraint)
  if (error.name === 'MongoError' && (error as any).code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Cette ressource existe déjà'
    });
  }
  
  // Erreur JWT
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
  
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expiré'
    });
  }
  
  // Erreur par défaut
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur'
  });
};

// Middleware pour les routes non trouvées
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Route non trouvée: ${req.originalUrl}`
  });
};