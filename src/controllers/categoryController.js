const categoryService = require('../services/categoryService');
const { StatusCodes } = require('http-status-codes');

const getAll = async (req, res, next) => {
  try {
    const data = await categoryService.getAll();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const data = await categoryService.create(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, message: 'Category created', data });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = await categoryService.update(req.params.id, req.body);
    res.json({ success: true, message: 'Category updated', data });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await categoryService.remove(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAll, create, update, remove };
