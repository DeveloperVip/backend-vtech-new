const { Contact } = require('../models');
const { AppError } = require('../middlewares/errorHandler');
const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');

/**
 * Create a new contact submission
 */
const createContact = async (data) => {
  const contact = await Contact.create(data);
  return contact;
};

/**
 * Get all contacts with optional filters and pagination
 */
const getAllContacts = async ({ page = 1, limit = 10, status, search } = {}) => {
  const offset = (page - 1) * limit;

  const where = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where[Op.or] = [
      { fullName: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { subject: { [Op.like]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } },
    ];
  }

  const { count, rows } = await Contact.findAndCountAll({
    where,
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['createdAt', 'DESC']],
  });

  return {
    data: rows,
    pagination: {
      total: count,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(count / limit),
    },
  };
};

/**
 * Get single contact by ID
 */
const getContactById = async (id) => {
  const contact = await Contact.findByPk(id);
  if (!contact) {
    throw new AppError('Contact not found', StatusCodes.NOT_FOUND);
  }
  return contact;
};

/**
 * Update contact status
 */
const updateContactStatus = async (id, status) => {
  const contact = await getContactById(id);
  await contact.update({ status });
  return contact;
};

/**
 * Delete a contact
 */
const deleteContact = async (id) => {
  const contact = await getContactById(id);
  await contact.destroy();
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
};
