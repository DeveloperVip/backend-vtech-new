const { Router } = require('express');
const partnerController = require('../controllers/partnerController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();

/**
 * @swagger
 * /partners:
 *   get:
 *     summary: Lấy danh sách đối tác
 *     tags: [Partners]
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: string
 *           enum: ['true', 'false']
 *         description: Lọc theo trạng thái hiển thị
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', partnerController.getAll);

/**
 * @swagger
 * /partners/{id}:
 *   get:
 *     summary: Lấy chi tiết đối tác
 *     tags: [Partners]
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
router.get('/:id', partnerController.getOne);

/**
 * @swagger
 * /partners:
 *   post:
 *     summary: Tạo đối tác mới
 *     tags: [Partners]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *               website:
 *                 type: string
 *               country:
 *                 type: string
 *               description:
 *                 type: string
 *               sortOrder:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', authMiddleware, partnerController.create);

/**
 * @swagger
 * /partners/{id}:
 *   put:
 *     summary: Cập nhật đối tác
 *     tags: [Partners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', authMiddleware, partnerController.update);

/**
 * @swagger
 * /partners/{id}:
 *   delete:
 *     summary: Xoá đối tác
 *     tags: [Partners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xoá thành công
 */
router.delete('/:id', authMiddleware, partnerController.remove);

/**
 * @swagger
 * /partners/{id}/toggle:
 *   patch:
 *     summary: Bật/tắt hiển thị đối tác
 *     tags: [Partners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Toggle thành công
 */
router.patch('/:id/toggle', authMiddleware, partnerController.toggleActive);

module.exports = router;
