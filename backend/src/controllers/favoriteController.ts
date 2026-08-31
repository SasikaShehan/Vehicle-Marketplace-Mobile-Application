import { Request, Response, NextFunction } from 'express';
import { MongoFavoriteRepository } from '../repositories/FavoriteRepository';
import { ToggleFavorite } from '../use-cases/favorites/ToggleFavorite';

const favoriteRepository = new MongoFavoriteRepository();
const toggleFavoriteUseCase = new ToggleFavorite(favoriteRepository);

export const favoriteController = {
  async addFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const vehicleId = req.params.id as string;
      await toggleFavoriteUseCase.execute(userId, vehicleId, 'add');
      res.json({ success: true, data: {}, message: 'Added to favorites' });
    } catch (error) {
      next(error);
    }
  },

  async removeFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const vehicleId = req.params.id as string;
      await toggleFavoriteUseCase.execute(userId, vehicleId, 'remove');
      res.json({ success: true, data: {}, message: 'Removed from favorites' });
    } catch (error) {
      next(error);
    }
  },

  async getFavorites(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;

      const result = await favoriteRepository.getUserFavorites(userId, skip, limit);
      res.json({ 
        success: true, 
        data: result.data, 
        meta: { total: result.total, page, limit },
        message: 'Favorites retrieved' 
      });
    } catch (error) {
      next(error);
    }
  }
};
