// scripts/initAdmin.ts
import AdminModel from '../models/Admin';

const createDefaultAdmin = async () => {
  try {
    const adminCount = await AdminModel.countDocuments();

    if (adminCount === 0) {
      const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';

      console.log('Création de l\'admin par défaut...');
      const newAdmin = new AdminModel({
        email: defaultEmail,
        password: defaultPassword,
        isActive: true
      });

      await newAdmin.save();

      console.log('Admin par défaut créé avec succès');
      console.log('Email:', defaultEmail);
    } else {
      console.log('Admin(s) déjà existant(s) dans la base de données');
    }
  } catch (error) {
    console.error('Erreur lors de la création de l\'admin par défaut:', error);
  }
};

export default createDefaultAdmin;