const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ProductReview = sequelize.define(
    'ProductReview',
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

        productId: DataTypes.INTEGER.UNSIGNED,

        userName: DataTypes.STRING(255),
        email: DataTypes.STRING(255),
        rating: DataTypes.INTEGER,
        content: DataTypes.TEXT,

        likeCount: { type: DataTypes.INTEGER, defaultValue: 0 },
        hasImages: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
        tableName: 'product_reviews',
        timestamps: true,
        indexes: [
            { fields: ['productId'] },
            { fields: ['rating'] },
        ],
    },
);

module.exports = ProductReview;