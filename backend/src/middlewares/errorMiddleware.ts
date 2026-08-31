import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/CustomErrors';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: (err as any).errors || undefined
    });
    return;
  }

  // Handle mongoose unique errors or other standard errors if necessary
  console.error('[Unhandled Error]', err);

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};
