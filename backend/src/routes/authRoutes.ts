import { Router } from 'express';
import * as userController from '../controllers/userController';

const router = Router();

// Public routes
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);

export default router;