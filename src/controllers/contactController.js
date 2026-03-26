const contactService = require('../services/contactService');
const { StatusCodes } = require('http-status-codes');

/**
 * POST /api/v1/contacts
 * Submit a new contact form
 */
const submitContact = async (req, res, next) => {
  try {
    const ipAddress =
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      req.ip;

    const payload = { ...req.body, ipAddress };
    const contact = await contactService.createContact(payload);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      data: {
        id: contact.id,
        fullName: contact.fullName,
        email: contact.email,
        subject: contact.subject,
        phone: contact.phone,
        createdAt: contact.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/contacts
 * Get all contacts (admin)
 */
const getContacts = async (req, res, next) => {
  try {
    const { page, limit, status, search } = req.query;
    const result = await contactService.getAllContacts({ page, limit, status, search });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Contacts retrieved successfully',
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/contacts/:id
 * Get a single contact by ID (admin)
 */
const getContact = async (req, res, next) => {
  try {
    const contact = await contactService.getContactById(req.params.id);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Contact retrieved successfully',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/v1/contacts/:id/status
 * Update contact status (admin)
 */
const updateStatus = async (req, res, next) => {
  try {
    const contact = await contactService.updateContactStatus(
      req.params.id,
      req.body.status,
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/v1/contacts/:id
 * Delete a contact (admin)
 */
const deleteContact = async (req, res, next) => {
  try {
    await contactService.deleteContact(req.params.id);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitContact,
  getContacts,
  getContact,
  updateStatus,
  deleteContact,
};
