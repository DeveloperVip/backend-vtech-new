const { ChatRoom, ChatMessage, AdminUser } = require('../models');
const { StatusCodes } = require('http-status-codes');

// Get all rooms (Admin only)
const getAllRooms = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const rooms = await ChatRoom.findAll({
      where,
      include: [
        { model: AdminUser, as: 'admin', attributes: ['id', 'name', 'email'] },
      ],
      order: [['lastMessageAt', 'DESC']],
    });

    res.json({ success: true, data: rooms });
  } catch (err) {
    next(err);
  }
};

// Get room by ID
const getRoomById = async (req, res, next) => {
  try {
    const room = await ChatRoom.findByPk(req.params.id, {
      include: [
        { model: AdminUser, as: 'admin', attributes: ['id', 'name'] },
      ],
    });

    if (!room) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Room not found' });
    }

    res.json({ success: true, data: room });
  } catch (err) {
    next(err);
  }
};

// Get messages by room
const getMessages = async (req, res, next) => {
  try {
    const { limit = 100 } = req.query;

    const messages = await ChatMessage.findAll({
      where: { roomId: req.params.roomId },
      order: [['createdAt', 'ASC']],
      limit: parseInt(limit),
    });

    res.json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
};

// Get unread count (Admin)
const getUnreadCount = async (req, res, next) => {
  try {
    const count = await ChatMessage.count({
      where: {
        senderType: 'user',
        isRead: false,
      },
    });

    res.json({ success: true, unreadCount: count });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  getMessages,
  getUnreadCount,
};
