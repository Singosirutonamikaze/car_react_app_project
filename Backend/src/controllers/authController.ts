import { Request, Response } from 'express';
import UserModel from '../models/Client';
import generateToken from '../utils/generateToken';
import type { Multer } from 'multer';

// Interface for the User document (add this to match your model)
export interface IUserDocument extends Document {
    _id: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    profileImageUrl?: string | null;
    comparePassword(candidatePassword: string): Promise<boolean>;
    toObject(): any;
}

type ReqWithFile = Request & { file?: Multer.File };

type AuthenticatedRequest = Request & { user?: { id: string } };

export const registerUser = async (req: ReqWithFile, res: Response): Promise<void> => {
    try {
        const { name, surname, email, password } = req.body;

        if (!name || !surname || !email || !password) {
            res.status(400).json({ message: "S'il vous plaît, remplissez tous les champs." });
            return;
        }

        const existingUser = await UserModel.findOne({ email }) as IUserDocument | null;
        if (existingUser) {
            res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
            return;
        }

        const profileImageUrl = req.file ? `/uploads/${req.file.filename}` : (req.body.profileImageUrl || null);

        const newUser = new UserModel({
            name,
            surname,
            email,
            password,
            profileImageUrl,
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

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Login request body:", req.body);
        const { email, password } = req.body || {};
        if (!email || !password) {
            res.status(400).json({ message: "S'il vous plaît, remplissez tous les champs." });
            return;
        }

        const user = await UserModel.findOne({ email }) as IUserDocument | null;
        if (!user) {
            res.status(400).json({ message: 'Utilisateur non trouvé.' });
            return;
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Mot de passe incorrect.' });
            return;
        }

        const token = generateToken(user._id.toString());
        const userToReturn = user.toObject();
        delete (userToReturn as any).password;

        res.status(200).json({ token, user: userToReturn });
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

export const getUserInfo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        console.log("getUserInfo request user:", req.user);
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }

        const user = await UserModel.findById(userId).select('-password') as IUserDocument | null;
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Erreur getUserInfo :", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};