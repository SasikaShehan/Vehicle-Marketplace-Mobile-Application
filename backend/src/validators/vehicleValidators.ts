import { z } from 'zod';
import { VehicleStatus, VehicleType } from '../entities/Vehicle';

export const createVehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  price: z.number().positive('Price must be positive'),
  mileage: z.number().nonnegative('Mileage must be non-negative'),
  fuelType: z.string().min(1, 'Fuel type is required'),
  transmission: z.string().min(1, 'Transmission is required'),
  vehicleType: z.nativeEnum(VehicleType).or(z.string()),
  condition: z.string().min(1, 'Condition is required'),
  engineCapacity: z.number().positive('Engine capacity must be positive'),
  color: z.string().min(1, 'Color is required'),
  location: z.object({
    city: z.string().min(1, 'City is required'),
    district: z.string().min(1, 'District is required')
  }),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  contactPreference: z.string().optional(),
  features: z.array(z.string()).optional(),
  images: z.array(
    z.object({
      url: z.string().url(),
      isPrimary: z.boolean().optional(),
      order: z.number().optional()
    })
  ).min(1, 'At least one image is required'),
  status: z.nativeEnum(VehicleStatus).optional()
});

export const updateVehicleSchema = createVehicleSchema.partial();
