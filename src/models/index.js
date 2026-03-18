const sequelize = require('../config/sequelize');
const Contact = require('./Contact');
const AdminUser = require('./AdminUser');
const Category = require('./Category');
const Product = require('./Product');
const Post = require('./Post');
const ChatRoom = require('./ChatRoom');
const ChatMessage = require('./ChatMessage');
const ProductImage = require('./ProductImage');
const ProductReview = require('./ProductReview');
const ProductReviewImage = require('./ProductReviewImage');
const ProductAdditionalInfo = require('./ProductAdditionalInfo');
const ProductLike = require('./ProductLike');
const ProductModel3D = require('./ProductModel3D');
const ProductAttribute = require('./ProductAttribute');
const ProductRelation = require('./ProductRelation');

// Associations
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Chat associations
ChatRoom.hasMany(ChatMessage, { foreignKey: 'roomId', as: 'messages' });
ChatMessage.belongsTo(ChatRoom, { foreignKey: 'roomId', as: 'room' });

ChatRoom.belongsTo(AdminUser, { foreignKey: 'adminId', as: 'admin' });
AdminUser.hasMany(ChatRoom, { foreignKey: 'adminId', as: 'chatRooms' });

// 🔹 Product - Image (1 - n)
Product.hasMany(ProductImage, {
  foreignKey: 'productId',
});
ProductImage.belongsTo(Product, {
  foreignKey: 'productId',
});


// 🔹 Product - 3D Model (1 - 1)
Product.hasOne(ProductModel3D, {
  foreignKey: 'productId',
});
ProductModel3D.belongsTo(Product, {
  foreignKey: 'productId',
});


// 🔹 Product - Review (1 - n)
Product.hasMany(ProductReview, {
  foreignKey: 'productId',
});
ProductReview.belongsTo(Product, {
  foreignKey: 'productId',
});


// 🔹 Review - ReviewImage (1 - n)
ProductReview.hasMany(ProductReviewImage, {
  foreignKey: 'reviewId',
});
ProductReviewImage.belongsTo(ProductReview, {
  foreignKey: 'reviewId',
});


// 🔹 Product - Attribute (1 - n)
Product.hasMany(ProductAttribute, {
  foreignKey: 'productId',
});
ProductAttribute.belongsTo(Product, {
  foreignKey: 'productId',
});


// 🔹 Product - Additional Info (1 - n) 🔥
Product.hasMany(ProductAdditionalInfo, {
  foreignKey: 'productId',
});
ProductAdditionalInfo.belongsTo(Product, {
  foreignKey: 'productId',
});


// 🔹 Product - Related Products (n - n)
Product.belongsToMany(Product, {
  as: 'RelatedProducts',
  through: ProductRelation,
  foreignKey: 'productId',
  otherKey: 'relatedProductId',
});


// 🔹 Product - Like (1 - n)
Product.hasMany(ProductLike, {
  foreignKey: 'productId',
});
ProductLike.belongsTo(Product, {
  foreignKey: 'productId',
});

const db = {
  sequelize,
  Contact,
  AdminUser,
  Category,
  Product,
  Post,
  ChatRoom,
  ChatMessage,
  ProductImage,
  ProductReview,
  ProductModel3D,
  ProductReviewImage,
  ProductAdditionalInfo,
  ProductLike,
  ProductAttribute,
};

module.exports = db;
