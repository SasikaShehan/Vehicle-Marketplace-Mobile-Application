import { api } from './api';
import { PaginatedVehicles, SingleVehicleResponse, Vehicle } from '../types/vehicle';

export const vehicleService = {
  getVehicles: async (params?: any): Promise<PaginatedVehicles> => {
    const response = await api.get<PaginatedVehicles>('/vehicles', { params });
    return response.data;
  },
  
  getVehicleById: async (id: string): Promise<SingleVehicleResponse> => {
    const response = await api.get<SingleVehicleResponse>(`/vehicles/${id}`);
    return response.data;
  },

  createVehicle: async (data: Partial<Vehicle>): Promise<SingleVehicleResponse> => {
    const response = await api.post<SingleVehicleResponse>('/vehicles', data);
    return response.data;
  },

  updateVehicle: async (id: string, data: Partial<Vehicle>): Promise<SingleVehicleResponse> => {
    const response = await api.patch<SingleVehicleResponse>(`/vehicles/${id}`, data);
    return response.data;
  },

  deleteVehicle: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  }
};
