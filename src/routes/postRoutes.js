const { Router } = require('express');
const postController = require('../controllers/postController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();

router.get('/', postController.getAll);
router.get('/slug/:slug', postController.getBySlug);
router.get('/:id', postController.getById);
router.post('/', authMiddleware, postController.create);
router.put('/:id', authMiddleware, postController.update);
router.delete('/:id', authMiddleware, postController.remove);

module.exports = router;
