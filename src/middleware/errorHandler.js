import { HttpError } from 'http-errors';
export const ErrorHandler = (err, req, res, next) => {
  console.error(err);
  if (err instanceof HttpError) {
    return res.status(err.status).json({ massage: err.massage || err.name });
  }
  const isProd = (process.env.NODE_ENV = 'production');
  res
    .status(500)
    .json({
      massage: isProd
        ? 'Something went wrong. Please try again later.'
        : err.massage,
    });
};
