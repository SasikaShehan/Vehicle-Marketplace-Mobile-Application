import { RefreshTokenModel } from '../database/models/RefreshTokenModel';

export interface IRefreshTokenRepository {
  create(token: string, userId: string, expiresAt: Date): Promise<void>;
  findByToken(token: string): Promise<any | null>;
  revokeByToken(token: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
}

export class MongoRefreshTokenRepository implements IRefreshTokenRepository {
  async create(token: string, userId: string, expiresAt: Date): Promise<void> {
    await RefreshTokenModel.create({
      token,
      user: userId,
      expiresAt
    });
  }

  async findByToken(token: string): Promise<any | null> {
    return await RefreshTokenModel.findOne({ token, isRevoked: false });
  }

  async revokeByToken(token: string): Promise<void> {
    await RefreshTokenModel.updateOne({ token }, { isRevoked: true });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await RefreshTokenModel.updateMany({ user: userId }, { isRevoked: true });
  }
}
