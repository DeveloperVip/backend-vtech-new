const productImageService = require('../services/productImageService');

class ProductImageController {
  getAllByProductId = async (req, res) => {
    try {
      const { productId } = req.params;
      const result = await productImageService.getAllByProductId(productId, req.query);
      res.status(200).json({ success: true, data: result.data, pagination: { total: result.total, page: result.page, totalPages: result.totalPages } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  create = async (req, res) => {
    try {
      const { productId } = req.params;
      const data = { ...req.body, productId };
      const image = await productImageService.create(data);
      res.status(201).json({ success: true, data: image });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const image = await productImageService.update(id, req.body);
      res.status(200).json({ success: true, data: image });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      await productImageService.delete(id);
      res.status(200).json({ success: true, message: 'Xóa ảnh thành công' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}

module.exports = new ProductImageController();
