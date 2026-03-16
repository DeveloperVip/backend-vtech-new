const productService = require('../services/productService');
const { StatusCodes } = require('http-status-codes');

const getAll = async (req, res, next) => {
  try {
    const result = await productService.getAll(req.query);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

const getBySlug = async (req, res, next) => {
  try {
    const data = await productService.getBySlug(req.params.slug);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const data = await productService.getById(req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const data = await productService.create(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, message: 'Product created', data });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = await productService.update(req.params.id, req.body);
    res.json({ success: true, message: 'Product updated', data });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await productService.remove(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getBySlug, getById, create, update, remove };
