// Custom Express request type definitions
export interface ValidatedRequestParams {
  min: number;
  max: number;
  count: number;
}

declare global {
  namespace Express {
    interface Request {
      validatedParams?: ValidatedRequestParams;
    }
  }
}
