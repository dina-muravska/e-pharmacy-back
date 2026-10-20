import { Store } from '../models/storeModel.js';

export const getStoresList = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const [stores, totalItems] = await Promise.all([
    Store.find().skip(skip).limit(Number(limit)),
    Store.countDocuments(),
  ]);

  res.status(200).json({
    status: 200,
    message: 'Successfully found stores list!',
    data: stores,
    page: Number(page),
    limit: Number(limit),
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
  });
};

export const getNearestStores = async (req, res) => {
  const { lng, lat, max = 5000, limit = 10 } = req.query;

  const stores = await Store.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [Number(lng), Number(lat)],
        },
        $maxDistance: Number(max),
      },
    },
  }).limit(Number(limit));

  res.status(200).json({
    status: 200,
    message: 'Successfully found nearest stores!',
    data: stores,
  });
};
