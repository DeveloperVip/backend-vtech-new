const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Partner = sequelize.define(
  'Partner',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Tên đối tác (vd: Bosch – Đức)',
    },
    logoUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL logo đối tác (Cloudinary hoặc local)',
    },
    website: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Website đối tác',
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Quốc gia đối tác',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Mô tả ngắn về đối tác',
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Thứ tự hiển thị (nhỏ hơn = ưu tiên)',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Hiển thị trên trang chính hay không',
    },
  },
  {
    tableName: 'partners',
    timestamps: true,
    underscored: true,
  },
);

module.exports = Partner;
