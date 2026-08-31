export enum VehicleStatus {
  DRAFT = 'Draft',
  PENDING_REVIEW = 'Pending Review',
  PUBLISHED = 'Published',
  SOLD = 'Sold',
  EXPIRED = 'Expired',
  REJECTED = 'Rejected'
}

export enum VehicleType {
  CAR = 'Car',
  SUV = 'SUV',
  VAN = 'Van',
  MOTORCYCLE = 'Motorcycle',
  TRUCK = 'Truck',
  BUS = 'Bus',
  EV = 'Electric Vehicle',
  HYBRID = 'Hybrid Vehicle'
}

export interface VehicleImage {
  id?: string;
  url: string;
  isPrimary: boolean;
  order: number;
}

export interface Vehicle {
  id: string;
  sellerId: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  vehicleType: string;
  condition: string;
  engineCapacity: number;
  color: string;
  location: {
    city: string;
    district: string;
  };
  description: string;
  contactPreference: string;
  features: string[];
  images: VehicleImage[];
  status: VehicleStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedVehicles {
  success: boolean;
  data: Vehicle[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  message: string;
}

export interface SingleVehicleResponse {
  success: boolean;
  data: Vehicle;
  message: string;
}
