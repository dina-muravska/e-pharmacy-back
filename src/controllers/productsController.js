import { Product } from '../models/product.js';

export const getProductsList = async (req, res) => {
  const {
    q,
    brand,
    tags,
    tag,
    rx,
    minPrice,
    maxPrice,
    page = 1,
    limit = 12,
    sort = 'createdAt',
  } = req.query;

  const skip = (page - 1) * limit;
  const filter = {};

  if (q) {
    filter.title = { $regex: q, $options: 'i' };
  }

  if (brand) {
    filter.brand = brand;
  }

  const tagValue = tags ?? tag;
  if (tagValue) filter.tags = tagValue;

  if (rx !== undefined) {
    filter.rxRequired = rx;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }

  const [products, totalItems] = await Promise.all([
    (await Product.find(filter)).sort(sort).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    status: 200,
    message: 'Successfully found products!',
    data: products,
    page: Number(page),
    limit: Number(limit),
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
  });
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ status: 404, message: 'Product not found' });
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found product!',
    data: product,
  });
};
