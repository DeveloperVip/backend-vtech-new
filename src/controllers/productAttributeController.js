const productAttributeService = require('../services/productAttributeService');

class ProductAttributeController {
  getAllByProductId = async (req, res) => {
    try {
      const { productId } = req.params;
      const result = await productAttributeService.getAllByProductId(productId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  create = async (req, res) => {
    try {
      const { productId } = req.params;
      const data = { ...req.body, productId };
      const attribute = await productAttributeService.create(data);
      res.status(201).json({ success: true, data: attribute });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const attribute = await productAttributeService.update(id, req.body);
      res.status(200).json({ success: true, data: attribute });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      await productAttributeService.delete(id);
      res.status(200).json({ success: true, message: 'Xóa thuộc tính thành công' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}

module.exports = new ProductAttributeController();
