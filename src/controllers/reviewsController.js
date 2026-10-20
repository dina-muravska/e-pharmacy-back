import { Review } from '../models/review.js';

export const getCustomerReviews = async (req, res) => {
  const { productId, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const [reviews, totalItems] = await Promise.all([
    Review.find({ productID: productId })
      .skip(skip)
      .limit(Number(limit))
      .populate('userId', 'name'),
    Review.countDocuments({ productID: productId }),
  ]);

  res.status(200).json({
    status: 200,
    message: 'Successfully found customer reviews!',
    data: reviews,
    page: Number(page),
    limit: Number(limit),
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
  });
};
