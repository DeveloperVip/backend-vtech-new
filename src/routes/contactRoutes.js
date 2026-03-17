const { Router } = require('express');
const contactController = require('../controllers/contactController');
const { validate } = require('../middlewares/validateMiddleware');
const { formSubmitLimiter } = require('../middlewares/rateLimiter');
const {
  createContactSchema,
  updateContactStatusSchema,
} = require('../validations/contactValidation');

const router = Router();

/**
 * Public routes
 */
// POST /api/v1/contacts  – submit contact form
/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Gửi form liên hệ
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, message]
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               subject:
 *                 type: string
 *                 example: Hỏi về sản phẩm
 *               message:
 *                 type: string
 *                 example: Tôi muốn hỏi thêm thông tin...
 *     responses:
 *       201:
 *         description: Gửi thành công
 */
router.post(
  '/',
  formSubmitLimiter,
  validate(createContactSchema),
  contactController.submitContact,
);

/**
 * Admin / internal routes
 * (add auth middleware here when ready)
 */
// GET /api/v1/contacts
/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Lấy danh sách contact (admin)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
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
 *         name: status
 *         schema:
 *           type: string
 *         example: pending
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: hung
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', contactController.getContacts);

// GET /api/v1/contacts/:id
/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Lấy chi tiết contact
 *     tags: [Contacts]
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
router.get('/:id', contactController.getContact);

// PATCH /api/v1/contacts/:id/status
/**
 * @swagger
 * /contacts/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái contact
 *     tags: [Contacts]
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, resolved, rejected]
 *                 example: resolved
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch(
  '/:id/status',
  validate(updateContactStatusSchema),
  contactController.updateStatus,
);

// DELETE /api/v1/contacts/:id
/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Xóa contact
 *     tags: [Contacts]
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
router.delete('/:id', contactController.deleteContact);

module.exports = router;
