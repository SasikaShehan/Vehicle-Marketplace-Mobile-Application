import mongoose, { Schema, Document } from 'mongoose';
import { NotificationType } from '../../entities/Chat';

export interface INotificationDocument extends Omit<Document, 'model'> {
  userId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  data?: any;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: Object.values(NotificationType), required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    data: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model<INotificationDocument>('Notification', NotificationSchema);
