import { Router } from 'express';
import * as commentController from '../controllers/commentController';
import { authenticateJWT, optionalAuthentication } from '../middleware/auth';

const router = Router();

// Public routes (no authentication required)
router.get('/threads/:threadId/comments', commentController.getCommentsByThreadId);
router.get('/comments/:id', commentController.getCommentById);
router.get('/comments/:commentId/replies', commentController.getRepliesForComment);
router.get('/users/:userId/comments', commentController.getCommentsByUserId);
router.get('/threads/:threadId/comments/stats', commentController.getCommentStats);

// Protected routes (require authentication)
router.post('/comments', authenticateJWT, commentController.createComment);
router.put('/comments/:id', authenticateJWT, commentController.updateComment);
router.delete('/comments/:id', authenticateJWT, commentController.deleteComment);

export default router;