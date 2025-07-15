import { Router } from 'express';
import {
    sendMessage,
    getChatHistory,
    markMessageAsRead,
    getUnreadCount
} from '../controllers/chatController';
import { authenticateToken } from '../middleware/auth';
import { validateMessage } from '../middleware/validation';

const router = Router();

// All chat routes require authentication
router.use(authenticateToken);

// Message routes
router.post('/send', validateMessage, sendMessage);
router.get('/history/:receiverId', getChatHistory);
router.put('/read/:messageId', markMessageAsRead);
router.get('/unread-count', getUnreadCount);

export default router; 