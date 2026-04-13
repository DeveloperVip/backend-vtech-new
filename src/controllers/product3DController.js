const product3DService = require('../services/product3DService');
const { StatusCodes } = require('http-status-codes');

/**
 * POST /api/v1/products/:id/generate-3d
 * Bắt đầu tạo 3D model từ ảnh sản phẩm (hỗ trợ 1 ảnh hoặc đa hướng)
 */
const generate3D = async (req, res, next) => {
    try {
        const { id } = req.params;             // productId
        const { imageUrl, views } = req.body;  // Hỗ trợ cả 2 định dạng

        const data = await product3DService.initiateGeneration(id, views || imageUrl || null);

        return res.status(StatusCodes.ACCEPTED).json({
            success: true,
            message: '3D generation task started.',
            data: {
                modelId: data.id,
                productId: data.productId,
                status: data.conversionStatus,
                estimatedTime: '2-5 minutes'
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/v1/products/3d-preview
 * Tạo 3D preview từ ảnh (không liên kết sản phẩm)
 */
const generatePreview = async (req, res, next) => {
    try {
        const { imageUrl, views } = req.body;
        if (!imageUrl && !views) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'imageUrl or views object is required'
            });
        }

        const data = await product3DService.initiateGeneration(null, views || imageUrl);

        return res.status(StatusCodes.ACCEPTED).json({
            success: true,
            message: '3D preview task started.',
            data: {
                modelId: data.id,
                status: data.conversionStatus,
                estimatedTime: '2-5 minutes'
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/v1/3d-status/:id
 * Kiểm tra trạng thái task tạo 3D (chỉ đọc DB, non-blocking)
 *
 * Response status values:
 *   'pending'    → Đang chờ trong queue
 *   'processing' → Đang tạo (3D generation đang chạy)
 *   'succeeded'  → Hoàn thành - modelUrl có giá trị
 *   'failed'     → Lỗi - xem errorMessage
 */
const getStatus = async (req, res, next) => {
    try {
        const { id } = req.params;   // modelId (ID của ProductModel3D record)
        const data = await product3DService.syncStatus(id);

        return res.json({
            success: true,
            data: {
                modelId: data.id,
                productId: data.productId,
                status: data.conversionStatus,
                modelUrl: data.modelUrl || null,
                format: data.format || null,
                errorMessage: data.errorMessage || null,
                updatedAt: data.updatedAt
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/v1/3d-status/:id/retry
 * Thử lại generation đã failed
 */
const retryGeneration = async (req, res, next) => {
    try {
        const { id } = req.params;   // modelId
        const data = await product3DService.retryGeneration(id);

        return res.status(StatusCodes.ACCEPTED).json({
            success: true,
            message: 'Retry started. Poll status endpoint to check progress.',
            data: {
                modelId: data.id,
                status: data.conversionStatus,
                estimatedTime: '3-8 minutes'
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/v1/products/3d-status/save-views
 * Chỉ lưu ảnh nguồn (sourceViews) để persistence
 */
const saveSourceViews = async (req, res, next) => {
    try {
        const { productId, views } = req.body;
        const data = await product3DService.initiateSourceViews(productId, views);
        return res.json({
            success: true,
            data: {
                modelId: data.id,
                productId: data.productId,
                sourceViews: data.sourceViews
            }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    generate3D,
    generatePreview,
    getStatus,
    retryGeneration,
    saveSourceViews
};
