import { Request, Response } from 'express';
import * as userService from '../services/user';
import { generateToken } from '../services/auth';
import bcrypt from 'bcrypt';
import logger from '../config/logger';

/**
 * Get current user (from JWT token)
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    
    const user = await userService.getUserById(req.user.userId, true);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json(user);
  } catch (error) {
    logger.error('Error getting current user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }
    
    const user = await userService.getUserById(userId, true);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json(user);
  } catch (error) {
    logger.error('Error getting user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get user by nickname
 */
export const getUserByNickname = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nickname } = req.params;
    
    const user = await userService.getUserByNickname(nickname, true);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json(user);
  } catch (error) {
    logger.error('Error getting user by nickname:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get all users with pagination
 */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const users = await userService.getAllUsers(limit, offset);
    
    // Transform users to the desired format
    const formattedUsers = users.map(user => ({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      date_of_birth: user.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : null,
      gender: user.gender,
      is_banned: user.is_banned,
      role: user.role?.name || 'user',
    }));
    
    res.json(formattedUsers);
  } catch (error) {
    logger.error('Error getting all users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Create new user (registration)
 */
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, date_of_birth, gender, role_id } = req.body;
    
    // Validate required fields
    if (!username || !email || !password) {
      res.status(400).json({ error: 'Username, email, and password are required' });
      return;
    }
    
    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const newUser = await userService.createUser({
      username,
      email,
      password_hash,
      date_of_birth,
      gender,
      role_id,
    });
    
    // Generate JWT token
    const token = generateToken({
      userId: newUser.user_id,
      username: newUser.username,
      email: newUser.email,
      roleId: newUser.role_id,
    });
    
    res.status(201).json({
      message: 'User created successfully',
    });
  } catch (error) {
    logger.error('Error creating user:', error);
    
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      res.status(409).json({ error: 'User with this email or nickname already exists' });
      return;
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Update user profile
 */
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    const { nickname, email, bio, role_id } = req.body;
    
    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }
    
    // Check if user can update this profile (either own profile or admin)
    if (req.user && req.user.userId !== userId && req.user.roleId !== 1) {
      res.status(403).json({ error: 'Cannot update another user\'s profile' });
      return;
    }
    
    const updatedUser = await userService.updateUser(userId, {
      nickname,
      email,
      bio,
      role_id,
    });
    
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json(updatedUser);
  } catch (error) {
    logger.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Delete user
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }
    
    // Check if user can delete this profile (either own profile or admin)
    if (req.user && req.user.userId !== userId && req.user.roleId !== 1) {
      res.status(403).json({ error: 'Cannot delete another user\'s profile' });
      return;
    }
    
    const deleted = await userService.deleteUser(userId);
    
    if (!deleted) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * User login
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }
    
    // Get user with password hash
    const user = await userService.getUserByEmail(email, true);
    
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    
    // Check if user is banned
    if (user.is_banned) {
      res.status(403).json({ error: 'Your account has been banned. Please contact support.' });
      return;
    }
    
    // Generate JWT access token
    const accessToken = generateToken({
      userId: user.user_id,
      username: user.username,
      email: user.email,
      roleId: user.role_id,
    });

    // For now we don't have a separate refresh-token implementation.
    // Use the same token as refresh token (placeholder) and set sensible expiry metadata
    const refreshToken = accessToken;
    const accessTokenExpiresIn = 60 * 60 * 24; // 24 hours in seconds
    const refreshTokenExpiresIn = 60 * 60 * 24 * 7; // 7 days in seconds

    res.json({
      role: user.role.name,
      access_token: accessToken,
      access_token_type: 'Bearer',
      refresh_token: refreshToken,
      access_token_expires_in: accessTokenExpiresIn,
      refresh_token_expires_in: refreshTokenExpiresIn,
    });
  } catch (error) {
    logger.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Logout user
 * Note: Since we're using stateless JWT tokens, the actual logout happens on the client side
 * by removing the token. This endpoint confirms the logout action.
 */
export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // In a stateless JWT system, we don't need to do anything on the server side
    // The client will remove the token from storage
    // If we had a token blacklist or database-tracked sessions, we'd invalidate them here
    
    res.json({ 
      message: 'Logged out successfully',
      success: true 
    });
  } catch (error) {
    logger.error('Error during logout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Ban user (admin only)
 */
export const banUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }
    
    // Check if user is admin
    if (req.user && req.user.roleId !== 3) {
      res.status(403).json({ error: 'Only administrators can ban users' });
      return;
    }
    
    const bannedUser = await userService.banUser(userId);
    
    if (!bannedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json({ message: 'User banned successfully', user: bannedUser });
  } catch (error) {
    logger.error('Error banning user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Unban user (admin only)
 */
export const unbanUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }
    
    // Check if user is admin
    if (req.user && req.user.roleId !== 3) {
      res.status(403).json({ error: 'Only administrators can unban users' });
      return;
    }
    
    const unbannedUser = await userService.unbanUser(userId);
    
    if (!unbannedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json({ message: 'User unbanned successfully', user: unbannedUser });
  } catch (error) {
    logger.error('Error unbanning user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default {
  getCurrentUser,
  getUserById,
  getUserByNickname,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  banUser,
  unbanUser,
};