import { IUserRepository } from '../../repositories/UserRepository';
import { IRefreshTokenRepository } from '../../repositories/RefreshTokenRepository';
import { comparePassword } from '../../utils/passwordUtils';
import { AuthenticationError } from '../../errors/CustomErrors';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwtUtils';
import { User } from '../../entities/User';

export class LoginUser {
  constructor(
    private userRepository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository
  ) {}

  async execute(email: string, pass: string): Promise<{ user: Omit<User, 'password'>; accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.password) {
      throw new AuthenticationError('Invalid email or password');
    }

    const isMatch = await comparePassword(pass, user.password);
    if (!isMatch) {
      throw new AuthenticationError('Invalid email or password');
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // Save refresh token to db
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    await this.refreshTokenRepository.create(refreshToken, user.id, expiresAt);

    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken
    };
  }
}
