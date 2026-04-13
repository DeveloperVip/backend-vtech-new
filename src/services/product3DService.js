const { ProductModel3D, ProductImage } = require('../models');
const ai3DService = require('./ai3DService');
const { AppError } = require('../middlewares/errorHandler');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const path = require('path');

/**
 * Product 3D Service
 * ──────────────────
 * Quản lý luồng tạo 3D từ ảnh sản phẩm.
 *
 * ARCHITECTURE: Non-blocking async
 *  - initiateGeneration() → tạo DB record (status: pending) → kick off background job → return ngay
 *  - _runGenerationBackground() → chạy nền, cập nhật DB khi xong
 *  - syncStatus() → chỉ đọc DB, không blocking (frontend poll endpoint này)
 */
class Product3DService {

    /**
     * Chỉ lưu ảnh nguồn (sourceViews) mà chưa kích hoạt generation.
     * Dùng để persistence khi user upload ảnh nhưng chưa bấm 'Generate'.
     */
    async initiateSourceViews(productId, views) {
        let model3D;
        if (productId) {
            model3D = await ProductModel3D.findOne({ where: { productId } });
        }

        if (!model3D) {
            model3D = await ProductModel3D.create({
                productId: productId || null,
                conversionStatus: 'none',
                sourceViews: views
            });
        } else {
            await model3D.update({ sourceViews: views });
        }
        return model3D;
    }

    /**
     * Bắt đầu quá trình tạo 3D (Hỗ trợ 1 ảnh hoặc Multi-view)
     * Non-blocking: trả về ngay sau khi khởi động background job.
     *
     * @param {number|null} productId - ID sản phẩm
     * @param {string|Object|null} input - URL ảnh duy nhất hoặc Object { front, back, [left], [right] }
     * @returns {Promise<ProductModel3D>}
     */
    async initiateGeneration(productId, input) {
        let views = {};

        // 1. Chuẩn hóa đầu vào
        if (typeof input === 'string') {
            views = { front: input };
        } else if (input && typeof input === 'object') {
            views = input;
        }

        // Nếu không có input, thử lấy ảnh đầu tiên của sản phẩm
        if (!views.front) {
            if (!productId) {
                throw new AppError('imageUrl or multiview object is required', StatusCodes.BAD_REQUEST);
            }
            const firstImage = await ProductImage.findOne({ where: { productId } });
            if (!firstImage) {
                throw new AppError('No product image found for 3D generation', StatusCodes.BAD_REQUEST);
            }
            views = { front: firstImage.url };
        }

        // 2. Tìm hoặc tạo record 3D
        let model3D;
        if (productId) {
            model3D = await ProductModel3D.findOne({ where: { productId } });
        }

        if (!model3D) {
            model3D = await ProductModel3D.create({
                productId: productId || null,
                conversionStatus: 'none'
            });
        }

        // Reset trạng thái để bắt đầu task mới
        await model3D.update({
            conversionStatus: 'pending',
            conversionTaskId: JSON.stringify(views), // Lưu để track task nội bộ
            sourceViews: views,                      // Lưu để persistence cho UI
            errorMessage: null,
            modelUrl: null
        });

        console.log(`[Product3DService] ✓ Task created for Model #${model3D.id}. Views:`, Object.keys(views));

        // 3. Chạy nền
        setImmediate(() => {
            this._runGenerationBackground(model3D.id, views)
                .catch(err => console.error(`[Product3DService] Background job crashed:`, err));
        });

        return model3D.reload();
    }

    /**
     * Background job: chạy pipeline tạo 3D
     */
    async _runGenerationBackground(modelId, views) {
        console.log(`[Product3DService] ══ Background job started for Model #${modelId} ══`);
        const startTime = Date.now();

        let model3D = await ProductModel3D.findByPk(modelId);
        if (!model3D) return;

        try {
            await model3D.update({ conversionStatus: 'processing' });

            // Bước 1: Gọi AI Service (Hỗ trợ đa ảnh)
            const glbHfUrl = await ai3DService.generateFull(views);

            // Bước 2: Tải về local
            const localFileName = `model_${modelId}_${Date.now()}.glb`;
            const localRelativePath = await ai3DService.downloadToLocal(glbHfUrl, localFileName);
            const publicUrl = `${process.env.API_URL || 'http://localhost:5000'}${localRelativePath}`;

            const elapsed = Math.round((Date.now() - startTime) / 1000);
            console.log(`[Product3DService] ✅ Model #${modelId} hoàn tất sau ${elapsed}s`);

            await model3D.update({
                modelUrl: publicUrl,
                format: 'glb',
                conversionStatus: 'succeeded',
                errorMessage: null
            });

        } catch (err) {
            const elapsed = Math.round((Date.now() - startTime) / 1000);
            console.error(`[Product3DService] ❌ Lỗi tại Model #${modelId} (${elapsed}s):`, err.message);

            await model3D.update({
                conversionStatus: 'failed',
                errorMessage: err.message.substring(0, 500)
            });
        }
    }

    /**
     * Đồng bộ trạng thái (Polling)
     */
    async syncStatus(id) {
        let model3D = await ProductModel3D.findByPk(id);
        if (!model3D) {
            model3D = await ProductModel3D.findOne({ where: { productId: id } });
        }

        if (!model3D) {
            throw new AppError(`3D task not found`, StatusCodes.NOT_FOUND);
        }

        // Tự phục hồi nếu task bị kẹt 'processing' quá 15 phút
        if (model3D.conversionStatus === 'processing') {
            const minutesElapsed = (Date.now() - new Date(model3D.updatedAt).getTime()) / 60000;
            if (minutesElapsed > 15) {
                await model3D.update({
                    conversionStatus: 'failed',
                    errorMessage: 'Generation timed out.'
                });
                return model3D.reload();
            }
        }

        return model3D;
    }

    /**
     * Retry
     */
    async retryGeneration(id) {
        const model3D = await this.syncStatus(id);
        if (!['failed', 'pending'].includes(model3D.conversionStatus)) {
            throw new AppError(`Status ${model3D.conversionStatus} cannot be retried`, StatusCodes.BAD_REQUEST);
        }

        let views;
        try {
            views = JSON.parse(model3D.conversionTaskId);
        } catch (e) {
            views = model3D.conversionTaskId; // Fallback nếu không phải JSON
        }

        return this.initiateGeneration(model3D.productId, views);
    }

    /**
     * Xóa file GLB local khi không cần nữa
     * @param {number} modelId
     */
    async cleanupLocalGLB(modelId) {
        const model3D = await ProductModel3D.findByPk(modelId);
        if (!model3D || !model3D.modelUrl) return;

        const filename = model3D.modelUrl.split('/').pop().split('?')[0];
        const filePath = path.join(process.cwd(), 'uploads', 'product-models', filename);

        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log(`[Product3DService] Cleaned up GLB: ${filename}`);
            } catch (err) {
                console.warn(`[Product3DService] Cannot delete GLB ${filename}:`, err.message);
            }
        }
    }
}

module.exports = new Product3DService();
