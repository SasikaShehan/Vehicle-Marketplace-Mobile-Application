import { VehicleModel } from '../database/models/VehicleModel';
import { VehicleStatus } from '../entities/Vehicle';

export class AnalyticsRepository {
  async getSellerDashboardStats(sellerId: string) {
    const [total, active, sold, drafts] = await Promise.all([
      VehicleModel.countDocuments({ sellerId }),
      VehicleModel.countDocuments({ sellerId, status: VehicleStatus.PUBLISHED }),
      VehicleModel.countDocuments({ sellerId, status: VehicleStatus.SOLD }),
      VehicleModel.countDocuments({ sellerId, status: VehicleStatus.DRAFT })
    ]);

    // Simulated views count (in a real app, this would query a page_views collection)
    const totalViews = total * 125 + active * 45;

    return {
      totalListings: total,
      activeListings: active,
      soldListings: sold,
      draftListings: drafts,
      totalViews
    };
  }
}
