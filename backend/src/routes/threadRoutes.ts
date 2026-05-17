import { Router } from 'express';
import * as threadController from '../controllers/threadController';
import { authenticateJWT, optionalAuthentication } from '../middleware/auth';

const router = Router();

// Public routes (no authentication required)
router.get('/threads', threadController.getAllThreads);
router.get('/threads/:id', threadController.getThreadById);
router.get('/forums/:forumId/threads', threadController.getThreadsByForumId);
router.get('/users/:userId/threads', threadController.getThreadsByUserId);

// Protected routes (require authentication)
router.post('/threads', authenticateJWT, threadController.createThread);
router.put('/threads/:id', authenticateJWT, threadController.updateThread);
router.delete('/threads/:id', authenticateJWT, threadController.deleteThread);

export default router;