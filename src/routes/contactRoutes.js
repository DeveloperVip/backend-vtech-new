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
router.get('/', contactController.getContacts);

// GET /api/v1/contacts/:id
router.get('/:id', contactController.getContact);

// PATCH /api/v1/contacts/:id/status
router.patch(
  '/:id/status',
  validate(updateContactStatusSchema),
  contactController.updateStatus,
);

// DELETE /api/v1/contacts/:id
router.delete('/:id', contactController.deleteContact);

module.exports = router;
