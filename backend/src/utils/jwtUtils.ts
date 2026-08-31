import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  role: string;
}

export const generateAccessToken = (userId: string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'your_jwt_secret_here';
  const expiresIn = (process.env.JWT_EXPIRES_IN || '15m') as any;
  return jwt.sign({ userId, role }, secret, { expiresIn });
};

export const generateRefreshToken = (userId: string): string => {
  const secret = process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_here';
  const expiresIn = (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any;
  return jwt.sign({ userId }, secret, { expiresIn });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET || 'your_jwt_secret_here';
  return jwt.verify(token, secret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  const secret = process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_here';
  return jwt.verify(token, secret) as { userId: string };
};
