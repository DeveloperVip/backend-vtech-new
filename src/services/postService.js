const slugify = require('slugify');
const { Post } = require('../models');
const { AppError } = require('../middlewares/errorHandler');
const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');

const makeSlug = (t) => slugify(t, { lower: true, strict: true, locale: 'vi' });

const getAll = async ({ page = 1, limit = 9, published, search } = {}) => {
  const where = {};
  if (published === 'true') where.isPublished = true;
  if (search) where.title = { [Op.like]: `%${search}%` };

  const offset = (page - 1) * limit;
  const { count, rows } = await Post.findAndCountAll({
    where,
    attributes: { exclude: ['content'] },
    limit: +limit, offset: +offset,
    order: [['publishedAt', 'DESC'], ['createdAt', 'DESC']],
  });
  return { data: rows, pagination: { total: count, page: +page, limit: +limit, totalPages: Math.ceil(count / limit) } };
};

const getBySlug = async (slug) => {
  const post = await Post.findOne({ where: { slug, isPublished: true } });
  if (!post) throw new AppError('Post not found', StatusCodes.NOT_FOUND);
  return post;
};

const getById = async (id) => {
  const post = await Post.findByPk(id);
  if (!post) throw new AppError('Post not found', StatusCodes.NOT_FOUND);
  return post;
};

const create = async (data) => {
  if (!data.slug) data.slug = makeSlug(data.title);
  if (data.isPublished && !data.publishedAt) data.publishedAt = new Date();
  return Post.create(data);
};

const update = async (id, data) => {
  const post = await getById(id);
  if (data.title && !data.slug) data.slug = makeSlug(data.title);
  if (data.isPublished && !post.publishedAt) data.publishedAt = new Date();
  await post.update(data);
  return post;
};

const remove = async (id) => {
  const post = await getById(id);
  await post.destroy();
};

module.exports = { getAll, getBySlug, getById, create, update, remove };
