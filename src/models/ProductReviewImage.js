const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ProductReviewImage = sequelize.define(
    'ProductReviewImage',
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

        reviewId: DataTypes.INTEGER.UNSIGNED,

        url: DataTypes.STRING(500),

        width: DataTypes.INTEGER,
        height: DataTypes.INTEGER,
    },
    {
        tableName: 'product_review_images',
        timestamps: true,
        indexes: [{ fields: ['reviewId'] }],
    },
);

module.exports = ProductReviewImage;