import { Request, Response, NextFunction } from 'express';
import { RegisterUser } from '../use-cases/auth/RegisterUser';
import { LoginUser } from '../use-cases/auth/LoginUser';
import { RefreshAuthToken } from '../use-cases/auth/RefreshAuthToken';
import { MongoUserRepository } from '../repositories/UserRepository';
import { MongoRefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validators/authValidators';
import { ValidationError } from '../errors/CustomErrors';

const userRepository = new MongoUserRepository();
const refreshTokenRepository = new MongoRefreshTokenRepository();

const registerUserUseCase = new RegisterUser(userRepository);
const loginUserUseCase = new LoginUser(userRepository, refreshTokenRepository);
const refreshAuthTokenUseCase = new RefreshAuthToken(refreshTokenRepository, userRepository);

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = registerSchema.safeParse(req.body);
      if (!parsedData.success) {
        throw new ValidationError('Validation failed', parsedData.error.issues);
      }
      
      const user = await registerUserUseCase.execute(parsedData.data);
      res.status(201).json({ success: true, data: user, message: 'User registered successfully' });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = loginSchema.safeParse(req.body);
      if (!parsedData.success) {
        throw new ValidationError('Validation failed', parsedData.error.issues);
      }

      const { email, password } = parsedData.data;
      const result = await loginUserUseCase.execute(email, password);
      res.json({ success: true, data: result, message: 'Login successful' });
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = refreshTokenSchema.safeParse(req.body);
      if (!parsedData.success) {
        throw new ValidationError('Validation failed', parsedData.error.issues);
      }

      const result = await refreshAuthTokenUseCase.execute(parsedData.data.refreshToken);
      res.json({ success: true, data: result, message: 'Token refreshed successfully' });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        await refreshTokenRepository.revokeByToken(refreshToken);
      }
      res.json({ success: true, data: {}, message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  },
  
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      // User is injected by authMiddleware
      const userId = (req as any).user?.userId;
      if (!userId) throw new Error('Not authenticated');
      
      const user = await userRepository.findById(userId);
      if (!user) throw new Error('User not found');
      
      const { password, ...userWithoutPassword } = user;
      res.json({ success: true, data: userWithoutPassword, message: 'Profile retrieved' });
    } catch (error) {
      next(error);
    }
  }
};
