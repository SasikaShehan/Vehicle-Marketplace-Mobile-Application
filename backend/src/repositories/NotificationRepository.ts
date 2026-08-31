import { NotificationModel } from '../database/models/NotificationModel';
import { NotificationType } from '../entities/Chat';

export class NotificationRepository {
  async createNotification(userId: string, type: NotificationType, title: string, body: string, data?: any) {
    return await NotificationModel.create({ userId, type, title, body, data });
  }

  async getUserNotifications(userId: string) {
    return await NotificationModel.find({ userId }).sort({ createdAt: -1 });
  }

  async markAsRead(notificationId: string, userId: string) {
    return await NotificationModel.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );
  }
}
