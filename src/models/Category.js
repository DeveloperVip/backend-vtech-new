const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Category = sequelize.define(
  'Category',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    slug: { type: DataTypes.STRING(160), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    thumbnail: { type: DataTypes.STRING(500), allowNull: true },
    parentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    metaTitle: DataTypes.STRING(255),
    metaDescription: DataTypes.STRING(500),
  },
  {
    tableName: 'categories',
    timestamps: true,
    indexes: [{ fields: ['slug'] }, { fields: ['parentId'] }],
  },
);

// Self-referential association (danh mục cha - con)
Category.hasMany(Category, { foreignKey: 'parentId', as: 'children' });
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });

module.exports = Category;
