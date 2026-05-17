import { Router } from 'express';
import userRoutes from './userRoutes';
import threadRoutes from './threadRoutes';
import forumRoutes from './forumRoutes';
import commentRoutes from './commentRoutes';
import authRoutes from './authRoutes';

const router = Router();

// API routes
router.use('/api/v1', userRoutes);
router.use('/api/v1', threadRoutes);
router.use('/api/v1', forumRoutes);
router.use('/api/v1', commentRoutes);
// Auth routes (mounted to match frontend expectations: /api/auth)
router.use('/api/auth', authRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'BKA Forum API is running' 
  });
});

export default router;