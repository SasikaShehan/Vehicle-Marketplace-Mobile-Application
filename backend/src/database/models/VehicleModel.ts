import mongoose, { Schema, Document } from 'mongoose';
import { VehicleStatus, VehicleType } from '../../entities/Vehicle';

export interface IVehicleDocument extends Omit<Document, 'model'> {
  sellerId: mongoose.Types.ObjectId;
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
  images: {
    url: string;
    isPrimary: boolean;
    order: number;
  }[];
  status: VehicleStatus;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema: Schema = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    
    make: { type: String, required: true, index: true },
    model: { type: String, required: true, index: true },
    year: { type: Number, required: true, index: true },
    price: { type: Number, required: true, index: true },
    mileage: { type: Number, required: true },
    fuelType: { type: String, required: true },
    transmission: { type: String, required: true },
    vehicleType: { type: String, required: true },
    condition: { type: String, required: true },
    engineCapacity: { type: Number, required: true },
    color: { type: String, required: true },

    location: {
      city: { type: String, required: true, index: true },
      district: { type: String, required: true }
    },
    description: { type: String, required: true },
    contactPreference: { type: String, default: 'Phone' },
    features: [{ type: String }],
    
    images: [
      {
        url: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
        order: { type: Number, default: 0 }
      }
    ],

    status: { 
      type: String, 
      enum: Object.values(VehicleStatus), 
      default: VehicleStatus.DRAFT,
      index: true
    }
  },
  { timestamps: true }
);

// Compound indexes for searching
VehicleSchema.index({ make: 1, model: 1 });
VehicleSchema.index({ price: 1, year: -1 });

export const VehicleModel = mongoose.model<IVehicleDocument>('Vehicle', VehicleSchema);
