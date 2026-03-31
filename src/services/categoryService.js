const slugify = require('slugify');
const { Category } = require('../models');
const { AppError } = require('../middlewares/errorHandler');
const { StatusCodes } = require('http-status-codes');

const makeSlug = (name) => slugify(name, { lower: true, strict: true, locale: 'vi' });

const getAll = async () =>
  Category.findAll({
    where: { parentId: null },
    include: [{ model: Category, as: 'children', required: false }],
    order: [['sortOrder', 'ASC'], ['name', 'ASC']],
  });

const getById = async (id) => {
  const cat = await Category.findByPk(id);
  if (!cat) throw new AppError('Category not found', StatusCodes.NOT_FOUND);
  return cat;
};

const create = async (data) => {
  if (!data.slug) data.slug = makeSlug(data.name);
  return Category.create(data);
};

const update = async (id, data) => {
  const cat = await getById(id);
  if (data.name && !data.slug) data.slug = makeSlug(data.name);
  await cat.update(data);
  return cat;
};

const remove = async (id) => {
  const cat = await getById(id);
  await cat.destroy();
};

module.exports = { getAll, getById, create, update, remove };
