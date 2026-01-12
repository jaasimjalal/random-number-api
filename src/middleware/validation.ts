import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const validateRandomNumberParams = (req: Request, res: Response, next: NextFunction): void => {
  const min = req.query.min !== undefined ? parseInt(req.query.min as string, 10) : 0;
  const max = req.query.max !== undefined ? parseInt(req.query.max as string, 10) : 100;
  const count = req.query.count !== undefined ? parseInt(req.query.count as string, 10) : 1;

  if (isNaN(min) || isNaN(max) || isNaN(count)) {
    return sendError(res, 'Invalid parameter types. min, max, and count must be numbers', 'VALIDATION_ERROR', 400);
  }

  if (min >= max) {
    return sendError(res, 'Max value must be greater than min value', 'VALIDATION_ERROR', 400);
  }

  if (count < 1 || count > 100) {
    return sendError(res, 'Count must be between 1 and 100', 'VALIDATION_ERROR', 400);
  }

  req.validatedParams = { min, max, count };
  next();
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error:', err);
  sendError(res, 'Internal server error', 'INTERNAL_ERROR', 500);
};