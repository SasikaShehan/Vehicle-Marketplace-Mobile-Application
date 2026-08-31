import mongoose, { Schema, Document } from 'mongoose';

export interface IRefreshTokenDocument extends Document {
  token: string;
  user: mongoose.Types.ObjectId;
  expiresAt: Date;
  isRevoked: boolean;
}

const RefreshTokenSchema: Schema = new Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true },
    isRevoked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const RefreshTokenModel = mongoose.model<IRefreshTokenDocument>('RefreshToken', RefreshTokenSchema);
