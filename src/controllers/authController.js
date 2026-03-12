const bcrypt = require('bcrypt');
const passport = require('passport');

const UserModule = require('../modules/UserModule');

const SALT_ROUNDS = 10;
const AUTH_ERROR_MESSAGE = 'Неверный логин или пароль';

const signup = async (req, res, next) => {
  try {
    const { email, password, name, contactPhone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Некорректные данные',
        status: 'error',
      });
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    const trimmedName = String(name).trim();
    const trimmedContactPhone = contactPhone ? String(contactPhone).trim() : undefined;

    if (!trimmedEmail || !trimmedName || password.length < 6) {
      return res.status(400).json({
        error: 'Некорректные данные',
        status: 'error',
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await UserModule.create({
      email: trimmedEmail,
      passwordHash,
      name: trimmedName,
      contactPhone: trimmedContactPhone,
    });

    return res.status(201).json({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        contactPhone: user.contactPhone,
      },
      status: 'ok',
    });
  } catch (error) {
    if (error.statusCode === 409) {
      return res.status(409).json({
        error: 'email занят',
        status: 'error',
      });
    }

    return next(error);
  }
};

const signin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        error: info?.message || AUTH_ERROR_MESSAGE,
        status: 'error',
      });
    }

    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);

      return res.json({
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          contactPhone: user.contactPhone,
        },
        status: 'ok',
      });
    });
  })(req, res, next);
};

module.exports = {
  signup,
  signin,
};

