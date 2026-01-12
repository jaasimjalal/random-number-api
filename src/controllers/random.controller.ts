import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';
import { RandomNumberResponse } from '../types';
import { ValidatedRequestParams } from '../types/express-custom';

export const generateRandomNumber = (req: Request, res: Response): void => {
  // Type-safe parameter extraction
  const params: ValidatedRequestParams = req.validatedParams || {
    min: 0,
    max: 100,
    count: 1
  };

  const { min, max, count } = params;

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