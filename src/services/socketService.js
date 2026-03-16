const { ChatRoom, ChatMessage, AdminUser } = require('../models');
const logger = require('../config/logger');

class SocketService {
  constructor() {
    this.io = null;
    this.onlineUsers = new Map(); // userId -> socketId
    this.onlineAdmins = new Map(); // adminId -> socketId
  }

  initialize(io) {
    this.io = io;

    io.on('connection', (socket) => {
      logger.info(`Socket connected: ${socket.id}`);

      // ─── User Join Chat ─────────────────────────────────────────
      socket.on('user:join', async (data) => {
        try {
          const { userId, userName, userEmail } = data;
          this.onlineUsers.set(userId, socket.id);
          socket.userId = userId;
          socket.userType = 'user';

          // Tìm hoặc tạo room
          let room = await ChatRoom.findOne({ where: { userId, status: ['waiting', 'active'] } });
          
          if (!room) {
            room = await ChatRoom.create({
              userId,
              userName,
              userEmail,
              status: 'waiting',
            });
          }

          socket.join(`room-${room.id}`);
          socket.roomId = room.id;

          // Load lịch sử chat
          const messages = await ChatMessage.findAll({
            where: { roomId: room.id },
            order: [['createdAt', 'ASC']],
            limit: 100,
          });

          socket.emit('room:joined', { roomId: room.id, messages });

          // Notify admins về user mới
          io.emit('admin:new-user-waiting', {
            roomId: room.id,
            userId,
            userName,
            status: room.status,
          });

          logger.info(`User ${userId} joined room ${room.id}`);
        } catch (error) {
          logger.error('user:join error:', error);
          socket.emit('error', { message: 'Failed to join chat' });
        }
      });

      // ─── Admin Join ────────────────────────────────────────────
      socket.on('admin:join', async (data) => {
        try {
          const { adminId, adminName } = data;
          this.onlineAdmins.set(adminId, socket.id);
          socket.adminId = adminId;
          socket.userType = 'admin';
          socket.join('admin-room');

          logger.info(`Admin ${adminId} joined`);

          // Load danh sách rooms
          const rooms = await ChatRoom.findAll({
            where: { status: ['waiting', 'active'] },
            include: [{ model: AdminUser, as: 'admin', attributes: ['id', 'name'] }],
            order: [['lastMessageAt', 'DESC']],
          });

          socket.emit('admin:rooms-list', rooms);
        } catch (error) {
          logger.error('admin:join error:', error);
        }
      });

      // ─── Admin Pick Room ───────────────────────────────────────
      socket.on('admin:pick-room', async (data) => {
        try {
          const { roomId, adminId, adminName } = data;
          
          const room = await ChatRoom.findByPk(roomId);
          if (!room) {
            socket.emit('error', { message: 'Room not found' });
            return;
          }

          await room.update({ adminId, status: 'active' });
          socket.join(`room-${roomId}`);
          socket.roomId = roomId;

          // Notify user
          io.to(`room-${roomId}`).emit('admin:joined', {
            adminId,
            adminName,
            message: `${adminName} đã tham gia hỗ trợ bạn`,
          });

          logger.info(`Admin ${adminId} picked room ${roomId}`);
        } catch (error) {
          logger.error('admin:pick-room error:', error);
        }
      });

      // ─── Send Message ──────────────────────────────────────────
      socket.on('message:send', async (data) => {
        try {
          const { roomId, message, senderType, senderId, senderName } = data;

          const chatMessage = await ChatMessage.create({
            roomId,
            senderType,
            senderId,
            senderName,
            message,
            isRead: false,
          });

          // Update room lastMessageAt
          await ChatRoom.update({ lastMessageAt: new Date() }, { where: { id: roomId } });

          // Broadcast to room
          io.to(`room-${roomId}`).emit('message:received', {
            id: chatMessage.id,
            roomId,
            senderType,
            senderId,
            senderName,
            message,
            createdAt: chatMessage.createdAt,
          });

          // Notify other admins if sender is user
          if (senderType === 'user') {
            io.to('admin-room').emit('admin:new-message', {
              roomId,
              message: message.substring(0, 50),
            });
          }

          logger.info(`Message sent in room ${roomId} by ${senderType}`);
        } catch (error) {
          logger.error('message:send error:', error);
        }
      });

      // ─── Mark as Read ──────────────────────────────────────────
      socket.on('message:mark-read', async (data) => {
        try {
          const { roomId, userType } = data;
          
          await ChatMessage.update(
            { isRead: true },
            { 
              where: { 
                roomId, 
                senderType: userType === 'admin' ? 'user' : 'admin',
                isRead: false 
              } 
            }
          );

          logger.info(`Messages marked as read in room ${roomId}`);
        } catch (error) {
          logger.error('message:mark-read error:', error);
        }
      });

      // ─── Close Room ────────────────────────────────────────────
      socket.on('admin:close-room', async (data) => {
        try {
          const { roomId } = data;
          
          await ChatRoom.update({ status: 'closed' }, { where: { id: roomId } });

          io.to(`room-${roomId}`).emit('room:closed', {
            message: 'Cuộc trò chuyện đã kết thúc. Cảm ơn bạn!',
          });

          logger.info(`Room ${roomId} closed`);
        } catch (error) {
          logger.error('admin:close-room error:', error);
        }
      });

      // ─── Disconnect ────────────────────────────────────────────
      socket.on('disconnect', () => {
        if (socket.userType === 'user' && socket.userId) {
          this.onlineUsers.delete(socket.userId);
        } else if (socket.userType === 'admin' && socket.adminId) {
          this.onlineAdmins.delete(socket.adminId);
        }
        logger.info(`Socket disconnected: ${socket.id}`);
      });
    });
  }

  // Helper methods
  getUserSocket(userId) {
    const socketId = this.onlineUsers.get(userId);
    return socketId ? this.io.sockets.sockets.get(socketId) : null;
  }

  getAdminSocket(adminId) {
    const socketId = this.onlineAdmins.get(adminId);
    return socketId ? this.io.sockets.sockets.get(socketId) : null;
  }
}

module.exports = new SocketService();
