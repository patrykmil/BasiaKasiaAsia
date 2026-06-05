import { Router } from 'express';
import { ThreadController } from '../controllers/threadController';
import { ThreadService } from '../services/thread';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// Instantiate service and controller
const threadService = new ThreadService();
const threadController = new ThreadController(threadService);

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
