const productRelationService = require('../services/productRelationService');

class ProductRelationController {
  getAllByProductId = async (req, res) => {
    try {
      const { productId } = req.params;
      const result = await productRelationService.getAllByProductId(productId, req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  create = async (req, res) => {
    try {
      const { productId } = req.params;
      const data = { ...req.body, productId };
      const relation = await productRelationService.create(data);
      res.status(201).json({ success: true, data: relation });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      await productRelationService.delete(id);
      res.status(200).json({ success: true, message: 'Xóa liên kết sản phẩm thành công' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}

module.exports = new ProductRelationController();
