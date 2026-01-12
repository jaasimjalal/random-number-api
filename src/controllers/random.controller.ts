import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';
import { RandomNumberResponse } from '../types';

export const generateRandomNumber = (req: Request, res: Response): void => {
  // Safely access validatedParams with optional chaining and nullish coalescing
  const min = req.validatedParams?.min ?? 0;
  const max = req.validatedParams?.max ?? 100;
  const count = req.validatedParams?.count ?? 1;

  const numbers: number[] = [];
  for (let i = 0; i < count; i++) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.push(randomNum);
  }

  const response: RandomNumberResponse = {
    numbers,
    count,
    min,
    max,
  };

  sendSuccess(res, response);
};