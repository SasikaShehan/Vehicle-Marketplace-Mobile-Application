import { Router } from 'express';
import { vehicleController } from '../controllers/vehicleController';
import { favoriteController } from '../controllers/favoriteController';
import { reportController } from '../controllers/reportController';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.get('/', vehicleController.list);
router.get('/:id', vehicleController.getById);

// Protected routes (Favorites)
router.post('/:id/favorite', requireAuth, favoriteController.addFavorite);
router.delete('/:id/favorite', requireAuth, favoriteController.removeFavorite);

// Protected routes (Reports)
router.post('/:id/report', requireAuth, reportController.createReport);

// Protected routes (Sellers and Admins)
router.get('/me/listings', requireAuth, vehicleController.getMyListings);
router.patch('/:id/status', requireAuth, vehicleController.updateStatus);

router.post('/', requireAuth, vehicleController.create);
router.patch('/:id', requireAuth, vehicleController.update);
router.delete('/:id', requireAuth, vehicleController.remove);

export default router;
