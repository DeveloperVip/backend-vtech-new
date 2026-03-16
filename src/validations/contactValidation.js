const Joi = require('joi');

const createContactSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).required().messages({
    'string.base': 'Full name must be a string',
    'string.empty': 'Full name is required',
    'string.min': 'Full name must be at least 2 characters',
    'string.max': 'Full name must not exceed 100 characters',
    'any.required': 'Full name is required',
  }),

  email: Joi.string().trim().email({ tlds: { allow: false } }).max(150).required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address',
    'string.max': 'Email must not exceed 150 characters',
    'any.required': 'Email is required',
  }),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9+\-\s()]{7,20}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Phone number must be between 7–20 digits and can include +, -, spaces, or parentheses',
    }),

  subject: Joi.string().trim().min(3).max(200).required().messages({
    'string.base': 'Subject must be a string',
    'string.empty': 'Subject is required',
    'string.min': 'Subject must be at least 3 characters',
    'string.max': 'Subject must not exceed 200 characters',
    'any.required': 'Subject is required',
  }),

  message: Joi.string().trim().min(10).max(2000).required().messages({
    'string.base': 'Message must be a string',
    'string.empty': 'Message is required',
    'string.min': 'Message must be at least 10 characters',
    'string.max': 'Message must not exceed 2000 characters',
    'any.required': 'Message is required',
  }),
});

const updateContactStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'read', 'replied', 'archived')
    .required()
    .messages({
      'any.only': 'Status must be one of: pending, read, replied, archived',
      'any.required': 'Status is required',
    }),
});

module.exports = {
  createContactSchema,
  updateContactStatusSchema,
};
