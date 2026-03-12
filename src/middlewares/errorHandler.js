const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
  }
  if (err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
  }

  const response = {
    error: message,
    status: 'error',
  };

  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;

