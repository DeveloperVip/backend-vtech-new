const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require(".././config/cloudinary")
const cloudStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'uploads', // folder trên cloud
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [
            { width: 1920, height: 1080, crop: 'limit' }, // 🔥 auto resize
            { quality: 'auto' }, // 🔥 auto optimize
            { fetch_format: 'auto' }, // 🔥 auto webp
        ],
    },
});

module.exports = { cloudStorage }