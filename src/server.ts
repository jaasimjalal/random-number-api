import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config, isProduction } from './config';
import routes from './routes';
import { apiRateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/validation';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(apiRateLimiter);

// Health check - directly mounted
app.get('/health', (req: Request, res: Response) => {
  const uptime = (Date.now() - (globalThis as any).startTime) / 1000;
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime,
    version: config.apiVersion
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Random Number API',
    version: config.apiVersion,
    endpoints: {
      random: `/${config.apiVersion}/random`,
      health: `/health`
    }
  });
});

// API Routes with versioning
app.use(`/${config.apiVersion}`, routes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Endpoint not found',
      code: 'NOT_FOUND'
    }
  });
});

// Global error handler
app.use(errorHandler);

// Start server (only if not in test mode)
if (require.main === module) {
  (globalThis as any).startTime = Date.now();
  app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
    console.log(`📊 Environment: ${config.nodeEnv}`);
    console.log(`🔗 API Version: ${config.apiVersion}`);
  });
}

// Set start time for tests
(globalThis as any).startTime = Date.now();

export default app;