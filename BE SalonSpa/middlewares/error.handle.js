module.exports = (err, req, res, next) => {
  let error = { ...err };

  if (err?.name === 'CastError') {
    error.statusCode = 404;
    error.message = `Resource not found`;
  }

  if (err.statusCode === 400) {
    error.statusCode = 400;
    error.message = err.message;
  }

  if (err.statusCode === 401) {
    error.statusCode = 401;
    error.message = err.message;
  }

  if (err.statusCode === 403) {
    error.statusCode = 403;
    error.message = err.message;
  }

  if (err.statusCode === 404) {
    error.statusCode = 404;
    error.message = err.message;
  }

  if (err?.code === 11000) {
    error.statusCode = 400;
    error.message = 'Duplicate resource';
  }

  let statusCode = error.statusCode || 500;
  const message = error.message || err.message || 'Internal Server Error';
  if (message === 'jwt expired') {
    statusCode = 401;
  }

  res.status(statusCode).json({
    statusCode,
    message,
  });
};
