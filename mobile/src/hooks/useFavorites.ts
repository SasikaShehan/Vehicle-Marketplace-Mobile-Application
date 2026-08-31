import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteService } from '../services/favoriteService';

export const useFavorites = (params: any = {}) => {
  return useQuery({
    queryKey: ['favorites', params],
    queryFn: () => favoriteService.getFavorites(params),
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vehicleId, isFavorite }: { vehicleId: string; isFavorite: boolean }) => {
      if (isFavorite) {
        return await favoriteService.removeFavorite(vehicleId);
      } else {
        return await favoriteService.addFavorite(vehicleId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};
