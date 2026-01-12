import express, { Request, Response, NextFunction } from 'express';
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

// Health check (before versioning for direct access)
app.get('/health', (req: Request, res: Response) => {
  res.redirect(`/${config.apiVersion}/health`);
});

// API Routes with versioning
app.use(`/${config.apiVersion}`, routes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Random Number API',
    version: config.apiVersion,
    endpoints: {
      random: `/${config.apiVersion}/random`,
      health: `/${config.apiVersion}/health`
    }
  });
});

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

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🔗 API Version: ${config.apiVersion}`);
});

export default app;