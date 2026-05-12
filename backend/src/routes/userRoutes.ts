import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticateJWT, optionalAuthentication, requireAdmin } from '../middleware/auth';

const router = Router();

// Public user info routes (no auth required to view profiles)
router.get('/users',  authenticateJWT, requireAdmin, userController.getAllUsers);
router.get('/users/id/:id',  authenticateJWT, requireAdmin, userController.getUserById);
router.get('/users/nickname/:nickname',  authenticateJWT, requireAdmin, userController.getUserByNickname);

// Protected routes (require authentication)
router.get('/me', authenticateJWT, userController.getCurrentUser);
router.put('/users/:id', authenticateJWT, userController.updateUser);
router.delete('/users/:id', authenticateJWT, userController.deleteUser);

// Admin routes (require admin role)
router.post('/users/:id/ban', authenticateJWT, requireAdmin, userController.banUser);
router.post('/users/:id/unban', authenticateJWT, requireAdmin, userController.unbanUser);

// Legacy test route - can be removed
router.get('/test-me', authenticateJWT, (req, res) => {
  res.json({
    message: 'Authenticated user info',
    user: req.user,
  });
});

export default router;