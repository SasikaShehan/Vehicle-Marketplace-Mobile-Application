import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '../services/vehicleService';

export const useVehicles = (params: any = {}) => {
  return useQuery({
    queryKey: ['vehicles', params],
    queryFn: () => vehicleService.getVehicles(params),
  });
};

export const useVehicleById = (id: string) => {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehicleService.getVehicleById(id),
    enabled: !!id,
  });
};
