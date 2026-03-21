const productReviewService = require('../services/productReviewService');

class ProductReviewController {
  getAllByProductId = async (req, res) => {
    try {
      const { productId } = req.params;
      const result = await productReviewService.getAllByProductId(productId, req.query);
      res.status(200).json({ success: true, data: result.data, pagination: { total: result.total, page: result.page, totalPages: result.totalPages } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  create = async (req, res) => {
    try {
      const { productId } = req.params;
      const data = { ...req.body, productId };
      const review = await productReviewService.create(data);
      res.status(201).json({ success: true, data: review });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const review = await productReviewService.update(id, req.body);
      res.status(200).json({ success: true, data: review });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      await productReviewService.delete(id);
      res.status(200).json({ success: true, message: 'Xóa đánh giá thành công' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  toggleLike = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      
      const result = await productReviewService.toggleLike(id, userId, ipAddress);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}

module.exports = new ProductReviewController();
