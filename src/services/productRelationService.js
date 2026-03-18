const { ProductRelation, Product } = require('../models');

class ProductRelationService {
  async getAllByProductId(productId, query) {
    const { type } = query;
    const product = await Product.findByPk(productId, {
      include: [
        {
          model: Product,
          as: 'RelatedProducts',
          attributes: ['id', 'name', 'slug', 'price', 'thumbnail', 'isActive'],
          through: {
            model: ProductRelation,
            where: type ? { type } : undefined
          }
        }
      ]
    });
    return product ? product.RelatedProducts : [];
  }

  async create(data) {
    if (data.productId === data.relatedProductId) {
      throw new Error('Không thể thêm chính sản phẩm này làm sản phẩm liên quan');
    }

    const exists = await ProductRelation.findOne({
      where: {
        productId: data.productId,
        relatedProductId: data.relatedProductId,
        type: data.type
      }
    });

    if (exists) throw new Error('Sản phẩm liên quan này đã tồn tại');

    return await ProductRelation.create(data);
  }

  async delete(id) {
    const relation = await ProductRelation.findByPk(id);
    if (!relation) throw new Error('Không tìm thấy liên kết sản phẩm');
    await relation.destroy();
    return true;
  }
}

module.exports = new ProductRelationService();
