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
  logger.info(`Starting server in ${NODE_ENV} mode...`);
  console.log(`[Startup] ${new Date().toISOString()} - Node: ${process.version}`);

  try {
    logger.info('Attempting to connect to database...');
    console.log(`[DB] Host: ${process.env.DB_HOST}, Port: ${process.env.DB_PORT}, DB: ${process.env.DB_NAME}`);

    await sequelize.authenticate();
    logger.info('✅ Database connection established successfully.');

    // Database synchronization & Seeding
    const SHOULD_SYNC = process.env.DB_SYNC === 'true';

    if (SHOULD_SYNC) {
      try {
        logger.info('Synchronizing database models...');
        await sequelize.sync();
        logger.info('✅ Database models synchronized.');

        const SHOULD_SEED = process.env.SEED_DB === 'true';
        await runSeeder(SHOULD_SEED);

        try {
          await authService.createAdmin({
            name: 'Super Admin',
            email: process.env.TK_ADMIN,
            password: process.env.MK_ADMIN,
            role: 'superadmin',
          });
        } catch {
          // Already exists - skip
        }
      } catch (error) {
        logger.error('❌ Database Initialization Error:', error);
        console.error('❌ Database Initialization Error:', error);
      }
    }

    // Server initialization
    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: (process.env.CLIENT_URL || '*').split(','),
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    socketService.initialize(io);
    logger.info('✅ Socket.IO initialized');

    server.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      console.log(`🚀 Server ready at http://localhost:${PORT}`);

      start3DSyncJob();
      startOrphanCleanupJob();
    });
  } catch (error) {
    logger.error('❌ FATAL ERROR DURING STARTUP:', error);
    // Use fs.writeSync for immediate stderr output to bypass logging buffers
    const fs = require('fs');
    fs.writeSync(2, `❌ FATAL ERROR: ${error.stack || error.message}\n`);
    process.exit(1);
  }
};

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  logger.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

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
