const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Post = sequelize.define(
  'Post',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    slug: { type: DataTypes.STRING(270), allowNull: false, unique: true },
    excerpt: { type: DataTypes.TEXT, allowNull: true },
    content: { type: DataTypes.TEXT('long'), allowNull: true },
    thumbnail: { type: DataTypes.STRING(500), allowNull: true },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: false },
    publishedAt: { type: DataTypes.DATE, allowNull: true },
    metaTitle: { type: DataTypes.STRING(255), allowNull: true },
    metaDescription: { type: DataTypes.STRING(500), allowNull: true },
  },
  {
    tableName: 'posts',
    timestamps: true,
    indexes: [{ fields: ['slug'] }, { fields: ['isPublished'] }],
  },
);

module.exports = Post;
