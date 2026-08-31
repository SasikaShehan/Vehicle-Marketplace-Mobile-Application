import { FavoriteModel } from '../database/models/FavoriteModel';
import { Vehicle } from '../entities/Vehicle';

export interface IFavoriteRepository {
  add(userId: string, vehicleId: string): Promise<boolean>;
  remove(userId: string, vehicleId: string): Promise<boolean>;
  isFavorited(userId: string, vehicleId: string): Promise<boolean>;
  getUserFavorites(userId: string, skip: number, limit: number): Promise<{ data: any[]; total: number }>;
}

export class MongoFavoriteRepository implements IFavoriteRepository {
  async add(userId: string, vehicleId: string): Promise<boolean> {
    try {
      await FavoriteModel.create({ userId, vehicleId });
      return true;
    } catch (error: any) {
      if (error.code === 11000) return true; // Already exists
      throw error;
    }
  }

  async remove(userId: string, vehicleId: string): Promise<boolean> {
    const result = await FavoriteModel.deleteOne({ userId, vehicleId });
    return result.deletedCount > 0;
  }

  async isFavorited(userId: string, vehicleId: string): Promise<boolean> {
    const exists = await FavoriteModel.exists({ userId, vehicleId });
    return exists !== null;
  }

  async getUserFavorites(userId: string, skip: number, limit: number): Promise<{ data: any[]; total: number }> {
    const [docs, total] = await Promise.all([
      FavoriteModel.find({ userId })
        .populate('vehicleId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      FavoriteModel.countDocuments({ userId })
    ]);
    
    // Map populated data
    const data = docs.map(doc => {
      const v = doc.vehicleId as any;
      if (!v) return null;
      return {
        id: v._id.toString(),
        make: v.make,
        model: v.model,
        year: v.year,
        price: v.price,
        mileage: v.mileage,
        fuelType: v.fuelType,
        transmission: v.transmission,
        images: v.images,
        status: v.status
      };
    }).filter(item => item !== null);

    return { data, total };
  }
}
