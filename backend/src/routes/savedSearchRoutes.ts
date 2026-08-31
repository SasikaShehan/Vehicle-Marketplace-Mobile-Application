import { Router } from 'express';
import { savedSearchController } from '../controllers/savedSearchController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.use(requireAuth);

router.post('/', savedSearchController.create);
router.get('/', savedSearchController.list);
router.delete('/:id', savedSearchController.remove);

export default router;
