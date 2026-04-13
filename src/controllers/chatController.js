const { ChatRoom, ChatMessage, AdminUser } = require('../models');
const { StatusCodes } = require('http-status-codes');

// Get all rooms (Admin only)
const getAllRooms = async (req, res, next) => {
  try {
    const { status, type, q } = req.query;
    const { Op } = require('sequelize');
    const where = {};
    
    if (status) where.status = status;
    if (type) where.userType = type;
    if (q) {
      where[Op.or] = [
        { userName: { [Op.like]: `%${q}%` } },
        { userEmail: { [Op.like]: `%${q}%` } }
      ];
    }

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
    const { limit = 100, q } = req.query;
    const { Op } = require('sequelize');
    const where = { roomId: req.params.roomId };

    if (q) {
      where.message = { [Op.like]: `%${q}%` };
    }

    const messages = await ChatMessage.findAll({
      where,
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

// Update room metadata (priority, status, adminId)
const updateRoomMeta = async (req, res, next) => {
  try {
    const { priority, status, adminId } = req.body;
    const room = await ChatRoom.findByPk(req.params.id);

    if (!room) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Room not found' });
    }

    if (priority !== undefined) room.priority = priority;
    if (status !== undefined) room.status = status;
    if (adminId !== undefined) room.adminId = adminId;

    await room.save();

    res.json({ success: true, data: room });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  getMessages,
  getUnreadCount,
  updateRoomMeta,
};
