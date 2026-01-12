export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
  metadata?: {
    timestamp: string;
    version: string;
  };
}

export interface RandomNumberRequest {
  min?: number;
  max?: number;
  count?: number;
}

export interface RandomNumberResponse {
  numbers: number[];
  count: number;
  min: number;
  max: number;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
}