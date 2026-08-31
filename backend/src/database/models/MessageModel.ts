import mongoose, { Schema, Document } from 'mongoose';

export interface IMessageDocument extends Omit<Document, 'model'> {
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  text: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model<IMessageDocument>('Message', MessageSchema);
