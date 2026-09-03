import { Request, Response, NextFunction } from 'express';
import { MongoVehicleRepository } from '../repositories/VehicleRepository';
import { CreateVehicle } from '../use-cases/vehicles/CreateVehicle';
import { GetVehicle } from '../use-cases/vehicles/GetVehicle';
import { createVehicleSchema, updateVehicleSchema } from '../validators/vehicleValidators';
import { ValidationError, AuthorizationError } from '../errors/CustomErrors';
import { VehicleStatus } from '../entities/Vehicle';

const vehicleRepository = new MongoVehicleRepository();
const createVehicleUseCase = new CreateVehicle(vehicleRepository);
const getVehicleUseCase = new GetVehicle(vehicleRepository);

export const vehicleController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const sellerId = (req as any).user.userId;
      const parsedData = createVehicleSchema.safeParse(req.body);
      
      if (!parsedData.success) {
        console.error('Validation errors:', JSON.stringify(parsedData.error.issues, null, 2));
        throw new ValidationError('Validation failed', parsedData.error.issues);
      }

      const vehicle = await createVehicleUseCase.execute(sellerId, parsedData.data as any);
      res.status(201).json({ success: true, data: vehicle, message: 'Vehicle created successfully' });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicle = await getVehicleUseCase.execute(req.params.id as string);
      res.json({ success: true, data: vehicle, message: 'Vehicle retrieved' });
    } catch (error) {
      next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;

      // Base query
      const query: any = { status: VehicleStatus.PUBLISHED };

      // Search & Filters
      if (req.query.keyword) {
        query.$or = [
          { make: { $regex: req.query.keyword, $options: 'i' } },
          { model: { $regex: req.query.keyword, $options: 'i' } },
          { description: { $regex: req.query.keyword, $options: 'i' } }
        ];
      }
      if (req.query.make) query.make = req.query.make;
      if (req.query.model) query.model = req.query.model;
      if (req.query.vehicleType) query.vehicleType = req.query.vehicleType;
      if (req.query.fuelType) query.fuelType = req.query.fuelType;
      if (req.query.transmission) query.transmission = req.query.transmission;
      if (req.query.condition) query.condition = req.query.condition;

      // Range Filters
      if (req.query.minPrice || req.query.maxPrice) {
        query.price = {};
        if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
      }
      if (req.query.minYear || req.query.maxYear) {
        query.year = {};
        if (req.query.minYear) query.year.$gte = Number(req.query.minYear);
        if (req.query.maxYear) query.year.$lte = Number(req.query.maxYear);
      }
      if (req.query.maxMileage) {
        query.mileage = { $lte: Number(req.query.maxMileage) };
      }

      // Sorting
      let sort: any = { createdAt: -1 };
      if (req.query.sort) {
        switch (req.query.sort) {
          case 'price_asc': sort = { price: 1 }; break;
          case 'price_desc': sort = { price: -1 }; break;
          case 'newest': sort = { createdAt: -1 }; break;
          case 'oldest': sort = { createdAt: 1 }; break;
          case 'mileage_asc': sort = { mileage: 1 }; break;
        }
      }

      const result = await vehicleRepository.find(query, skip, limit, sort);
      res.json({ 
        success: true, 
        data: result.data, 
        meta: { total: result.total, page, limit },
        message: 'Vehicles retrieved' 
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const sellerId = (req as any).user.userId;
      const vehicle = await getVehicleUseCase.execute(req.params.id as string);
      
      if (vehicle.sellerId !== sellerId) {
        throw new AuthorizationError('You can only update your own listings');
      }

      const parsedData = updateVehicleSchema.safeParse(req.body);
      if (!parsedData.success) {
        throw new ValidationError('Validation failed', parsedData.error.issues);
      }

      const updated = await vehicleRepository.update(req.params.id as string, parsedData.data as any);
      res.json({ success: true, data: updated, message: 'Vehicle updated successfully' });
    } catch (error) {
      next(error);
    }
  },

  async getMyListings(req: Request, res: Response, next: NextFunction) {
    try {
      const sellerId = (req as any).user.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;

      const query: any = { sellerId };
      if (req.query.status) query.status = req.query.status;

      const result = await vehicleRepository.find(query, skip, limit);
      res.json({ 
        success: true, 
        data: result.data, 
        meta: { total: result.total, page, limit },
        message: 'My listings retrieved' 
      });
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const sellerId = (req as any).user.userId;
      const { status } = req.body;
      
      const vehicle = await getVehicleUseCase.execute(req.params.id as string);
      
      if (vehicle.sellerId !== sellerId && (req as any).user.role !== 'Admin') {
        throw new AuthorizationError('You can only update your own listings');
      }

      if (!Object.values(VehicleStatus).includes(status)) {
        throw new ValidationError('Invalid status');
      }

      const updated = await vehicleRepository.update(req.params.id as string, { status });
      res.json({ success: true, data: updated, message: 'Status updated successfully' });
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const sellerId = (req as any).user.userId;
      const vehicle = await getVehicleUseCase.execute(req.params.id as string);
      
      if (vehicle.sellerId !== sellerId && (req as any).user.role !== 'Admin') {
        throw new AuthorizationError('You can only delete your own listings');
      }

      await vehicleRepository.delete(req.params.id as string);
      res.json({ success: true, data: {}, message: 'Vehicle deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};
