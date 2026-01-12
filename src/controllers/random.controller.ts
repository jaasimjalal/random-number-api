import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';
import { RandomNumberResponse } from '../types';

export const generateRandomNumber = (req: Request, res: Response): void => {
  const { min, max, count } = req.validatedParams;

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