import { Request, Response } from 'express';
import UserModel from '../models/Client';
import generateToken from '../utils/generateToken';

export const getClients = async (_req: Request, res: Response): Promise<void> => {
    try {
        const clients = await UserModel.find().select('-password');
        res.json(clients);
    } catch (error) {
        console.error("Erreur lors de la récupération des clients :", error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

export const createClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, surname, email, password } = req.body;

        if (!name || !surname || !email || !password) {
            res.status(400).json({ message: "S'il vous plaît, remplissez tous les champs." });
            return;
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
            return;
        }

        const newUser = new UserModel({
            name,
            surname,
            email,
            password,
        });

        await newUser.save();

        const token = generateToken(newUser._id.toString());
        const userToReturn = newUser.toObject();
        delete (userToReturn as any).password;

        res.status(201).json({ token, user: userToReturn });
    } catch (error: any) {
        if (error?.code === 11000 && error.keyPattern?.email) {
            res.status(400).json({ message: "L'email est déjà utilisé." });
            return;
        }
        console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

export const updateClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!id) {
            res.status(400).json({
                message: 'ID du client requis'
            });
            return;
        }

        // Ne pas permettre la modification du mot de passe via cette route
        if (updates.password) {
            delete updates.password;
        }

        const client = await UserModel.findByIdAndUpdate(
            id, 
            updates, 
            { new: true, runValidators: true }
        ).select('-password');

        if (!client) {
            res.status(404).json({
                message: 'Client introuvable'
            });
            return;
        }

        res.json(client);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du client :", error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

export const deleteClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({
                message: 'ID du client requis'
            });
            return;
        }

        const client = await UserModel.findByIdAndDelete(id);

        if (!client) {
            res.status(404).json({
                message: 'Client introuvable'
            });
            return;
        }

        res.json({ message: 'Client supprimé avec succès' });
    } catch (error) {
        console.error("Erreur lors de la suppression du client :", error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};