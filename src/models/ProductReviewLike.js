const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ProductReviewLike = sequelize.define(
    'ProductReviewLike',
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        reviewId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
        ipAddress: { type: DataTypes.STRING(45), allowNull: true },
    },
    {
        tableName: 'product_review_likes',
        timestamps: true,
        indexes: [
            { fields: ['reviewId'] },
            { fields: ['userId'] },
            { fields: ['ipAddress'] },
            { unique: true, fields: ['reviewId', 'userId'], where: { userId: { [require('sequelize').Op.ne]: null } } },
            // Note: Unique by IP if userId is null is harder in Sequelize define but we'll handle it in service
        ],
    },
);

module.exports = ProductReviewLike;
