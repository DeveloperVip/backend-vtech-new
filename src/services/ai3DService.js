const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');
const { Client } = require("@gradio/client");
const sharp = require('sharp');

/**
 * AI 3D Service - Multi-view Support & Stability Refactor
 * ──────────────────────────────────────────────────────────────
 * Hệ thống sử dụng Hunyuan3D-2.1 với cơ chế fallback giữa nhiều Spaces
 * để đảm bảo tính ổn định và khả năng xử lý từ nhiều góc chụp.
 */
class AI3DService {
    constructor() {
        // Danh sách các Space ID ưu tiên để đảm bảo tính ổn định
        this.primarySpaces = [
            'Jbowyer/Hunyuan3D-2.1',
            'TencentARC/Hunyuan3D-2.1',
            'juniors90/Hunyuan3D-2.1'
        ];
        
        this.fallbackSpaces = [
            'chadarino/Hunyuan3D-2' // Hunyuan 2.0 (Stable fallback)
        ];

        this.hfToken = process.env.HF_TOKEN;
        console.log(`[AI3D] Initialized with priority spaces: ${this.primarySpaces.join(', ')}`);
    }

    /**
     * Chuẩn hoá đầu vào thành object { front, back?, left?, right? }
     * Chấp nhận: string URL | Array of URLs | Object { front, back, left, right }
     * => 1 ảnh: front only
     * => 2 ảnh: [front, back]  
     * => 3 ảnh: [front, left, right]
     * => 4 ảnh: [front, back, left, right]
     */
    _normalizeInput(input) {
        if (typeof input === 'string') {
            return { front: input };
        }
        if (Array.isArray(input)) {
            const keys = ['front', 'back', 'left', 'right'];
            const views = {};
            input.forEach((url, i) => { if (url && keys[i]) views[keys[i]] = url; });
            return views;
        }
        if (input && typeof input === 'object') {
            return input; // đã là dạng { front, back, left, right }
        }
        throw new Error('Input không hợp lệ. Cung cấp URL string, mảng URL, hoặc object { front, back, left, right }');
    }

    /**
     * Hàm chính để tạo 3D
     * Chấp nhận 1 ảnh (string/array[1]) hoặc đa ảnh (array/object)
     * @param {string|string[]|Object} input
     */
    async generateFull(input) {
        console.log(`[AI3D] ══ Bắt đầu quá trình tạo 3D model ══`);
        
        const views = this._normalizeInput(input);
        console.log(`[AI3D] Góc chụp nhận được: ${Object.keys(views).join(', ')} (tổng ${Object.keys(views).length} ảnh)`);

        const processedViews = {};
        for (const [key, url] of Object.entries(views)) {
            if (!url) continue;
            console.log(`[AI3D]  → Đang xử lý: ${key} — ${url}`);
            const buffer = await this._getImageBuffer(url);
            processedViews[key] = await this._prepareImage(buffer);
        }

        if (!processedViews.front) {
            throw new Error('Phải có ít nhất 1 ảnh (front) để tạo 3D.');
        }

        // Thử lần lượt các Space, fallback nếu lỗi
        const allSpaces = [...this.primarySpaces, ...this.fallbackSpaces];
        let lastError = null;

        for (const spaceId of allSpaces) {
            try {
                console.log(`[AI3D] Đang thử Space: ${spaceId}...`);
                const result = await this._predictWithSpace(spaceId, processedViews);
                console.log(`[AI3D] ✅ Thành công với Space: ${spaceId}`);
                return result;
            } catch (err) {
                console.warn(`[AI3D] ⚠ Space ${spaceId} thất bại: ${err.message?.substring(0, 120)}`);
                lastError = err;
            }
        }

        throw new Error(`Tất cả AI Service đều không phản hồi. Lỗi cuối: ${lastError?.message || 'Unknown error'}`);
    }

    /**
     * Thực hiện gửi request tới một Space cụ thể
     * 
     * ⚠️ LƯU Ý QUAN TRỌNG: Hunyuan3D-2.1 là 2 BƯỚC:
     *   Bước 1: /generation_all  → tạo bare mesh (.obj, chưa có màu)
     *   Bước 2: /on_export_click → apply texture và xuất .glb (ĐÂY MỚI CÓ MÀU)
     */
    async _predictWithSpace(spaceId, views) {
        const client = await Client.connect(spaceId, { hf_token: this.hfToken });
        console.log(`[AI3D] ✓ Đã kết nối Space: ${spaceId}`);
        
        // Chuẩn bị Blob cho các ảnh
        const blobs = {};
        for (const [key, buffer] of Object.entries(views)) {
            blobs[key] = new Blob([buffer], { type: 'image/png' });
        }

        const isMultiView = Object.keys(views).length > 1;
        console.log(`[AI3D] Chế độ: ${isMultiView ? 'Multi-view (' + Object.keys(views).join(',') + ')' : 'Single image'}`);

        // ─── BƯỚC 1: Tạo bare mesh ─────────────────────────────────────────────
        console.log(`[AI3D] Bước 1/2: Đang tạo base mesh... (có thể mất 1-3 phút)`);
        const genResult = await client.predict('/generation_all', {
            image:              blobs.front,
            mv_image_front:     blobs.front  || null,
            mv_image_back:      blobs.back   || null,
            mv_image_left:      blobs.left   || null,
            mv_image_right:     blobs.right  || null,
            steps:              30,
            guidance_scale:     5,
            seed:               Math.floor(Math.random() * 100000),
            octree_resolution:  '256',
            check_box_rembg:    true,
            num_chunks:         8000,
            randomize_seed:     true
        });

        const genData = genResult?.data;
        if (!genData || genData.length < 2) {
            throw new Error('Bước 1 (generation_all) trả về dữ liệu không hợp lệ.');
        }
        console.log(`[AI3D] ✓ Bước 1 hoàn tất. Nhận được ${genData.length} outputs.`);

        // Helper: Gradio trả về { value: { path, url, ... }, __type__: 'update' }
        // Cần unwrap để API bước 2 nhận được đúng FileData object
        const unwrapFileData = (obj) => {
            if (!obj) return null;
            if (obj.__type__ === 'update' && obj.value) return obj.value;
            return obj; // đã là FileData trực tiếp
        };

        const fileOut  = unwrapFileData(genData[0]);
        const fileOut2 = unwrapFileData(genData[1]);
        console.log(`[AI3D] fileOut path: ${fileOut?.path || 'unknown'}`);

        // ─── BƯỚC 2: Apply texture + xuất GLB có màu ─────────────────────────
        console.log(`[AI3D] Bước 2/2: Đang apply texture và xuất GLB...`);
        const exportResult = await client.predict('/on_export_click', {
            file_out:       fileOut,
            file_out2:      fileOut2,
            file_type:      'glb',
            reduce_face:    false,
            export_texture: true,     // ← BẮT BUỘC để có màu
            target_face_num: 10000
        });

        const exportData = exportResult?.data;
        console.log(`[AI3D] Bước 2 trả về ${exportData?.length || 0} outputs.`);

        if (!exportData || exportData.length < 2) {
            throw new Error('Bước 2 (on_export_click) trả về dữ liệu không hợp lệ.');
        }

        // Output[1] của bước 2 là file GLB có màu cuối cùng
        const glbOutput = exportData[1];
        const glbUrl = glbOutput?.url || glbOutput?.value?.url || glbOutput?.path || glbOutput?.value?.path;

        if (!glbUrl) {
            console.error('[AI3D] Export dump:', JSON.stringify(exportData, null, 2).substring(0, 500));
            throw new Error('Không tìm thấy URL file GLB trong kết quả export.');
        }

        console.log(`[AI3D] 🎨 GLB có màu: ${glbUrl}`);
        return glbUrl;
    }

    /**
     * Tải ảnh từ URL cục bộ hoặc cloud
     */
    async _getImageBuffer(imageUrl) {
        const isLocal = imageUrl.includes('localhost') || imageUrl.includes('127.0.0.1') || imageUrl.startsWith('/');
        if (isLocal) {
            const fileName = imageUrl.split('/').pop().split('?')[0];
            const localPath = path.join(process.cwd(), 'uploads', 'product-images', fileName);
            if (!fs.existsSync(localPath)) throw new Error(`Local image not found: ${localPath}`);
            return fs.promises.readFile(localPath);
        } else {
            const response = await fetch(imageUrl, { signal: AbortSignal.timeout(30000) });
            if (!response.ok) throw new Error(`Cannot fetch image: ${response.status}`);
            return Buffer.from(await response.arrayBuffer());
        }
    }

    /**
     * Chuẩn hóa ảnh (resize, png) trước khi gửi tới AI
     */
    async _prepareImage(buffer) {
        return sharp(buffer)
            .resize({ width: 512, height: 512, fit: 'inside' })
            .png({ compressionLevel: 9 })
            .toBuffer();
    }

    /**
     * Tải file GLB về server
     */
    async downloadToLocal(glbUrl, localFileName) {
        const uploadDir = path.join(process.cwd(), 'uploads', 'product-models');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const localPath = path.join(uploadDir, localFileName);
        
        console.log(`[AI3D] Đang tải mô hình về: ${localFileName}`);
        const fetchOptions = { signal: AbortSignal.timeout(300000) }; // 5 phút
        if (this.hfToken) fetchOptions.headers = { 'Authorization': `Bearer ${this.hfToken}` };

        const response = await fetch(glbUrl, fetchOptions);
        if (!response.ok) throw new Error(`Download failed (${response.status}): ${glbUrl}`);

        await pipeline(response.body, fs.createWriteStream(localPath));
        return `/uploads/product-models/${localFileName}`;
    }

    // Alias compatibility
    async generateShape(imageUrl) { return this.generateFull(imageUrl); }
}

module.exports = new AI3DService();

