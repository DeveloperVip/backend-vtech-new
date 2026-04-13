const seedData = {
  categories: [
    {
      id: 1,
      name: 'Ô tô',
      slug: 'o-to',
      description: 'Các dòng xe hơi cao cấp, xe điện thông minh và phụ kiện ô tô chính hãng.',
      thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    },
    {
      id: 2,
      name: 'Điện công nghiệp',
      slug: 'dien-cong-nghiep',
      description: 'Giải pháp điện năng toàn diện cho nhà máy, xí nghiệp và các dự án năng lượng.',
      thumbnail: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
    },
    {
      id: 3,
      name: 'Điện dân dụng',
      slug: 'dien-dan-dung',
      description: 'Thiết bị điện gia đình, hệ thống chiếu sáng và nhà thông minh.',
      thumbnail: 'https://images.unsplash.com/photo-1558002038-1050e23e806a?w=800&q=80',
    }
  ],
  products: [
    {
      id: 1,
      categoryId: 1,
      name: 'VinFast VF8 Plus',
      slug: 'vinfast-vf8-plus',
      price: 1270000000,
      priceType: 'fixed',
      thumbnail: 'https://images.unsplash.com/photo-1621259182978-f09e5e2ca1c5?w=800&q=80',
      description: 'SUV điện thông minh phân khúc D với thiết kế Ý sang trọng và công nghệ hỗ trợ lái nâng cao ADAS.',
      content: `
        <h2>Khám phá VinFast VF8 - Đỉnh cao công nghệ lái</h2>
        <p>VinFast VF8 là dòng xe SUV điện thông minh cỡ trung với thiết kế kết hợp giữa sự mạnh mẽ và sang trọng từ studio Pininfarina danh tiếng.</p>
        <ul>
          <li><strong>Quãng đường di chuyển:</strong> Lên tới 447km sau mỗi lần sạc đầy.</li>
          <li><strong>Tăng tốc:</strong> 0-100km/h chỉ trong 5.5 giây.</li>
          <li><strong>Hệ thống an toàn:</strong> 11 túi khí, đạt chuẩn Euro NCAP 5 sao.</li>
        </ul>
        <p>Hệ thống hỗ trợ lái nâng cao ADAS giúp việc lái xe trở nên an toàn và thư thái hơn bao giờ hết với các tính năng: Hỗ trợ di chuyển khi ùn tắc, Tự động chuyển làn, Hỗ trợ đỗ xe thông minh.</p>
      `,
      isFeatured: true,
      attributes: [
        { name: 'Loại pin', value: 'Lithium-ion' },
        { name: 'Công suất tối đa', value: '300 kW / 402 hp' },
        { name: 'Mô-men xoắn cực đại', value: '620 Nm' },
        { name: 'Hệ dẫn động', value: 'AWD (4 bánh toàn thời gian)' },
      ],
      additionalInfo: [
        { name: 'Bảo hành', value: '10 năm hoặc 200.000km tùy điều kiện nào đến trước.' },
        { name: 'Khuyến mãi', value: 'Miễn phí sạc pin 1 năm tại các trạm sạc VinFast trên toàn quốc.' }
      ],
      images: [
        'https://images.unsplash.com/photo-1621259182978-f09e5e2ca1c5?w=800&q=80',
        'https://images.unsplash.com/photo-1590362891175-379100067332?w=800&q=80'
      ]
    },
    {
      id: 2,
      categoryId: 1,
      name: 'BMW X5 xDrive40i MSport',
      slug: 'bmw-x5-xdrive40i-msport',
      price: 4159000000,
      priceType: 'fixed',
      thumbnail: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
      description: 'Mẫu SAV biểu tượng của BMW với khả năng vận hành vượt trội và không gian nội thất đẳng cấp.',
      content: `
        <h3>BMW X5 - Thủ lĩnh phân khúc SAV</h3>
        <p>BMW X5 hội tụ đầy đủ những yếu tố làm nên một chiếc xe sang hoàn hảo: mạnh mẽ, sang trọng và đầy ắp công nghệ.</p>
        <p>Trang bị gói MSport thể thao cùng động cơ B58 danh tiếng cho khả năng vượt mọi địa hình một cách êm ái nhất.</p>
      `,
      attributes: [
        { name: 'Động cơ', value: '3.0L I6 TwinPower Turbo' },
        { name: 'Hộp số', value: '8 cấp Steptronic' },
        { name: 'Ghế ngồi', value: '7 chỗ' }
      ],
      images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80']
    },
    {
      id: 3,
      categoryId: 2,
      name: 'Máy biến áp dầu 2500kVA',
      slug: 'may-bien-ap-dau-2500kva',
      price: 850000000,
      priceType: 'contact',
      thumbnail: 'https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?w=800&q=80',
      description: 'Máy biến áp phân phối chất lượng cao, độ bền tốt, tiết kiệm điện năng cho các khu công nghiệp.',
      content: `
        <p>Máy biến áp 2500kVA được sản xuất theo tiêu chuẩn IEC-60076, đảm bảo vận hành ổn định trong điều kiện khắc nghiệt.</p>
        <p>Đặc tính kỹ thuật chính:</p>
        <ul>
          <li>Điện áp định mức: 22/0.4kV</li>
          <li>Tần số: 50Hz</li>
          <li>Tổ đấu dây: Dyn11</li>
        </ul>
      `,
      attributes: [
        { name: 'Công suất', value: '2500 kVA' },
        { name: 'Kiểu làm mát', value: 'ONAN (Làm mát bằng dầu tự nhiên)' },
        { name: 'Thương hiệu', value: 'ABB / Schneider' }
      ],
      images: ['https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?w=800&q=80']
    },
    {
      id: 4,
      categoryId: 2,
      name: 'Tủ điện Trung thế RMU 24kV',
      slug: 'tu-dien-trung-the-rmu-24kv',
      price: 0,
      priceType: 'contact',
      thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
      description: 'Tủ RMU cách điện bằng khí SF6, thiết kế nhỏ gọn, độ tin cậy cao cho trạm biến áp trong nhà.',
      content: `
        <p>Tủ RMU (Ring Main Unit) là giải pháp quản lý lưới điện trung thế an toàn và hiệu quả.</p>
        <p>Tính năng nổi bật:</p>
        <ul>
          <li>Chống cháy nổ tuyệt đối</li>
          <li>Không cần bảo trì trong suốt vòng đời sản phẩm</li>
          <li>Dễ dàng mở rộng và kết nối với hệ thống SCADA</li>
        </ul>
      `,
      attributes: [
        { name: 'Điện áp định mức', value: '24 kV' },
        { name: 'Dòng điện định mức', value: '630 A' },
        { name: 'Cấp bảo vệ', value: 'IP54' }
      ],
      images: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80']
    }
  ],
  posts: [
    {
      title: 'Xu hướng xe điện tại Việt Nam năm 2026',
      slug: 'xu-huong-xe-dien-2026',
      excerpt: 'Thị trường xe điện đang bùng nổ với sự gia nhập của nhiều thương hiệu lớn và hạ tầng trạm sạc phủ khắp.',
      content: '<p>Cùng điểm qua những cột mốc quan trọng của ngành xe điện trong năm 2026...</p>',
      thumbnail: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: 'Giải pháp tiết kiệm điện năng cho nhà máy sản xuất',
      slug: 'tiet-kiem-dien-nha-may',
      excerpt: 'Tối ưu hóa hệ thống máy biến áp và tủ điện có thể giúp doanh nghiệp tiết kiệm tới 30% chi phí vận hành.',
      content: '<p>Bài viết chia sẻ các kỹ thuật lắp đặt và vận hành hệ thống điện thông minh...</p>',
      thumbnail: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
      isPublished: true,
      publishedAt: new Date(),
    }
  ],
  users: [
    {
      name: 'Nguyễn Văn Thành viên',
      username: 'member1',
      email: 'member@gmail.com',
      password: 'password123', // Will be hashed by seeder
    }
  ]
};

module.exports = seedData;
