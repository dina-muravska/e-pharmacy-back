import { HttpError } from 'http-errors';

export const ErrorHandler = (err, req, res, next) => {
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }

  const isProd = process.env.NODE_ENV === 'production';
  if (err instanceof HttpError) {
    return res
      .status(err.statusCode || err.status)
      .json({ message: err.message || err.name });
  }

  return res.status(500).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message || 'Internal server error',
  });
};
