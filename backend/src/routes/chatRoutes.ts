import { Router } from 'express';
import { chatController } from '../controllers/chatController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/conversations', chatController.getConversations);
router.post('/conversations', chatController.startOrGetConversation);
router.get('/conversations/:id/messages', chatController.getMessages);
router.post('/conversations/:id/messages', chatController.sendMessage);

export default router;
