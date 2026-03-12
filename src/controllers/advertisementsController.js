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
};
