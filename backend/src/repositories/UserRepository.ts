import { User, UserRole } from '../entities/User';
import { UserModel } from '../database/models/UserModel';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(userData: Partial<User>): Promise<User>;
}

export class MongoUserRepository implements IUserRepository {
  private mapToEntity(doc: any): User {
    return {
      id: doc._id.toString(),
      fullName: doc.fullName,
      email: doc.email,
      phoneNumber: doc.phoneNumber,
      password: doc.password,
      role: doc.role as UserRole,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    if (!user) return null;
    return this.mapToEntity(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    if (!user) return null;
    return this.mapToEntity(user);
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = new UserModel(userData);
    const savedUser = await user.save();
    return this.mapToEntity(savedUser);
  }
}
