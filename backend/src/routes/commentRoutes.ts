import { Router } from 'express';
import { CommentController } from '../controllers/commentController';
import { CommentService } from '../services/comment';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// Instantiate service and controller
const commentService = new CommentService();
const commentController = new CommentController(commentService);

// Public routes (no authentication required)
router.get('/threads/:threadId/comments/stats', commentController.getCommentStats);
router.get('/threads/:threadId/comments', commentController.getCommentsByThreadId);
router.get('/comments/:id', commentController.getCommentById);
router.get('/comments/:commentId/replies', commentController.getRepliesForComment);
router.get('/users/:userId/comments', commentController.getCommentsByUserId);

// Protected routes (require authentication)
router.post('/comments', authenticateJWT, commentController.createComment);
router.put('/comments/:id', authenticateJWT, commentController.updateComment);
router.delete('/comments/:id', authenticateJWT, commentController.deleteComment);

export default router;
