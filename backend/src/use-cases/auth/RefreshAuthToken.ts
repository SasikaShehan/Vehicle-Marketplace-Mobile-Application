import { IRefreshTokenRepository } from '../../repositories/RefreshTokenRepository';
import { IUserRepository } from '../../repositories/UserRepository';
import { AuthenticationError } from '../../errors/CustomErrors';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from '../../utils/jwtUtils';

export class RefreshAuthToken {
  constructor(
    private refreshTokenRepository: IRefreshTokenRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(oldRefreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const decoded = verifyRefreshToken(oldRefreshToken);
    if (!decoded || !decoded.userId) {
      throw new AuthenticationError('Invalid refresh token');
    }

    const tokenDoc = await this.refreshTokenRepository.findByToken(oldRefreshToken);
    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
      throw new AuthenticationError('Refresh token expired or revoked');
    }

    const user = await this.userRepository.findById(decoded.userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Revoke old token
    await this.refreshTokenRepository.revokeByToken(oldRefreshToken);

    // Generate new tokens
    const accessToken = generateAccessToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await this.refreshTokenRepository.create(newRefreshToken, user.id, expiresAt);

    return { accessToken, refreshToken: newRefreshToken };
  }
}
