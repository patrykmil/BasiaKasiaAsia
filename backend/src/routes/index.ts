import { Router } from 'express';
import userRoutes from './userRoutes';
import threadRoutes from './threadRoutes';
import forumRoutes from './forumRoutes';
import commentRoutes from './commentRoutes';
import authRoutes from './authRoutes';

export class AppRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.configureRoutes();
  }

  private configureRoutes(): void {
    // API routes
    this.router.use('/api/v1', userRoutes);
    this.router.use('/api/v1', threadRoutes);
    this.router.use('/api/v1', forumRoutes);
    this.router.use('/api/v1', commentRoutes);
    // Auth routes (mounted to match frontend expectations: /api/auth)
    this.router.use('/api/auth', authRoutes);

    // Health check
    this.router.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'BKA Forum API is running',
        version: 'v1',
      });
    });
  }

  public getRouter(): Router {
    return this.router;
  }
}

// Backward-compatible default export
const appRouter = new AppRouter();
export default appRouter.getRouter();
