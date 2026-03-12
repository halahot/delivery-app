const Advertisement = require('../models/Advertisement');

/**
 * Преобразует документ объявления в формат ответа API.
 * @param {Object} doc - документ Mongoose (с populate userId)
 * @returns {Object}
 */
function formatAdvertisement(doc) {
  if (!doc) return null;
  const ad = doc.toObject ? doc.toObject() : doc;
  const userRef = ad.userId;

  return {
    id: ad._id.toString(),
    shortTitle: ad.shortText,
    description: ad.description,
    images: ad.images || [],
    user: userRef
      ? {
          id: userRef._id?.toString?.() || userRef.id,
          name: userRef.name,
        }
      : null,
    createdAt: ad.createdAt,
  };
}

/**
 * GET /api/advertisements — список объявлений (публичный)
 */
const getList = async (req, res, next) => {
  try {
    const advertisements = await Advertisement.find({ isDeleted: false })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    const data = advertisements.map((ad) => formatAdvertisement(ad));

    return res.json({
      data,
      status: 'ok',
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /api/advertisements — создание объявления (требует аутентификации)
 */
const create = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const shortTitle = (req.body.shortTitle || '').trim();
    const description = (req.body.description || '').trim();

    if (!shortTitle) {
      return res.status(400).json({
        error: 'Поле shortTitle обязательно',
        status: 'error',
      });
    }

    const imagePaths = (req.files || []).map((file) => {
      return `/uploads/${userId}/${file.filename}`;
    });

    const advertisement = await Advertisement.create({
      shortText: shortTitle,
      description,
      images: imagePaths,
      userId,
      isDeleted: false,
    });

    await advertisement.populate('userId', 'name');
    const data = formatAdvertisement(advertisement);

    return res.status(201).json({
      data,
      status: 'ok',
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * DELETE /api/advertisements/:id — мягкое удаление объявления (требует аутентификации)
 */
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();

    const advertisement = await Advertisement.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!advertisement) {
      return res.status(404).json({
        error: 'Объявление не найдено',
        status: 'error',
      });
    }

    const adUserId = advertisement.userId?.toString?.() || advertisement.userId;
    if (adUserId !== userId) {
      return res.status(403).json({
        error: 'Недостаточно прав',
        status: 'error',
      });
    }

    advertisement.isDeleted = true;
    await advertisement.save();

    return res.json({
      data: { id: advertisement._id.toString() },
      status: 'ok',
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /api/advertisements/:id — одно объявление (публичный)
 */
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const advertisement = await Advertisement.findOne({
      _id: id,
      isDeleted: false,
    })
      .populate('userId', 'name')
      .lean();

    if (!advertisement) {
      return res.status(404).json({
        error: 'Объявление не найдено',
        status: 'error',
      });
    }

    const data = formatAdvertisement(advertisement);

    return res.json({
      data,
      status: 'ok',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getList,
  getById,
  create,
  remove,
};
