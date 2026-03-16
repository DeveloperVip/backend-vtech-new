const slugify = require('slugify');
const { Product, Category } = require('../models');
const { AppError } = require('../middlewares/errorHandler');
const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');

const makeSlug = (name) =>
  slugify(name, { lower: true, strict: true, locale: 'vi' });

const getAll = async ({ page = 1, limit = 12, categoryId, search, featured, active = true } = {}) => {
  const where = {};
  if (active !== undefined) where.isActive = active === 'false' ? false : true;
  if (featured === 'true') where.isFeatured = true;
  if (categoryId) where.categoryId = categoryId;
  if (search) where.name = { [Op.like]: `%${search}%` };

  const offset = (page - 1) * limit;
  const { count, rows } = await Product.findAndCountAll({
    where,
    include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['isFeatured', 'DESC'], ['sortOrder', 'ASC'], ['createdAt', 'DESC']],
  });

  return { data: rows, pagination: { total: count, page: +page, limit: +limit, totalPages: Math.ceil(count / limit) } };
};

const getBySlug = async (slug) => {
  const product = await Product.findOne({
    where: { slug, isActive: true },
    include: [{ model: Category, as: 'category' }],
  });
  if (!product) throw new AppError('Product not found', StatusCodes.NOT_FOUND);
  return product;
};

const getById = async (id) => {
  const product = await Product.findByPk(id, {
    include: [{ model: Category, as: 'category' }],
  });
  if (!product) throw new AppError('Product not found', StatusCodes.NOT_FOUND);
  return product;
};

const create = async (data) => {
  if (!data.slug) data.slug = makeSlug(data.name);
  return Product.create(data);
};

const update = async (id, data) => {
  const product = await getById(id);
  if (data.name && !data.slug) data.slug = makeSlug(data.name);
  await product.update(data);
  return product;
};

const remove = async (id) => {
  const product = await getById(id);
  await product.destroy();
};

module.exports = { getAll, getBySlug, getById, create, update, remove };
