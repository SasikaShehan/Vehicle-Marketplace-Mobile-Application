import { Vehicle, VehicleStatus } from '../entities/Vehicle';
import { VehicleModel } from '../database/models/VehicleModel';

export interface IVehicleRepository {
  create(vehicleData: Partial<Vehicle>): Promise<Vehicle>;
  findById(id: string): Promise<Vehicle | null>;
  update(id: string, updateData: Partial<Vehicle>): Promise<Vehicle | null>;
  delete(id: string): Promise<boolean>;
  find(query: any, skip: number, limit: number, sort?: any): Promise<{ data: Vehicle[]; total: number }>;
}

export class MongoVehicleRepository implements IVehicleRepository {
  private mapToEntity(doc: any): Vehicle {
    return {
      id: doc._id.toString(),
      sellerId: doc.sellerId.toString(),
      make: doc.make,
      model: doc.model,
      year: doc.year,
      price: doc.price,
      mileage: doc.mileage,
      fuelType: doc.fuelType,
      transmission: doc.transmission,
      vehicleType: doc.vehicleType,
      condition: doc.condition,
      engineCapacity: doc.engineCapacity,
      color: doc.color,
      location: doc.location,
      description: doc.description,
      contactPreference: doc.contactPreference,
      features: doc.features,
      images: doc.images.map((img: any) => ({
        id: img._id?.toString(),
        url: img.url,
        isPrimary: img.isPrimary,
        order: img.order
      })),
      status: doc.status as VehicleStatus,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  async create(vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    const vehicle = new VehicleModel(vehicleData);
    const saved = await vehicle.save();
    return this.mapToEntity(saved);
  }

  async findById(id: string): Promise<Vehicle | null> {
    const vehicle = await VehicleModel.findById(id);
    if (!vehicle) return null;
    return this.mapToEntity(vehicle);
  }

  async update(id: string, updateData: Partial<Vehicle>): Promise<Vehicle | null> {
    const updated = await VehicleModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return null;
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    const result = await VehicleModel.findByIdAndDelete(id);
    return !!result;
  }

  async find(query: any = {}, skip: number = 0, limit: number = 20, sort: any = { createdAt: -1 }): Promise<{ data: Vehicle[]; total: number }> {
    const [docs, total] = await Promise.all([
      VehicleModel.find(query).sort(sort).skip(skip).limit(limit),
      VehicleModel.countDocuments(query)
    ]);
    return { data: docs.map(d => this.mapToEntity(d)), total };
  }
}
