const Advertisement = require('../models/Advertisement');

class AdvertisementModule {
  /**
   * Создать объявление.
   * @param {Object} data - данные объявления без _id (shortText, description, images, userId, tags)
   * @returns {Promise<Object>} созданное объявление
   */
  static async create(data) {
    const advertisement = await Advertisement.create(data);
    return advertisement;
  }

  /**
   * Удалить объявление (soft delete: isDeleted = true).
   * @param {string|import('mongoose').Types.ObjectId} id - идентификатор объявления
   * @returns {Promise<Object|null>} обновлённое объявление или null, если не найдено
   */
  static async remove(id) {
    const advertisement = await Advertisement.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    ).exec();
    return advertisement;
  }

  /**
   * Найти объявления по параметрам.
   * @param {Object} params
   * @param {string} [params.shortText] - подстрока для поиска в shortText (регистронезависимо)
   * @param {string} [params.description] - подстрока для поиска в description (регистронезависимо)
   * @param {string|import('mongoose').Types.ObjectId} [params.userId] - идентификатор пользователя
   * @param {string[]} [params.tags] - все указанные теги должны присутствовать в объявлении
   * @returns {Promise<Object[]>} массив объявлений
   */
  static async find(params = {}) {
    const { shortText, description, userId, tags } = params;

    const query = {
      isDeleted: false,
    };

    if (typeof shortText === 'string' && shortText.trim()) {
      query.shortText = {
        $regex: shortText.trim(),
        $options: 'i',
      };
    }

    if (typeof description === 'string' && description.trim()) {
      query.description = {
        $regex: description.trim(),
        $options: 'i',
      };
    }

    if (userId) {
      query.userId = userId;
    }

    if (Array.isArray(tags) && tags.length > 0) {
      query.tags = { $all: tags };
    }

    const advertisements = await Advertisement.find(query).exec();
    return advertisements;
  }
}

module.exports = AdvertisementModule;

