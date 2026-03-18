const productModel3dService = require('../services/productModel3dService');

class ProductModel3dController {
  getByProductId = async (req, res) => {
    try {
      const { productId } = req.params;
      const result = await productModel3dService.getByProductId(productId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  upsert = async (req, res) => {
    try {
      const { productId } = req.params;
      const model3d = await productModel3dService.upsert(productId, req.body);
      res.status(200).json({ success: true, data: model3d });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  delete = async (req, res) => {
    try {
      const { productId } = req.params;
      await productModel3dService.deleteByProductId(productId);
      res.status(200).json({ success: true, message: 'Xóa mô hình 3D thành công' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}

module.exports = new ProductModel3dController();
