import { env } from '../config/env.js';

export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Something went wrong. Please try again.';

  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid identifier supplied.';
  }

  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyPattern || {})[0] || 'value';
    message = `That ${field} is already in use.`;
  }

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(' ');
  }

  if (err.name === 'MulterError') {
    status = 400;
    message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Each image must be 6MB or smaller.'
        : `Upload error: ${err.message}`;
  }

  if (status >= 500) {
    console.error('[error]', err);
  }

  res.status(status).json({
    message,
    ...(env.isProduction ? {} : { stack: err.stack }),
  });
}
