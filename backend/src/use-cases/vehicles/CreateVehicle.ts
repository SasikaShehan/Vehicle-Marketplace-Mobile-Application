import { IVehicleRepository } from '../../repositories/VehicleRepository';
import { Vehicle } from '../../entities/Vehicle';

export class CreateVehicle {
  constructor(private vehicleRepository: IVehicleRepository) {}

  async execute(sellerId: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    // Inject seller ID
    const data = { ...vehicleData, sellerId };
    return await this.vehicleRepository.create(data);
  }
}
