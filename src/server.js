require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { sequelize } = require('./models');
const logger = require('./config/logger');
const authService = require('./services/authService');
const socketService = require('./services/socketService');
const { runSeeder } = require('./data/seeder');
const { start3DSyncJob, startOrphanCleanupJob } = require('./utils/backgroundJobs');

const PORT = parseInt(process.env.PORT, 10) || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connection established successfully.');

    // Kiểm tra xem có cần đồng bộ database không (Mặc định ở dev hoặc khi DB_SYNC=true)
    const SHOULD_SYNC = process.env.NODE_ENV === 'development' || process.env.DB_SYNC === 'true';

    if (SHOULD_SYNC) {
      try {
        await sequelize.sync();
        logger.info('✅ Database models synchronized.');

        // Chạy Auto-Seeder (Nếu DB_SYNC=true và SEED_DB=true hoặc khi ở dev và DB trống)
        const SHOULD_SEED = process.env.SEED_DB === 'true';
        await runSeeder(SHOULD_SEED);

        // Tạo tài khoản admin mặc định nếu chưa có
        try {
          await authService.createAdmin({
            name: 'Super Admin',
            email: process.env.TK_ADMIN,
            password: process.env.MK_ADMIN,
            role: 'superadmin',
          });
        } catch {
          // Đã tồn tại - bỏ qua
        }
      } catch (error) {
        logger.error('❌ Database Initialization Error:', error);
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ FULL ERROR:', error);
          throw error;
        }
      }
    }

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize Socket.IO
    const io = new Server(server, {
      cors: {
        origin: (process.env.CLIENT_URL || 'http://localhost:3000').split(','),
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    // Initialize socket service
    socketService.initialize(io);
    logger.info('✅ Socket.IO initialized');

    server.listen(PORT, () => {
      logger.info(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
      logger.info(`📡 API: http://localhost:${PORT}${process.env.API_PREFIX || '/api/v1'}`);
      logger.info(`💬 WebSocket: ws://localhost:${PORT}`);

      // Khởi động các job đồng bộ 3D và dọn dẹp ngầm
      start3DSyncJob();
      startOrphanCleanupJob();
    });
  } catch (error) {
    logger.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Closing database connection...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Closing database connection...');
  await sequelize.close();
  process.exit(0);
});

startServer();
