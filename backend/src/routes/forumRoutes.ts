import { Router } from 'express';
import * as forumController from '../controllers/forumController';
import { authenticateJWT, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes (no authentication required)
router.get('/forums', forumController.getAllForums);
router.get('/forums/:id', forumController.getForumById);
router.get('/categories/:categoryId/forums', forumController.getForumsByCategoryId);

// Admin-only routes (require authentication and admin role)
router.post('/forums', authenticateJWT, requireAdmin, forumController.createForum);
router.put('/forums/:id', authenticateJWT, requireAdmin, forumController.updateForum);
router.delete('/forums/:id', authenticateJWT, requireAdmin, forumController.deleteForum);

export default router;