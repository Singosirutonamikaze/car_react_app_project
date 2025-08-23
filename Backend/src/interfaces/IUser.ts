import { Document } from 'mongoose';

export interface IUserDocument extends Document {
  name: string;
  surname: string;
  email: string;
  password: string;
  profileImageUrl?: string | null;
  comparePassword(candidatePassword: string): Promise<boolean>;
}