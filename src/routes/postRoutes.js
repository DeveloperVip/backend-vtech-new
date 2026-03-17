const { Router } = require('express');
const postController = require('../controllers/postController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Lấy danh sách bài viết
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: nextjs
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', postController.getAll);
/**
 * @swagger
 * /posts/slug/{slug}:
 *   get:
 *     summary: Lấy bài viết theo slug
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: hoc-nextjs-co-ban
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/slug/:slug', postController.getBySlug);
/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Lấy bài viết theo ID
 *     tags: [Posts]
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
router.get('/:id', postController.getById);
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Tạo bài viết
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Học Next.js cơ bản
 *               slug:
 *                 type: string
 *                 example: hoc-nextjs-co-ban
 *               content:
 *                 type: string
 *                 example: Nội dung bài viết...
 *               thumbnail:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               isPublished:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', authMiddleware, postController.create);
/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Cập nhật bài viết
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
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
 *               title:
 *                 type: string
 *                 example: Bài viết mới
 *               slug:
 *                 type: string
 *                 example: bai-viet-moi
 *               content:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *               isPublished:
 *                 type: boolean
 *               categoryId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', authMiddleware, postController.update);
/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Xóa bài viết
 *     tags: [Posts]
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
 *         description: Xóa thành công
 */
router.delete('/:id', authMiddleware, postController.remove);

module.exports = router;
