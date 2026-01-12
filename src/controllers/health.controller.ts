import { Request, Response } from 'express';
import { HealthCheckResponse } from '../types';

const startTime = Date.now();

export const healthCheck = (req: Request, res: Response): void => {
  const uptime = (Date.now() - startTime) / 1000;

  const response: HealthCheckResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime,
    version: process.env.API_VERSION || 'v1',
  };

  res.status(200).json(response);
};