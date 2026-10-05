export const notFoundHandler = (res, req) => {
  res.status(404).json({ massage: 'Route not found' });
};
