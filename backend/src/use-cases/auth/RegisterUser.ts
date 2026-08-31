import { IUserRepository } from '../../repositories/UserRepository';
import { hashPassword } from '../../utils/passwordUtils';
import { ConflictError } from '../../errors/CustomErrors';
import { User, UserRole } from '../../entities/User';

export class RegisterUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(userData: any): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const hashedPassword = await hashPassword(userData.password);

    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
      role: userData.role || UserRole.BUYER
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
