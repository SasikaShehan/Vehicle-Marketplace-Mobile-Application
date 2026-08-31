import { api } from './api';
import { PaginatedVehicles, SingleVehicleResponse } from '../types/vehicle';

export const sellerService = {
  getMyListings: async (params?: any): Promise<PaginatedVehicles> => {
    const response = await api.get<PaginatedVehicles>('/vehicles/me/listings', { params });
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<SingleVehicleResponse> => {
    const response = await api.patch<SingleVehicleResponse>(`/vehicles/${id}/status`, { status });
    return response.data;
  }
};
