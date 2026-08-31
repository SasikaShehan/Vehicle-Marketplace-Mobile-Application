import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Secure all admin routes
router.use(requireAuth, requireRole(['Admin']));

router.get('/vehicles/pending', adminController.getPendingVehicles);
router.patch('/vehicles/:id/moderate', adminController.moderateVehicle);
router.get('/analytics', adminController.getPlatformAnalytics);
router.get('/reports', adminController.getReports);

export default router;
