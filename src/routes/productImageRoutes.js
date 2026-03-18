const { Router } = require('express');
const productImageController = require('../controllers/productImageController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();

/**
 * @swagger
 * /products/{productId}/images:
 *   get:
 *     summary: Lấy danh sách ảnh của sản phẩm
 *     tags: [Product Images]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [thumbnail, gallery, 360]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/products/:productId/images', productImageController.getAllByProductId);

/**
 * @swagger
 * /products/{productId}/images:
 *   post:
 *     summary: Thêm ảnh cho sản phẩm
 *     tags: [Product Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [url]
 *             properties:
 *               url:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [thumbnail, gallery, 360]
 *               width:
 *                 type: integer
 *               height:
 *                 type: integer
 *               sortOrder:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/products/:productId/images', authMiddleware, productImageController.create);

/**
 * /**
 * @swagger
 * /product-images/{id}:
 *   put:
 *     summary: Cập nhật thông tin ảnh
 *     tags: [Product Images]
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
 *               url:
 *                 type: string
 *                 example: "/images/product1.jpg"
 *               type:
 *                 type: string
 *                 example: "thumbnail"
 *               width:
 *                 type: integer
 *                 example: 575
 *               height:
 *                 type: integer
 *                 example: 400
 *               sortOrder:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cập nhật thông tin ảnh thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     url:
 *                       type: string
 *                       example: "/images/product1.jpg"
 *                     type:
 *                       type: string
 *                       example: "thumbnail"
 *                     width:
 *                       type: integer
 *                       example: 575
 *                     height:
 *                       type: integer
 *                       example: 400
 *                     sortOrder:
 *                       type: integer
 *                       example: 1
 *       404:
 *         description: Không tìm thấy ảnh
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy ảnh"
 */
router.put('/product-images/:id', authMiddleware, productImageController.update);

/**
 * @swagger
 * /product-images/{id}:
 *   delete:
 *     summary: Xóa ảnh
 *     tags: [Product Images]
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
router.delete('/product-images/:id', authMiddleware, productImageController.delete);

module.exports = router;
