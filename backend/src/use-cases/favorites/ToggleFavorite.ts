import { IFavoriteRepository } from '../../repositories/FavoriteRepository';

export class ToggleFavorite {
  constructor(private favoriteRepository: IFavoriteRepository) {}

  async execute(userId: string, vehicleId: string, action: 'add' | 'remove'): Promise<boolean> {
    if (action === 'add') {
      return await this.favoriteRepository.add(userId, vehicleId);
    } else {
      return await this.favoriteRepository.remove(userId, vehicleId);
    }
  }
}
