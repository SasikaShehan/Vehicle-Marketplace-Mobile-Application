import { Router } from 'express';
import { authController } from '../controllers/authController';
import { requireAuth } from '../middlewares/authMiddleware';
import { authLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.me);

export default router;
