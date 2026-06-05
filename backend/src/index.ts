import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database';
import { ensureDefaultRoles, ensureDefaultAdmin } from './services/user';
import routes from './routes';
import logger from './config/logger';
import { morganMiddleware } from './middleware/logger';

class App {
  private app: express.Application;
  private port: number | string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8000;

    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddleware(): void {
    const configuredOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
          .map((origin) => origin.trim())
          .filter(Boolean)
      : [];

    const corsOptions: cors.CorsOptions = {
      origin: configuredOrigins.length > 0 ? configuredOrigins : true,
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      optionsSuccessStatus: 204,
    };

    // Middleware
    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // HTTP request logging
    this.app.use(morganMiddleware);
  }

  private configureRoutes(): void {
    // Routes
    this.app.use('/', routes);
  }

  private configureErrorHandling(): void {
    // 404 handler
    this.app.use((req: Request, res: Response, next: any) => {
      logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`);
      res.status(404).json({
        error: 'Route not found',
        message: `The requested route ${req.originalUrl} was not found on this server.`,
      });
    });

    // Error handler
    this.app.use((err: any, req: Request, res: Response, next: any) => {
      logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
      res.status(500).json({
        error: 'Internal server error',
        message:
          process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
      });
    });
  }

  public async start(): Promise<void> {
    try {
      logger.info('Starting server initialization...');

      // Connect to database and sync models
      logger.info('Connecting to database...');
      await connectDatabase();
      logger.info('Database connected successfully');

      // Ensure default roles exist
      logger.info('Ensuring default roles exist...');
      await ensureDefaultRoles();
      logger.info('Default roles verified');

      // Ensure default admin exists
      logger.info('Ensuring default admin exists...');
      await ensureDefaultAdmin();
      logger.info('Default admin verified');

      // Start server
      this.app.listen(this.port, () => {
        logger.info(`Server running at http://localhost:${this.port}`);
        logger.info(
          `API documentation available at http://localhost:${this.port}/health`
        );
        logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
        logger.info(`Logs directory: ${process.cwd()}/logs`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Initialize and start the application
const application = new App();
application.start();
