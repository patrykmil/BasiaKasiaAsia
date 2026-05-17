import jwt from "jsonwebtoken";

// JWT secret - in production, this should come from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

export interface JWTPayload {
  userId: number;
  username: string;
  email: string;
  roleId?: number | null;
}

export interface AuthResult {
  success: boolean;
  payload?: JWTPayload;
  error?: string;
}

/**
 * Generate a JWT token for a user
 * @param payload User data to include in the token
 * @returns JWT token string
 */
export const generateToken = (payload: JWTPayload): string => {
  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: "bka-forum",
      audience: "bka-users",
    } as jwt.SignOptions);
    return token;
  } catch (error) {
    throw new Error(`Failed to generate token: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Verify and decode a JWT token
 * @param token JWT token string
 * @returns AuthResult with success status and decoded payload or error
 */
export const verifyToken = (token: string): AuthResult => {
  try {
    // Remove 'Bearer ' prefix if present
    const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    
    const decoded = jwt.verify(cleanToken, JWT_SECRET, {
      issuer: "bka-forum",
      audience: "bka-users",
    }) as JWTPayload;
    
    return {
      success: true,
      payload: decoded,
    };
  } catch (error) {
    let errorMessage = "Invalid token";
    
    if (error instanceof jwt.TokenExpiredError) {
      errorMessage = "Token has expired";
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorMessage = "Malformed token";
    } else if (error instanceof jwt.NotBeforeError) {
      errorMessage = "Token not active yet";
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Extract token from Authorization header
 * @param authHeader Authorization header value (e.g., "Bearer eyJ...")
 * @returns Token string or null if not found
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }
  
  return parts[1];
};

/**
 * Express middleware-compatible function to verify JWT token
 * @param authHeader Authorization header value
 * @returns AuthResult
 */
export const authenticateToken = (authHeader?: string): AuthResult => {
  const token = extractTokenFromHeader(authHeader);
  
  if (!token) {
    return {
      success: false,
      error: "No token provided",
    };
  }
  
  return verifyToken(token);
};

export default {
  generateToken,
  verifyToken,
  extractTokenFromHeader,
  authenticateToken,
};