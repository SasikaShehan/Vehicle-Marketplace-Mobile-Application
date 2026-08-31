import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwtUtils';
import { AuthenticationError, AuthorizationError } from '../errors/CustomErrors';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    
    (req as any).user = decoded; // { userId, role }
    next();
  } catch (error) {
    next(new AuthenticationError('Invalid or expired token'));
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      if (!user) throw new AuthenticationError('Not authenticated');
      if (!roles.includes(user.role)) {
        throw new AuthorizationError('Insufficient permissions');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
