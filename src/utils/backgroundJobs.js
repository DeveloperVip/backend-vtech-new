const { ProductModel3D } = require('../models');
const product3DService = require('../services/product3DService');
// const logger = require('./logger'); // Assuming logger exists based on common project structures

/**
 * Simple background job to sync pending 3D generation tasks
 */
const start3DSyncJob = () => {
    // Run every 2 minutes
    setInterval(async () => {
        try {
            const pendingTasks = await ProductModel3D.findAll({
                where: {
                    conversionStatus: ['pending', 'processing']
                }
            });

            if (pendingTasks.length > 0) {
                console.log(`[Job] Syncing ${pendingTasks.length} pending 3D tasks...`);
                for (const task of pendingTasks) {
                    try {
                        await product3DService.syncStatus(task.id);
                    } catch (err) {
                        console.error(`[Job] Error syncing task for model ${task.id}:`, err.message);
                    }
                }
            }
        } catch (err) {
            console.error('[Job] Error in 3D sync job:', err.message);
        }
    }, 2 * 60 * 1000); 
};

/**
 * Cleanup job to remove orphaned 3D models older than 24 hours
 */
const startOrphanCleanupJob = () => {
    // Run every 12 hours
    setInterval(async () => {
        try {
            const { Op } = require('sequelize');
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            
            const orphans = await ProductModel3D.findAll({
                where: {
                    productId: null,
                    createdAt: { [Op.lt]: twentyFourHoursAgo }
                }
            });

            if (orphans.length > 0) {
                console.log(`[Job] Cleaning up ${orphans.length} orphaned 3D models...`);
                for (const orphan of orphans) {
                    // Xóa file vật lý nếu có
                    if (orphan.modelUrl) {
                        const fs = require('fs');
                        const path = require('path');
                        const fullPath = path.join(process.cwd(), orphan.modelUrl);
                        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
                    }
                    await orphan.destroy();
                }
            }
        } catch (err) {
            console.error('[Job] Error in Orphan Cleanup job:', err.message);
        }
    }, 12 * 60 * 60 * 1000);
};

module.exports = { start3DSyncJob, startOrphanCleanupJob };
