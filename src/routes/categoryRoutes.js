const { Router } = require('express');
const categoryController = require('../controllers/categoryController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();
/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lấy danh sách category
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', categoryController.getAll);
/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Tạo category mới
 *     tags: [Categories]
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
 *                 example: Điện thoại
 *               slug:
 *                 type: string
 *                 example: dien-thoai
 *               description:
 *                 type: string
 *                 example: Danh mục điện thoại
 *               parentId:
 *                 type: integer
 *                 example: 1
 *               image:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', authMiddleware, categoryController.create);
/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Cập nhật category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Điện thoại
 *               slug:
 *                 type: string
 *                 example: dien-thoai
 *               description:
 *                 type: string
 *               parentId:
 *                 type: integer
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', authMiddleware, categoryController.update);
/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Xóa category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:id', authMiddleware, categoryController.remove);

module.exports = router;
