import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoURI, {
      autoIndex: false,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB connecté avec succès");
  } catch (error) {
    if (error instanceof mongoose.Error) {
      console.error("Erreur spécifique à Mongoose :", error.message);
    } else if (error instanceof Error) {
      console.error("Erreur générale :", error.message);
    } else {
      console.error("Une erreur inconnue s'est produite lors de la connexion à MongoDB");
    }
    process.exit(1);
  }
};

export default connectDB;
