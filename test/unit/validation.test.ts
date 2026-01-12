import { validateRandomNumberParams } from '../../src/middleware/validation';
import { Request, Response, NextFunction } from 'express';

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockJsonFn: jest.Mock;

  beforeEach(() => {
    mockJsonFn = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: mockJsonFn,
    };
    mockNext = jest.fn();
  });

  it('should pass valid parameters', () => {
    mockRequest = {
      query: { min: '10', max: '50', count: '5' },
    };

    validateRandomNumberParams(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalled();
    expect(mockRequest.validatedParams).toEqual({ min: 10, max: 50, count: 5 });
  });

  it('should use defaults when parameters are missing', () => {
    mockRequest = {
      query: {},
    };

    validateRandomNumberParams(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalled();
    expect(mockRequest.validatedParams).toEqual({ min: 0, max: 100, count: 1 });
  });

  it('should reject invalid numeric parameters', () => {
    mockRequest = {
      query: { min: 'abc', max: '50' },
    };

    validateRandomNumberParams(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockJsonFn).toHaveBeenCalled();
  });

  it('should reject when min >= max', () => {
    mockRequest = {
      query: { min: '50', max: '50' },
    };

    validateRandomNumberParams(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
  });

  it('should reject count out of range', () => {
    mockRequest = {
      query: { count: '150' },
    };

    validateRandomNumberParams(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
  });
});