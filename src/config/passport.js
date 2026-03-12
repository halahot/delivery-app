const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');

const UserModule = require('../modules/UserModule');
const User = require('../models/User');

const AUTH_ERROR_MESSAGE = 'Неверный логин или пароль';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: false,
    },
    async (email, password, done) => {
      try {
        const normalizedEmail = String(email || '').trim().toLowerCase();
        const user = await UserModule.findByEmail(normalizedEmail);

        if (!user) {
          return done(null, false, { message: AUTH_ERROR_MESSAGE });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
          return done(null, false, { message: AUTH_ERROR_MESSAGE });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();

    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (error) {
    done(error);
  }
});
