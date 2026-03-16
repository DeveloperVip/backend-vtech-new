const { Router } = require('express');
const chatController = require('../controllers/chatController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();

// Admin routes (cần authentication)
router.get('/rooms', authMiddleware, chatController.getAllRooms);
router.get('/rooms/:id', authMiddleware, chatController.getRoomById);
router.get('/rooms/:roomId/messages', authMiddleware, chatController.getMessages);
router.get('/unread-count', authMiddleware, chatController.getUnreadCount);

module.exports = router;
