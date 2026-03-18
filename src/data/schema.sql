INSERT INTO categories
(id, name, slug, parentId, description, thumbnail, isActive, sortOrder, metaTitle, metaDescription, createdAt, updatedAt)
VALUES

-- ================= CHA =================
(1, 'Thiết bị giáo dục', 'thiet-bi-giao-duc', NULL,
 'Danh mục thiết bị phục vụ đào tạo, giảng dạy kỹ thuật',
 'https://example.com/images/cat-giao-duc.jpg',
 1, 1,
 'Thiết bị giáo dục chất lượng cao',
 'Cung cấp mô hình và thiết bị đào tạo nghề',
 NOW(), NOW()),

(2, 'Thiết bị ô tô', 'thiet-bi-o-to', NULL,
 'Danh mục thiết bị, phụ kiện và công nghệ cho ô tô',
 'https://example.com/images/cat-o-to.jpg',
 1, 2,
 'Thiết bị ô tô hiện đại',
 'Phụ kiện và thiết bị thông minh cho xe hơi',
 NOW(), NOW()),

(3, 'Thiết bị thông minh', 'thiet-bi-thong-minh', NULL,
 'Các thiết bị IoT, Smart Home, tự động hóa',
 'https://example.com/images/cat-smart.jpg',
 1, 3,
 'Thiết bị thông minh IoT',
 'Giải pháp nhà thông minh và tự động hóa',
 NOW(), NOW()),

(4, 'Thiết bị công nghiệp', 'thiet-bi-cong-nghiep', NULL,
 'Thiết bị phục vụ sản xuất công nghiệp',
 'https://example.com/images/cat-cong-nghiep.jpg',
 1, 4,
 'Thiết bị công nghiệp',
 'Giải pháp tự động hóa nhà máy',
 NOW(), NOW()),


-- ================= CON: GIÁO DỤC =================
(10, 'Mô hình khí cụ điện', 'mo-hinh-khi-cu-dien', 1,
 'Thiết bị thực hành khí cụ điện',
 'https://example.com/images/khi-cu-dien.jpg',
 1, 1,
 'Mô hình khí cụ điện',
 'Thiết bị thực hành điện cơ bản',
 NOW(), NOW()),

(11, 'Mô hình cảm biến', 'mo-hinh-cam-bien', 1,
 'Thiết bị thực hành cảm biến',
 'https://example.com/images/cam-bien.jpg',
 1, 2,
 'Mô hình cảm biến',
 'Thiết bị đào tạo cảm biến công nghiệp',
 NOW(), NOW()),

(12, 'Cabin thực hành điện', 'cabin-thuc-hanh-dien', 1,
 'Cabin mô phỏng lắp đặt điện',
 'https://example.com/images/cabin-dien.jpg',
 1, 3,
 'Cabin thực hành điện',
 'Mô hình lắp đặt điện thực tế',
 NOW(), NOW()),


-- ================= CON: Ô TÔ =================
(20, 'Thiết bị chẩn đoán', 'thiet-bi-chan-doan', 2,
 'Thiết bị đọc lỗi và phân tích xe',
 'https://example.com/images/chan-doan.jpg',
 1, 1,
 'Thiết bị chẩn đoán ô tô',
 'Máy đọc lỗi OBD, ECU',
 NOW(), NOW()),

(21, 'Camera & giám sát', 'camera-giam-sat-o-to', 2,
 'Camera hành trình, giám sát xe',
 'https://example.com/images/camera-oto.jpg',
 1, 2,
 'Camera ô tô',
 'Thiết bị giám sát hành trình',
 NOW(), NOW()),

(22, 'Cảm biến ô tô', 'cam-bien-o-to', 2,
 'Cảm biến hỗ trợ lái xe',
 'https://example.com/images/cam-bien-oto.jpg',
 1, 3,
 'Cảm biến ô tô',
 'Cảm biến áp suất lốp, va chạm',
 NOW(), NOW()),


-- ================= CON: THÔNG MINH =================
(30, 'Smart Home', 'smart-home', 3,
 'Thiết bị nhà thông minh',
 'https://example.com/images/smart-home.jpg',
 1, 1,
 'Nhà thông minh',
 'Giải pháp smart home',
 NOW(), NOW()),

(31, 'IoT nông nghiệp', 'iot-nong-nghiep', 3,
 'Thiết bị IoT trong nông nghiệp',
 'https://example.com/images/iot-farm.jpg',
 1, 2,
 'IoT nông nghiệp',
 'Giải pháp tưới tiêu thông minh',
 NOW(), NOW()),


-- ================= CON: CÔNG NGHIỆP =================
(40, 'PLC & điều khiển', 'plc-dieu-khien', 4,
 'Thiết bị PLC, tự động hóa',
 'https://example.com/images/plc.jpg',
 1, 1,
 'PLC công nghiệp',
 'Thiết bị điều khiển lập trình',
 NOW(), NOW()),

(41, 'Biến tần & động cơ', 'bien-tan-dong-co', 4,
 'Biến tần và motor công nghiệp',
 'https://example.com/images/bien-tan.jpg',
 1, 2,
 'Biến tần công nghiệp',
 'Điều khiển tốc độ động cơ',
 NOW(), NOW());



-- ==datamock product== --
INSERT INTO products
(name, slug, description, content, price, priceType, thumbnail, categoryId, stock, isFeatured, isActive, createdAt, updatedAt)
VALUES
-- ===== Thiết bị giáo dục =====
('Mô hình điện cơ đơn giản', 'mo-hinh-dien-co-don-gian', 'Mô hình thực hành điện cơ bản', 'Chi tiết sản phẩm mô hình điện cơ cho giáo dục kỹ thuật.', 1500000, 'fixed', 'https://example.com/images/product-dien-co.jpg', 10, 10, true, true, NOW(), NOW()),
('Bộ cảm biến đa năng', 'bo-cam-bien-da-nang', 'Mô hình thực hành cảm biến', 'Bộ kit cảm biến cho học tập và nghiên cứu.', 2200000, 'fixed', 'https://example.com/images/product-cam-bien.jpg', 11, 15, false, true, NOW(), NOW()),

-- ===== Thiết bị ô tô =====
('Máy chẩn đoán OBD', 'may-chan-doan-obd', 'Thiết bị đọc lỗi và phân tích xe', 'Hỗ trợ đọc lỗi động cơ và phân tích hệ thống ô tô.', 3500000, 'fixed', 'https://example.com/images/product-chan-doan.jpg', 20, 8, false, true, NOW(), NOW()),
('Camera hành trình xe hơi', 'camera-hanh-trinh-xe-hoi', 'Camera giám sát ô tô', 'Camera hành trình HD cho xe ô tô.', 1200000, 'fixed', 'https://example.com/images/product-camera.jpg', 21, 12, false, true, NOW(), NOW()),

-- ===== Thiết bị thông minh =====
('Bộ nhà thông minh Smart Home', 'bo-nha-thong-minh-smart-home', 'Thiết bị nhà thông minh', 'Hệ thống tự động hóa cho nhà ở và văn phòng.', 5000000, 'fixed', 'https://example.com/images/product-smart-home.jpg', 30, 5, false, true, NOW(), NOW()),
('Thiết bị IoT tưới tiêu nông nghiệp', 'thiet-bi-iot-tuoi-tieu', 'IoT cho nông nghiệp', 'Giải pháp tưới tiêu thông minh, điều khiển từ xa.', 2800000, 'fixed', 'https://example.com/images/product-iot-farm.jpg', 31, 7, false, true, NOW(), NOW()),

-- ===== Thiết bị công nghiệp =====
('Bộ PLC và điều khiển', 'bo-plc-dieu-khien', 'Thiết bị PLC, tự động hóa', 'PLC công nghiệp cho hệ thống tự động hóa.', 8000000, 'fixed', 'https://example.com/images/product-plc.jpg', 40, 4, false, true, NOW(), NOW()),
('Biến tần và động cơ', 'bien-tan-va-dong-co', 'Biến tần và motor công nghiệp', 'Điều khiển tốc độ động cơ, tiết kiệm năng lượng.', 6500000, 'fixed', 'https://example.com/images/product-bien-tan.jpg', 41, 6, false, true, NOW(), NOW());


https://res.cloudinary.com/drmeotcu7/image/upload/v1773827764/uploads/pbxti31xig3xzkgxkua5.jpg