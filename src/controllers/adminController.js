const { 
    Product, 
    Category, 
    Post, 
    Contact, 
    User, 
    ChatRoom, 
    ProductLike, 
    ProductModel3D 
} = require('../models');
const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');

/**
 * GET /api/v1/admin/stats
 * Tổng hợp toàn bộ số liệu cho Dashboard
 */
const getStats = async (req, res, next) => {
    try {
        const [
            totalProducts,
            totalCategories,
            totalPosts,
            totalContacts,
            unreadContacts,
            totalUsers,
            totalLikes,
            waitingChats,
            aiStats,
            recentTasks
        ] = await Promise.all([
            Product.count(),
            Category.count(),
            Post.count(),
            Contact.count(),
            Contact.count({ where: { status: 'pending' } }),
            User.count(),
            ProductLike.count(),
            ChatRoom.count({ where: { status: 'waiting' } }),
            
            // Thống kê trạng thái AI
            ProductModel3D.findAll({
                attributes: [
                    'conversionStatus',
                    [Product.sequelize.fn('COUNT', Product.sequelize.col('id')), 'count']
                ],
                group: ['conversionStatus'],
                raw: true
            }),

            // Lấy 5 task AI gần nhất
            ProductModel3D.findAll({
                limit: 5,
                order: [['updatedAt', 'DESC']],
                include: [{
                    model: Product,
                    attributes: ['id', 'name', 'thumbnail']
                }]
            })
        ]);

        // Format lại aiStats từ array sang object { status: count }
        const formattedAIStats = {
            none: 0,
            pending: 0,
            processing: 0,
            succeeded: 0,
            failed: 0
        };
        aiStats.forEach(item => {
            if (formattedAIStats[item.conversionStatus] !== undefined) {
                formattedAIStats[item.conversionStatus] = item.count;
            }
        });

        return res.json({
            success: true,
            data: {
                counts: {
                    products: totalProducts,
                    categories: totalCategories,
                    posts: totalPosts,
                    contacts: totalContacts,
                    unreadContacts,
                    users: totalUsers,
                    likes: totalLikes,
                    waitingChats
                },
                aiStats: formattedAIStats,
                recentTasks: recentTasks.map(task => ({
                    id: task.id,
                    productId: task.productId,
                    productName: task.Product?.name || 'Preview Task',
                    thumbnail: task.Product?.thumbnail || null,
                    status: task.conversionStatus,
                    updatedAt: task.updatedAt
                }))
            }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getStats
};
