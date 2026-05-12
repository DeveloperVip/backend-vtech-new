const { StatusCodes } = require('http-status-codes');
const { Partner } = require('../models');

const cleanOptionalString = (value) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = String(value).trim();
  return trimmed || null;
};

const normalizeWebsite = (value) => {
  const cleaned = cleanOptionalString(value);
  if (!cleaned) return cleaned;
  return /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;
};

const isValidWebsite = (value) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
};

// ─── LIST (public + admin) ─────────────────────────────────────────────────
exports.getAll = async (req, res, next) => {
  try {
    const { active } = req.query;
    const where = {};
    if (active === 'true') where.isActive = true;
    if (active === 'false') where.isActive = false;

    const partners = await Partner.findAll({
      where,
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']],
    });

    res.json({ success: true, data: partners });
  } catch (err) {
    next(err);
  }
};

// ─── GET ONE ─────────────────────────────────────────────────────────────────
exports.getOne = async (req, res, next) => {
  try {
    const partner = await Partner.findByPk(req.params.id);
    if (!partner) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Không tìm thấy đối tác' });
    }
    res.json({ success: true, data: partner });
  } catch (err) {
    next(err);
  }
};

// ─── CREATE ──────────────────────────────────────────────────────────────────
exports.create = async (req, res, next) => {
  try {
    const { name, logoUrl, website, country, description, sortOrder, isActive } = req.body;
    const normalizedWebsite = normalizeWebsite(website);

    if (!name || !name.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Tên đối tác là bắt buộc' });
    }
    if (!isValidWebsite(normalizedWebsite)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Website không hợp lệ' });
    }

    const partner = await Partner.create({
      name: name.trim(),
      logoUrl: cleanOptionalString(logoUrl) ?? null,
      website: normalizedWebsite ?? null,
      country: cleanOptionalString(country) ?? null,
      description: cleanOptionalString(description) ?? null,
      sortOrder: sortOrder ?? 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(StatusCodes.CREATED).json({ success: true, data: partner, message: 'Tạo đối tác thành công' });
  } catch (err) {
    next(err);
  }
};

// ─── UPDATE ──────────────────────────────────────────────────────────────────
exports.update = async (req, res, next) => {
  try {
    const partner = await Partner.findByPk(req.params.id);
    if (!partner) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Không tìm thấy đối tác' });
    }

    const { name, logoUrl, website, country, description, sortOrder, isActive } = req.body;
    const nextName = name !== undefined ? cleanOptionalString(name) : undefined;
    const normalizedWebsite = website !== undefined ? normalizeWebsite(website) : undefined;

    if (nextName === null) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Tên đối tác là bắt buộc' });
    }
    if (!isValidWebsite(normalizedWebsite)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Website không hợp lệ' });
    }

    await partner.update({
      ...(nextName !== undefined && { name: nextName }),
      ...(logoUrl !== undefined && { logoUrl: cleanOptionalString(logoUrl) }),
      ...(normalizedWebsite !== undefined && { website: normalizedWebsite }),
      ...(country !== undefined && { country: cleanOptionalString(country) }),
      ...(description !== undefined && { description: cleanOptionalString(description) }),
      ...(sortOrder !== undefined && { sortOrder }),
      ...(isActive !== undefined && { isActive }),
    });

    res.json({ success: true, data: partner, message: 'Cập nhật đối tác thành công' });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE ──────────────────────────────────────────────────────────────────
exports.remove = async (req, res, next) => {
  try {
    const partner = await Partner.findByPk(req.params.id);
    if (!partner) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Không tìm thấy đối tác' });
    }

    await partner.destroy();
    res.json({ success: true, message: 'Xoá đối tác thành công' });
  } catch (err) {
    next(err);
  }
};

// ─── TOGGLE ACTIVE ───────────────────────────────────────────────────────────
exports.toggleActive = async (req, res, next) => {
  try {
    const partner = await Partner.findByPk(req.params.id);
    if (!partner) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Không tìm thấy đối tác' });
    }

    await partner.update({ isActive: !partner.isActive });
    res.json({ success: true, data: partner, message: `Đã ${partner.isActive ? 'hiển thị' : 'ẩn'} đối tác` });
  } catch (err) {
    next(err);
  }
};
