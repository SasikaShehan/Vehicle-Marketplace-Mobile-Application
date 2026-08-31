import { Request, Response, NextFunction } from 'express';
import { ReportModel } from '../database/models/ReportModel';

export const reportController = {
  async createReport(req: Request, res: Response, next: NextFunction) {
    try {
      const reporterId = (req as any).user.userId;
      const vehicleId = req.params.id;
      const { reason, description } = req.body;

      if (!reason) {
        return res.status(400).json({ success: false, message: 'Report reason is required' });
      }

      // Check if user already reported this vehicle
      const existingReport = await ReportModel.findOne({ vehicleId, reporterId });
      if (existingReport) {
        return res.status(400).json({ success: false, message: 'You have already reported this listing' });
      }

      const report = await ReportModel.create({
        vehicleId: vehicleId as string,
        reporterId,
        reason,
        description
      });

      res.status(201).json({ success: true, data: report, message: 'Listing reported successfully' });
    } catch (error) {
      next(error);
    }
  }
};
