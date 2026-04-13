const { Router } = require('express');
const chatController = require('../controllers/chatController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();

// Admin routes (cần authentication)
/**
 * @swagger
 * /chat/rooms/{id}:
 *   get:
 *     summary: Lấy thông tin phòng chat theo ID
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/rooms', authMiddleware, chatController.getAllRooms);
/**
 * @swagger
 * /chat/rooms/{id}:
 *   get:
 *     summary: Lấy thông tin phòng chat theo ID
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/rooms/:id', authMiddleware, chatController.getRoomById);
/**
 * @swagger
 * /chat/rooms/{roomId}/messages:
 *   get:
 *     summary: Lấy danh sách tin nhắn theo room
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 20
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/rooms/:roomId/messages', authMiddleware, chatController.getMessages);
/**
 * @swagger
 * /chat/unread-count:
 *   get:
 *     summary: Lấy số tin nhắn chưa đọc
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/unread-count', authMiddleware, chatController.getUnreadCount);

/**
 * PATCH /api/v1/chat/rooms/:id/meta
 * Cập nhật thuộc tính phòng chat (ưu tiên, trạng thái...)
 */
router.patch('/rooms/:id/meta', authMiddleware, chatController.updateRoomMeta);

module.exports = router;
