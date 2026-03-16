const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Product = sequelize.define(
  'Product',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    slug: { type: DataTypes.STRING(270), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    content: { type: DataTypes.TEXT('long'), allowNull: true },
    price: { type: DataTypes.DECIMAL(15, 0), allowNull: true },
    priceType: {
      type: DataTypes.ENUM('fixed', 'contact'),
      defaultValue: 'contact',
      comment: 'fixed = giá cố định, contact = liên hệ',
    },
    thumbnail: { type: DataTypes.STRING(500), allowNull: true },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Mảng URL ảnh',
    },
    categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    metaTitle: { type: DataTypes.STRING(255), allowNull: true },
    metaDescription: { type: DataTypes.STRING(500), allowNull: true },
  },
  {
    tableName: 'products',
    timestamps: true,
    indexes: [
      { fields: ['slug'] },
      { fields: ['categoryId'] },
      { fields: ['isFeatured'] },
      { fields: ['isActive'] },
    ],
  },
);

module.exports = Product;
