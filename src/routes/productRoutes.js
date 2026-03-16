const { Router } = require('express');
const productController = require('../controllers/productController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();

// Public
router.get('/', productController.getAll);
router.get('/slug/:slug', productController.getBySlug);

// Admin protected
router.get('/:id', productController.getById);
router.post('/', authMiddleware, productController.create);
router.put('/:id', authMiddleware, productController.update);
router.delete('/:id', authMiddleware, productController.remove);

module.exports = router;
