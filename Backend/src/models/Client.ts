import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ClientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    surname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    profileImageUrl: {
      type: String,
      default: null
    },
  }, 
  { timestamps: true }
);

// Hash password before save
ClientSchema.pre('save', async function (next) {
  const user = this as any;
  if (!user.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

// Compare password method
ClientSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model('Client', ClientSchema);

// Export with proper typing
export default UserModel;

