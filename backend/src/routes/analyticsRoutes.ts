import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';

const router = Router();

router.get('/seller/dashboard', requireAuth, requireRole(['Seller', 'Admin']), analyticsController.getSellerDashboard);

export default router;
