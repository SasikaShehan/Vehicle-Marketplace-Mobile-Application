import mongoose, { Schema, Document } from 'mongoose';

export interface ISavedSearchDocument extends Omit<Document, 'model'> {
  userId: mongoose.Types.ObjectId;
  name: string;
  criteria: Record<string, any>;
  notificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SavedSearchSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    criteria: { type: Schema.Types.Mixed, required: true },
    notificationsEnabled: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const SavedSearchModel = mongoose.model<ISavedSearchDocument>('SavedSearch', SavedSearchSchema);
