/**
 * Middleware проверки аутентификации.
 * Возвращает 401, если пользователь не авторизован.
 */
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({
      error: 'Необходима аутентификация',
      status: 'error',
    });
  }
  next();
};

module.exports = requireAuth;
