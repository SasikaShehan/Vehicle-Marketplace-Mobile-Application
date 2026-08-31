import { Router } from 'express';
import { favoriteController } from '../controllers/favoriteController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

// Protected routes
router.get('/', requireAuth, favoriteController.getFavorites);

export default router;
