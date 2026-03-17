const { Router } = require('express');
const productController = require('../controllers/productController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();

// Public
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lấy danh sách sản phẩm
 *     tags: [Products]
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
 *         example: iphone
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         example: 2
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         example: 1000000
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         example: 20000000
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         example: price_desc
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', productController.getAll);
/**
 * @swagger
 * /products/slug/{slug}:
 *   get:
 *     summary: Lấy sản phẩm theo slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: iphone-15-pro-max
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/slug/:slug', productController.getBySlug);

// Admin protected
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Lấy sản phẩm theo ID
 *     tags: [Products]
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
router.get('/:id', productController.getById);
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Tạo sản phẩm
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15 Pro Max
 *               slug:
 *                 type: string
 *                 example: iphone-15-pro-max
 *               description:
 *                 type: string
 *                 example: Sản phẩm cao cấp của Apple
 *               price:
 *                 type: number
 *                 example: 30000000
 *               discountPrice:
 *                 type: number
 *                 example: 28000000
 *               stock:
 *                 type: integer
 *                 example: 10
 *               thumbnail:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', authMiddleware, productController.create);
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Cập nhật sản phẩm
 *     tags: [Products]
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
 *               name:
 *                 type: string
 *                 example: Mô hình PLC Siemens S7-1200
 *               slug:
 *                 type: string
 *                 example: mo-hinh-plc-s7-1200
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               price:
 *                 type: number
 *                 example: 15000000
 *               priceType:
 *                 type: string
 *                 enum: [fixed, contact]
 *                 example: fixed
 *               thumbnail:
 *                 type: string
 *                 example: https://example.com/product.jpg
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - https://example.com/img1.jpg
 *                   - https://example.com/img2.jpg
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               isFeatured:
 *                 type: boolean
 *                 example: true
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               sortOrder:
 *                 type: integer
 *                 example: 1
 *               metaTitle:
 *                 type: string
 *               metaDescription:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', authMiddleware, productController.update);
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Xóa sản phẩm
 *     tags: [Products]
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
router.delete('/:id', authMiddleware, productController.remove);

module.exports = router;
