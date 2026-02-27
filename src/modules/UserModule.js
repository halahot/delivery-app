const User = require('../models/User');

class UserModule {
  /**
   * Создать пользователя.
   * @param {Object} data - данные пользователя без _id
   * @returns {Promise<Object>} созданный пользователь
   */
  static async create(data) {
    try {
      const user = await User.create(data);
      return user;
    } catch (error) {
      if (error.name === 'MongoServerError' && error.code === 11000 && error.keyPattern?.email) {
        const err = new Error('User with this email already exists');
        err.statusCode = 409;
        throw err;
      }

      throw error;
    }
  }

  /**
   * Найти пользователя по email.
   * @param {string} email
   * @returns {Promise<Object|null>} найденный пользователь или null
   */
  static async findByEmail(email) {
    const user = await User.findOne({ email }).exec();
    return user;
  }
}

module.exports = UserModule;

