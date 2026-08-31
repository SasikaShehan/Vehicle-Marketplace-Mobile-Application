import { Request, Response, NextFunction } from 'express';
import { SavedSearchModel } from '../database/models/SavedSearchModel';

export const savedSearchController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const { name, criteria, notificationsEnabled } = req.body;

      if (!name || !criteria) {
        return res.status(400).json({ success: false, message: 'Name and criteria are required' });
      }

      const savedSearch = await SavedSearchModel.create({
        userId,
        name,
        criteria,
        notificationsEnabled: notificationsEnabled !== undefined ? notificationsEnabled : true
      });

      res.status(201).json({ success: true, data: savedSearch, message: 'Search saved successfully' });
    } catch (error) {
      next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const searches = await SavedSearchModel.find({ userId }).sort({ createdAt: -1 });
      res.json({ success: true, data: searches, message: 'Saved searches retrieved' });
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const searchId = req.params.id;
      
      const deleted = await SavedSearchModel.findOneAndDelete({ _id: searchId, userId });
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Saved search not found' });
      }

      res.json({ success: true, data: {}, message: 'Saved search deleted' });
    } catch (error) {
      next(error);
    }
  }
};
