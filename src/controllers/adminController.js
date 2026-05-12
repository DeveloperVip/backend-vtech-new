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

/**
 * GET /api/v1/admin/users
 * Danh sách người dùng cho trang quản trị
 */
const getUsers = async (req, res, next) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
        const offset = (page - 1) * limit;

        const search = (req.query.search || '').trim();
        const status = (req.query.status || 'all').trim();

        const where = {};

        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { username: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } },
            ];
        }

        if (status === 'active') {
            where.isActive = true;
        } else if (status === 'inactive') {
            where.isActive = false;
        }

        const { count, rows } = await User.findAndCountAll({
            where,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['password'] },
        });

        return res.status(StatusCodes.OK).json({
            success: true,
            data: rows,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.max(Math.ceil(count / limit), 1),
            },
        });
    } catch (err) {
        next(err);
    }
};

/**
 * PATCH /api/v1/admin/users/:id/status
 * Bật/tắt trạng thái người dùng
 */
const toggleUserStatus = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Không tìm thấy người dùng',
            });
        }

        user.isActive = !user.isActive;
        await user.save();

        return res.status(StatusCodes.OK).json({
            success: true,
            message: user.isActive ? 'Đã kích hoạt người dùng' : 'Đã vô hiệu hóa người dùng',
            data: {
                id: user.id,
                isActive: user.isActive,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getStats,
    getUsers,
    toggleUserStatus,
};
