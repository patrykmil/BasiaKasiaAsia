import { Request, Response, NextFunction } from 'express';
import { authenticateToken, AuthResult } from '../services/auth';

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

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  const authResult: AuthResult = authenticateToken(authHeader);
  
  if (!authResult.success) {
    res.status(401).json({ 
      error: 'Unauthorized', 
      message: authResult.error 
    });
    return;
  }
  
  // Add user info to request object
  req.user = authResult.payload;
  next();
};

/**
 * Optional authentication middleware - doesn't fail if no token provided
 */
export const optionalAuthentication = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const authResult: AuthResult = authenticateToken(authHeader);
    if (authResult.success) {
      req.user = authResult.payload;
    }
  }
  
  next();
};

/**
 * Middleware to check if user has specific role
 */
export const requireRole = (requiredRoleId: number) => {
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
};

/**
 * Middleware to check if user is admin (assuming role_id 1 is admin)
 */
export const requireAdmin = requireRole(3);

export default {
  authenticateJWT,
  optionalAuthentication,
  requireRole,
  requireAdmin,
};