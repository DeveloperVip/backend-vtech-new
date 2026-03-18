const productAdditionalInfoService = require('../services/productAdditionalInfoService');

class ProductAdditionalInfoController {
  getAllByProductId = async (req, res) => {
    try {
      const { productId } = req.params;
      const result = await productAdditionalInfoService.getAllByProductId(productId, req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  create = async (req, res) => {
    try {
      const { productId } = req.params;
      const data = { ...req.body, productId };
      const info = await productAdditionalInfoService.create(data);
      res.status(201).json({ success: true, data: info });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const info = await productAdditionalInfoService.update(id, req.body);
      res.status(200).json({ success: true, data: info });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      await productAdditionalInfoService.delete(id);
      res.status(200).json({ success: true, message: 'Xóa thông tin bổ sung thành công' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}

module.exports = new ProductAdditionalInfoController();
