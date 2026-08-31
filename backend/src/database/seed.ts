import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { UserModel } from './models/UserModel';
import { VehicleModel } from './models/VehicleModel';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vehicle-marketplace';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to Database. Starting seed process...');

    // Clear existing data
    await UserModel.deleteMany({});
    await VehicleModel.deleteMany({});
    console.log('Cleared existing data.');

    // Create Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123!', salt);

    const admin: any = await UserModel.create({
      email: 'admin@demo.com',
      password: hashedPassword,
      fullName: 'System Admin',
      role: 'Admin' as any,
      phoneNumber: '0711111111'
    });

    const seller: any = await UserModel.create({
      email: 'seller@demo.com',
      password: hashedPassword,
      fullName: 'Toyota Dealership',
      role: 'Seller' as any,
      phoneNumber: '0772222222'
    });

    const buyer: any = await UserModel.create({
      email: 'buyer@demo.com',
      password: hashedPassword,
      fullName: 'John Doe',
      role: 'Buyer' as any,
      phoneNumber: '0773333333'
    });

    console.log('Created Demo Users.');

    // Seed Vehicles
    const vehicles = [
      {
        make: 'Toyota',
        model: 'Camry',
        year: 2021,
        price: 8500000,
        mileage: 25000,
        fuelType: 'Hybrid',
        transmission: 'Automatic',
        vehicleType: 'Sedan',
        condition: 'Used',
        engineCapacity: 2500,
        description: 'Immaculate condition Toyota Camry. Carefully used by a company executive. Full service history available from agents.',
        location: { city: 'Colombo', district: 'Colombo' },
        sellerId: seller._id,
        status: 'Published' as any,
        images: [
          { url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?q=80&w=800&auto=format&fit=crop', isPrimary: true }
        ]
      },
      {
        make: 'Honda',
        model: 'Vezel',
        year: 2018,
        price: 6500000,
        mileage: 65000,
        fuelType: 'Hybrid',
        transmission: 'Automatic',
        vehicleType: 'SUV',
        condition: 'Used',
        engineCapacity: 1500,
        description: 'Honda Vezel Z Grade. First owner. Accident free. Pearl white.',
        location: { city: 'Kandy', district: 'Kandy' },
        sellerId: seller._id,
        status: 'Published' as any,
        images: [
          { url: 'https://images.unsplash.com/photo-1568844293986-8d0400ba4715?q=80&w=800&auto=format&fit=crop', isPrimary: true }
        ]
      },
      {
        make: 'Mercedes-Benz',
        model: 'C-Class',
        year: 2020,
        price: 18500000,
        mileage: 18000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        vehicleType: 'Sedan',
        condition: 'Used',
        engineCapacity: 1500,
        description: 'C200 AMG Line. Fully loaded. Panoramic sunroof, Burmester sound system.',
        location: { city: 'Colombo', district: 'Colombo' },
        sellerId: seller._id,
        status: 'Published' as any,
        images: [
          { url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format&fit=crop', isPrimary: true }
        ]
      },
      {
        make: 'Suzuki',
        model: 'Wagon R',
        year: 2019,
        price: 3800000,
        mileage: 45000,
        fuelType: 'Hybrid',
        transmission: 'Automatic',
        vehicleType: 'Hatchback',
        condition: 'Used',
        engineCapacity: 660,
        description: 'FZ Premium. JAAI certificate available. Mint condition.',
        location: { city: 'Gampaha', district: 'Gampaha' },
        sellerId: seller._id,
        status: 'Published' as any,
        images: [
          { url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop', isPrimary: true }
        ]
      }
    ];

    await VehicleModel.insertMany(vehicles);
    console.log('Created Realistic Vehicles.');

    console.log('=============================================');
    console.log('SEEDING SUCCESSFUL!');
    console.log('Admin: admin@demo.com / Password123!');
    console.log('Seller: seller@demo.com / Password123!');
    console.log('Buyer: buyer@demo.com / Password123!');
    console.log('=============================================');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Failed:', error);
    process.exit(1);
  }
};

seedDatabase();
