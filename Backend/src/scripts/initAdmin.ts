// scripts/initAdmin.ts
import mongoose from 'mongoose';
import AdminModel from '../models/Admin';
import bcrypt from 'bcryptjs';

const createDefaultAdmin = async () => {
  try {
    const adminCount = await AdminModel.countDocuments();
    
    if (adminCount === 0) {
      const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
      
      console.log('Création de l\'admin par défaut avec le mot de passe:', defaultPassword);
      const newAdmin = new AdminModel({
        email: defaultEmail,
        password: defaultPassword, 
        isActive: true
      });
      
      await newAdmin.save(); 
      
      console.log('Admin par défaut créé avec succès');
      console.log('Email:', defaultEmail);
      console.log('Mot de passe (en clair):', defaultPassword);
      
      const savedAdmin = await AdminModel.findOne({ email: defaultEmail });
      console.log('Mot de passe haché en base:', savedAdmin?.password);
    } else {
      console.log('Admin(s) déjà existant(s) dans la base de données');
    }
  } catch (error) {
    console.error('Erreur lors de la création de l\'admin par défaut:', error);
  }
};

export default createDefaultAdmin;