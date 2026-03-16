const postService = require('../services/postService');
const { StatusCodes } = require('http-status-codes');

const getAll = async (req, res, next) => {
  try {
    const result = await postService.getAll(req.query);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

const getBySlug = async (req, res, next) => {
  try {
    const data = await postService.getBySlug(req.params.slug);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const data = await postService.getById(req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const data = await postService.create(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, message: 'Post created', data });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = await postService.update(req.params.id, req.body);
    res.json({ success: true, message: 'Post updated', data });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await postService.remove(req.params.id);
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getBySlug, getById, create, update, remove };
