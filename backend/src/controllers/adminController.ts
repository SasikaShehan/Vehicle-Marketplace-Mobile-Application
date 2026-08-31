import { Request, Response, NextFunction } from 'express';
import { VehicleModel } from '../database/models/VehicleModel';
import { UserModel } from '../database/models/UserModel';
import { ConversationModel } from '../database/models/ConversationModel';
import { ReportModel } from '../database/models/ReportModel';
import { VehicleStatus } from '../entities/Vehicle';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { NotificationType } from '../entities/Chat';

const notificationRepository = new NotificationRepository();

export const adminController = {
  async getReports(req: Request, res: Response, next: NextFunction) {
    try {
      const reports = await ReportModel.find()
        .populate('vehicleId', 'make model year')
        .populate('reporterId', 'fullName email')
        .sort({ createdAt: -1 });
      res.json({ success: true, data: reports, message: 'Reports retrieved' });
    } catch (error) {
      next(error);
    }
  },

  async getPendingVehicles(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;

      const [vehicles, total] = await Promise.all([
        VehicleModel.find({ status: VehicleStatus.PENDING_REVIEW })
          .populate('sellerId', 'fullName email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        VehicleModel.countDocuments({ status: VehicleStatus.PENDING_REVIEW })
      ]);

      res.json({ 
        success: true, 
        data: vehicles, 
        meta: { total, page, limit },
        message: 'Pending vehicles retrieved' 
      });
    } catch (error) {
      next(error);
    }
  },

  async moderateVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicleId = req.params.id;
      const { action, reason } = req.body; // action: 'Approve' | 'Reject'

      const newStatus = action === 'Approve' ? VehicleStatus.PUBLISHED : VehicleStatus.REJECTED;

      const vehicle = await VehicleModel.findByIdAndUpdate(
        vehicleId,
        { status: newStatus },
        { new: true }
      );

      if (!vehicle) {
        return res.status(404).json({ success: false, message: 'Vehicle not found' });
      }

      // Notify seller
      const notificationType = action === 'Approve' ? NotificationType.LISTING_APPROVED : NotificationType.LISTING_REJECTED;
      const title = action === 'Approve' ? 'Listing Approved' : 'Listing Rejected';
      const body = action === 'Approve' 
        ? `Your listing for ${vehicle.year} ${vehicle.make} has been published.`
        : `Your listing for ${vehicle.year} ${vehicle.make} was rejected. Reason: ${reason || 'Violation of terms.'}`;
      
      await notificationRepository.createNotification(vehicle.sellerId.toString(), notificationType, title, body);

      res.json({ success: true, data: vehicle, message: `Vehicle ${newStatus.toLowerCase()} successfully` });
    } catch (error) {
      next(error);
    }
  },

  async getPlatformAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const [totalUsers, totalVehicles, pendingVehicles, activeChats] = await Promise.all([
        UserModel.countDocuments(),
        VehicleModel.countDocuments(),
        VehicleModel.countDocuments({ status: VehicleStatus.PENDING_REVIEW }),
        ConversationModel.countDocuments()
      ]);

      res.json({ 
        success: true, 
        data: {
          totalUsers,
          totalVehicles,
          pendingVehicles,
          activeChats
        },
        message: 'Platform analytics retrieved' 
      });
    } catch (error) {
      next(error);
    }
  }
};
