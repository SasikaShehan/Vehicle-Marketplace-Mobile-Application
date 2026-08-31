import mongoose, { Schema, Document } from 'mongoose';

export interface IConversationDocument extends Omit<Document, 'model'> {
  vehicleId: mongoose.Types.ObjectId;
  buyerId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema: Schema = new Schema(
  {
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lastMessage: { type: String },
    lastMessageAt: { type: Date }
  },
  { timestamps: true }
);

ConversationSchema.index({ buyerId: 1, sellerId: 1, vehicleId: 1 }, { unique: true });

export const ConversationModel = mongoose.model<IConversationDocument>('Conversation', ConversationSchema);
