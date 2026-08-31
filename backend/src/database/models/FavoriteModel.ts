import mongoose, { Schema, Document } from 'mongoose';

export interface IFavoriteDocument extends Omit<Document, 'model'> {
  userId: mongoose.Types.ObjectId;
  vehicleId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FavoriteSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true, index: true }
  },
  { timestamps: true }
);

FavoriteSchema.index({ userId: 1, vehicleId: 1 }, { unique: true });

export const FavoriteModel = mongoose.model<IFavoriteDocument>('Favorite', FavoriteSchema);
