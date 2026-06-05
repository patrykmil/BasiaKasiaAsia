import { Router } from 'express';
import { ForumController } from '../controllers/forumController';
import { ForumService } from '../services/forum';
import { authenticateJWT, requireAdmin } from '../middleware/auth';

const router = Router();

// Instantiate service and controller
const forumService = new ForumService();
const forumController = new ForumController(forumService);

// Public routes (no authentication required)
router.get('/forums', forumController.getAllForums);
router.get('/forums/:id', forumController.getForumById);
router.get('/categories/:categoryId/forums', forumController.getForumsByCategoryId);

// Admin-only routes (require authentication and admin role)
router.post('/forums', authenticateJWT, requireAdmin, forumController.createForum);
router.put('/forums/:id', authenticateJWT, requireAdmin, forumController.updateForum);
router.delete(
  '/forums/:id',
  authenticateJWT,
  requireAdmin,
  forumController.deleteForum
);

export default router;
