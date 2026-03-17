const { Product } = require('../models');

const generateUniqueSlug = async (name) => {
  const baseSlug = makeSlug(name);
  let slug = baseSlug;
  let count = 1;

  while (await Product.exists({ slug })) {
    slug = `${baseSlug}-${count++}`;

    // 🔥 tránh loop quá nhiều
    if (count > 10) {
      slug = `${baseSlug}-${Date.now()}`;
      break;
    }
  }

  return slug;
};

module.exports = {generateUniqueSlug}