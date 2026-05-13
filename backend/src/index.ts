import 'reflect-metadata';
import express, { Request, Response } from "express";
import cors from 'cors';
import { connectDatabase } from './config/database';
import { ensureDefaultRoles, ensureDefaultAdmin } from './services/user';
import routes from './routes';
import logger from './config/logger';
import { morganMiddleware } from './middleware/logger';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logging
app.use(morganMiddleware);

// Routes
app.use('/', routes);

// 404 handler
app.use((req: Request, res: Response, next: any) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} was not found on this server.`
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Initialize database and start server
const startServer = async () => {
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
    app.listen(PORT, () => {
      logger.info(`Server running at http://localhost:${PORT}`);
      logger.info(`API documentation available at http://localhost:${PORT}/health`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`Logs directory: ${process.cwd()}/logs`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
