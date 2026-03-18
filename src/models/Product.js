const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Product = sequelize.define(
  'Product',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

    name: { type: DataTypes.STRING(255), allowNull: false },
    slug: { type: DataTypes.STRING(270), allowNull: false, unique: true },

    description: DataTypes.TEXT,
    content: DataTypes.TEXT('long'),

    price: DataTypes.DECIMAL(15, 0),
    priceType: {
      type: DataTypes.ENUM('fixed', 'contact'),
      defaultValue: 'contact',
    },

    thumbnail: DataTypes.STRING(500),

    categoryId: DataTypes.INTEGER.UNSIGNED,

    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    viewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    soldCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    likeCount: { type: DataTypes.INTEGER, defaultValue: 0 },

    ratingAvg: { type: DataTypes.FLOAT, defaultValue: 0 },
    ratingCount: { type: DataTypes.INTEGER, defaultValue: 0 },

    isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },

    metaTitle: DataTypes.STRING(255),
    metaDescription: DataTypes.STRING(500),
  },
  {
    tableName: 'products',
    timestamps: true,
    indexes: [
      { fields: ['slug'] },
      { fields: ['categoryId'] },
      { fields: ['isActive'] },
      { fields: ['isFeatured'] },
      { fields: ['price'] },
    ],
  },
);

module.exports = Product;