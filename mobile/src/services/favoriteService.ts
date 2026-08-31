import { api } from './api';

export const favoriteService = {
  getFavorites: async (params?: any) => {
    const response = await api.get('/favorites', { params });
    return response.data;
  },

  addFavorite: async (vehicleId: string) => {
    const response = await api.post(`/vehicles/${vehicleId}/favorite`);
    return response.data;
  },

  removeFavorite: async (vehicleId: string) => {
    const response = await api.delete(`/vehicles/${vehicleId}/favorite`);
    return response.data;
  }
};
