const { Router } = require('express');
const productController = require('../controllers/productController');
const product3DController = require('../controllers/product3DController');
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


/**
 * @swagger
 * /products/{id}/generate-3d:
 *   post:
 *     summary: Tạo mô hình 3D (.glb) từ ảnh sản phẩm
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 description: URL ảnh cụ thể để tạo 3D (nếu để trống sẽ dùng ảnh đầu tiên của sản phẩm)
 *     responses:
 *       202:
 *         description: Đã nhận yêu cầu, đang xử lý ngầm
 */
router.post('/:id/generate-3d', authMiddleware, product3DController.generate3D);

/**
 * @swagger
 * /products/3d-preview:
 *   post:
 *     summary: Tạo mô hình 3D preview (chưa gán sản phẩm)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [imageUrl]
 *             properties:
 *               imageUrl:
 *                 type: string
 *     responses:
 *       202:
 *         description: Đã nhận yêu cầu
 */
router.post('/3d-preview', authMiddleware, product3DController.generatePreview);

/**
 * @swagger
 * /products/3d-status/{modelId}:
 *   get:
 *     summary: Kiểm tra trạng thái task tạo 3D (poll endpoint)
 *     description: |
 *       Gọi endpoint này định kỳ để kiểm tra tiến trình tạo 3D.
 *       - modelId là ID của ProductModel3D record (trả về từ generate-3d hoặc 3d-preview)
 *       - Status: pending → processing → succeeded | failed
 *       - Khi succeeded: modelUrl chứa URL file GLB có màu
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: modelId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của ProductModel3D record (không phải productId)
 *     responses:
 *       200:
 *         description: Trạng thái hiện tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     modelId:
 *                       type: integer
 *                     productId:
 *                       type: integer
 *                       nullable: true
 *                     status:
 *                       type: string
 *                       enum: [pending, processing, succeeded, failed]
 *                     modelUrl:
 *                       type: string
 *                       nullable: true
 *                       description: URL file GLB khi succeeded
 *                     errorMessage:
 *                       type: string
 *                       nullable: true
 */
/**
 * @swagger
 * /products/{id}/3d-status:
 *   get:
 *     summary: Kiểm tra trạng thái và lấy kết quả tạo mô hình 3D
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sản phẩm hoặc ID task 3D
 */
router.get('/:id/3d-status', product3DController.getStatus);

/**
 * POST /api/v1/products/3d-status/save-views
 * Lưu tạm các ảnh hướng 3D
 */
router.post('/3d-status/save-views', authMiddleware, product3DController.saveSourceViews);

router.post('/:id/3d-retry', authMiddleware, product3DController.retryGeneration);

module.exports = router;
