import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../../entities/User';

export interface IUserDocument extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.BUYER }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
