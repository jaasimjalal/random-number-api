declare namespace Express {
  interface Request {
    validatedParams?: {
      min: number;
      max: number;
      count: number;
    };
  }
}