import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendSuccess = <T>(res: Response, data?: T, statusCode: number = 200): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    metadata: {
      timestamp: new Date().toISOString(),
      version: process.env.API_VERSION || 'v1',
    },
  };
  res.status(statusCode).json(response);
};

export const sendError = (res: Response, message: string, code: string, statusCode: number = 400): void => {
  const response: ApiResponse = {
    success: false,
    error: { message, code },
    metadata: {
      timestamp: new Date().toISOString(),
      version: process.env.API_VERSION || 'v1',
    },
  };
  res.status(statusCode).json(response);
};