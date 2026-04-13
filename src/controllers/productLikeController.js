const productLikeService = require('../services/productLikeService');

class ProductLikeController {
  toggleLike = async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.user.id; // Lấy từ authMiddleware
      
      const result = await productLikeService.toggleLike(productId, userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  checkUserLiked = async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.user?.id;
      
      const isLiked = await productLikeService.checkUserLiked(productId, userId);
      res.status(200).json({ success: true, data: { isLiked } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getLikedProducts = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;
      
      const result = await productLikeService.getLikedProducts(userId, { page, limit });
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new ProductLikeController();
