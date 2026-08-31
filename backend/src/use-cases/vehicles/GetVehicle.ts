import { IVehicleRepository } from '../../repositories/VehicleRepository';
import { Vehicle } from '../../entities/Vehicle';
import { NotFoundError } from '../../errors/CustomErrors';

export class GetVehicle {
  constructor(private vehicleRepository: IVehicleRepository) {}

  async execute(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }
    return vehicle;
  }
}
