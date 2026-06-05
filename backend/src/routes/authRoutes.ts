import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { UserService } from '../services/user';
import { AuthService } from '../services/auth';

const router = Router();

// Instantiate services and controller
const userService = new UserService();
const authService = new AuthService();
const userController = new UserController(userService, authService);

// Public routes
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);

export default router;
