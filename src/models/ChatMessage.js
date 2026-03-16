const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ChatMessage = sequelize.define(
  'ChatMessage',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    roomId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    senderType: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      comment: 'Người gửi: user hoặc admin',
    },
    senderId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'userId hoặc adminId',
    },
    senderName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'chat_messages',
    timestamps: true,
    indexes: [
      { fields: ['roomId'] },
      { fields: ['senderType'] },
      { fields: ['isRead'] },
    ],
  },
);

module.exports = ChatMessage;
