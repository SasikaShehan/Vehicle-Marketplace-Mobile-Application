import { Request, Response, NextFunction } from 'express';
import { NotificationRepository } from '../repositories/NotificationRepository';

const notificationRepository = new NotificationRepository();

export const notificationController = {
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const notifications = await notificationRepository.getUserNotifications(userId);
      res.json({ success: true, data: notifications, message: 'Notifications retrieved' });
    } catch (error) {
      next(error);
    }
  },

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const notificationId = req.params.id as string;
      const notification = await notificationRepository.markAsRead(notificationId, userId);
      res.json({ success: true, data: notification, message: 'Notification marked as read' });
    } catch (error) {
      next(error);
    }
  }
};
