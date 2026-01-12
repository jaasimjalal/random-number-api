import { generateRandomNumber } from '../../src/controllers/random.controller';
import { Request, Response } from 'express';

describe('Random Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJsonFn: jest.Mock;

  beforeEach(() => {
    mockJsonFn = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: mockJsonFn,
    };
  });

  it('should generate random numbers correctly', () => {
    mockRequest = {
      validatedParams: { min: 10, max: 20, count: 5 },
    };

    generateRandomNumber(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockJsonFn).toHaveBeenCalled();
    const callArgs = mockJsonFn.mock.calls[0][0];
    expect(callArgs.success).toBe(true);
    expect(callArgs.data.numbers).toHaveLength(5);
    expect(callArgs.data.min).toBe(10);
    expect(callArgs.data.max).toBe(20);
  });

  it('should handle single number generation', () => {
    mockRequest = {
      validatedParams: { min: 0, max: 10, count: 1 },
    };

    generateRandomNumber(
      mockRequest as Request,
      mockResponse as Response
    );

    const callArgs = mockJsonFn.mock.calls[0][0];
    expect(callArgs.data.numbers).toHaveLength(1);
    expect(callArgs.data.numbers[0]).toBeGreaterThanOrEqual(0);
    expect(callArgs.data.numbers[0]).toBeLessThanOrEqual(10);
  });
});