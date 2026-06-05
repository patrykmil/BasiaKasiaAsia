import { Request, Response, NextFunction } from 'express';
import { AuthService, AuthResult } from '../services/auth';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        username: string;
        email: string;
        roleId?: number | null;
      };
    }
  }
}

export class AuthMiddleware {
  private authService: AuthService;

  constructor(authService?: AuthService) {
    this.authService = authService || new AuthService();
  }

  /**
   * Middleware to authenticate JWT tokens
   */
  public authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    const authResult: AuthResult = this.authService.authenticateToken(authHeader);

    if (!authResult.success) {
      res.status(401).json({
        error: 'Unauthorized',
        message: authResult.error,
      });
      return;
    }

    // Add user info to request object
    req.user = authResult.payload;
    next();
  };

  /**
   * Middleware for optional authentication (doesn't fail if no token)
   */
  public optionalAuthentication = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const authResult: AuthResult = this.authService.authenticateToken(authHeader);
      if (authResult.success) {
        req.user = authResult.payload;
      }
    }

    next();
  };

  /**
   * Middleware to check if user has specific role
   */
  public requireRole(requiredRoleId: number) {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      if (req.user.roleId !== requiredRoleId) {
        res.status(403).json({ error: 'Insufficient permissions' });
        return;
      }

      next();
    };
  }

  /**
   * Middleware to check if user is admin (role_id 3)
   */
  public get requireAdmin() {
    return this.requireRole(3);
  }
}

// Singleton instance
const authMiddleware = new AuthMiddleware();

// Backward-compatible named exports
export const authenticateJWT = authMiddleware.authenticateJWT;
export const optionalAuthentication = authMiddleware.optionalAuthentication;
export const requireRole = (requiredRoleId: number) =>
  authMiddleware.requireRole(requiredRoleId);
export const requireAdmin = authMiddleware.requireAdmin;

export default authMiddleware;
