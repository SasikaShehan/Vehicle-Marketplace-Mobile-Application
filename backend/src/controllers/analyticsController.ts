import { Request, Response, NextFunction } from 'express';
import { AnalyticsRepository } from '../repositories/AnalyticsRepository';

const analyticsRepository = new AnalyticsRepository();

export const analyticsController = {
  async getSellerDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const sellerId = (req as any).user.userId;
      const stats = await analyticsRepository.getSellerDashboardStats(sellerId);
      res.json({ success: true, data: stats, message: 'Seller stats retrieved' });
    } catch (error) {
      next(error);
    }
  }
};
